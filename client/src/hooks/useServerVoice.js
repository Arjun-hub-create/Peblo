import { useRef, useCallback, useState } from 'react';
import api from '../services/api';

function pickMimeType() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return types.find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || '';
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') return reject(new Error('Could not read audio.'));
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read audio.'));
    reader.readAsDataURL(blob);
  });
}

function formatFromMime(mimeType) {
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

/**
 * Records mic audio and transcribes via Peblo API (Whisper on OpenRouter).
 */
export default function useServerVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const startedAtRef = useRef(0);
  const levelRafRef = useRef(null);
  const audioCtxRef = useRef(null);

  const stopLevelMonitor = useCallback(() => {
    if (levelRafRef.current) cancelAnimationFrame(levelRafRef.current);
    levelRafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setAudioLevel(0);
  }, []);

  const startLevelMonitor = useCallback((stream) => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length / 255;
        setAudioLevel(avg);
        levelRafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* level meter optional */
    }
  }, []);

  const cleanupStream = useCallback(() => {
    stopLevelMonitor();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopLevelMonitor]);

  const transcribeBlob = useCallback(async (blob, mimeType) => {
    const audioBase64 = await blobToBase64(blob);
    const res = await api.post(
      '/notes/transcribe',
      {
        audioBase64,
        mimeType,
        format: formatFromMime(mimeType),
      },
      { timeout: 90000 },
    );
    const text = res.data?.text?.trim();
    if (!text) throw new Error('No speech detected. Speak clearly for 2+ seconds.');
    return text;
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone is not available in this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    streamRef.current = stream;
    startLevelMonitor(stream);

    const mimeType = pickMimeType();
    let recorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }

    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data?.size) chunksRef.current.push(e.data);
    };

    recorder.start(400);
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setIsRecording(true);
    return recorder;
  }, [startLevelMonitor]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        cleanupStream();
        return reject(new Error('Not recording.'));
      }

      const elapsed = Date.now() - startedAtRef.current;
      if (elapsed < 1500) {
        return reject(new Error('Speak for at least 2 seconds, then tap the mic again.'));
      }

      recorder.onstop = async () => {
        setIsRecording(false);
        cleanupStream();
        try {
          const mimeType = recorder.mimeType || pickMimeType() || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];

          if (!blob.size) {
            reject(new Error('No audio captured. Check mic permissions and try again.'));
            return;
          }

          setIsTranscribing(true);
          const text = await transcribeBlob(blob, mimeType);
          setIsTranscribing(false);
          resolve(text);
        } catch (err) {
          setIsTranscribing(false);
          reject(err);
        }
      };

      try {
        if (recorder.state === 'recording') recorder.requestData();
      } catch {
        /* some browsers lack requestData */
      }
      recorder.stop();
    });
  }, [cleanupStream, transcribeBlob]);

  const cancelRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.onstop = null;
      try {
        recorderRef.current.requestData();
      } catch {
        /* ignore */
      }
      recorderRef.current.stop();
    }
    chunksRef.current = [];
    setIsRecording(false);
    setIsTranscribing(false);
    cleanupStream();
  }, [cleanupStream]);

  return {
    isRecording,
    isTranscribing,
    audioLevel,
    isBusy: isRecording || isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
    supportsRecording: typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
  };
}
