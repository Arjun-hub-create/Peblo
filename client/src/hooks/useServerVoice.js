import { useRef, useCallback, useState } from 'react';
import api from '../services/api';

function pickMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return types.find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || '';
}

/**
 * Records mic audio and transcribes via Peblo API (Whisper) — works on deployed HTTPS
 * without Chrome's Google Web Speech service.
 */
export default function useServerVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const transcribeBlob = useCallback(async (blob, mimeType) => {
    const formData = new FormData();
    formData.append('audio', blob, mimeType.includes('mp4') ? 'recording.m4a' : 'recording.webm');
    const res = await api.post('/notes/transcribe', formData, { timeout: 90000 });
    const text = res.data?.text?.trim();
    if (!text) throw new Error('No speech detected. Try again or type instead.');
    return text;
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone is not available in this browser.');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mimeType = pickMimeType();
    const options = mimeType ? { mimeType } : undefined;
    const recorder = new MediaRecorder(stream, options);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data?.size) chunksRef.current.push(e.data);
    };
    recorder.start(250);
    recorderRef.current = recorder;
    setIsRecording(true);
    return recorder;
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        cleanupStream();
        return reject(new Error('Not recording.'));
      }
      recorder.onstop = async () => {
        setIsRecording(false);
        cleanupStream();
        try {
          const mimeType = recorder.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];
          if (!blob.size) {
            reject(new Error('No audio captured. Try again.'));
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
      recorder.stop();
    });
  }, [cleanupStream, transcribeBlob]);

  const cancelRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.onstop = null;
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
    isBusy: isRecording || isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
    supportsRecording: typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
  };
}
