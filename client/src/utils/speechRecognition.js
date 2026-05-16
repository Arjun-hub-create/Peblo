/** Web Speech API helpers (Chrome / Edge). */

export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function speechErrorMessage(errorCode) {
  switch (errorCode) {
    case 'not-allowed':
      return 'Microphone access denied. Allow the mic in your browser settings, then try again.';
    case 'network':
      return 'Speech service needs internet (Chrome uses Google). Type your question instead.';
    case 'no-speech':
      return 'No speech detected. Try again or type your question.';
    case 'audio-capture':
      return 'No microphone found. Connect a mic or type your question.';
    case 'service-not-allowed':
      return 'Speech recognition is blocked on this page. Use HTTPS or type instead.';
    case 'aborted':
      return null;
    default:
      return errorCode
        ? `Voice error (${errorCode}). Type your question instead.`
        : 'Voice recognition failed. Type your question instead.';
  }
}

/**
 * @param {object} opts
 * @param {(transcript: string, isFinal: boolean) => void} opts.onResult
 * @param {() => void} [opts.onStart]
 * @param {() => void} [opts.onEnd]
 * @param {(message: string | null, code: string) => void} [opts.onError]
 * @param {boolean} [opts.continuous]
 */
export function startSpeechRecognition({
  onResult,
  onStart,
  onEnd,
  onError,
  continuous = false,
}) {
  const SR = getSpeechRecognition();
  if (!SR) {
    onError?.('Speech recognition is not supported. Use Chrome or Edge.', 'unsupported');
    return null;
  }

  const recognition = new SR();
  recognition.continuous = continuous;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onstart = () => onStart?.();

  recognition.onresult = (e) => {
    let full = '';
    for (let i = 0; i < e.results.length; i++) {
      full += e.results[i][0].transcript;
    }
    const isFinal = e.results.length > 0 && e.results[e.results.length - 1].isFinal;
    if (full) onResult(full, isFinal);
  };

  recognition.onend = () => onEnd?.();

  recognition.onerror = (e) => {
    const msg = speechErrorMessage(e.error);
    onError?.(msg, e.error);
  };

  try {
    recognition.start();
  } catch {
    onError?.('Could not start microphone. Type your question instead.', 'start-failed');
    return null;
  }

  return recognition;
}
