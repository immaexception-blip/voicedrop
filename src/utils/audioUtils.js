// Web Audio & Sound Engine for VoiceDrop

let globalAudioInstance = null;

/**
 * Dynamic real-time relative time formatter (e.g. "Just now", "5 mins ago", "1 hr ago", "2 days ago")
 */
export const formatRelativeTime = (timestampOrString) => {
  if (!timestampOrString) return "Just now";

  let timestamp = typeof timestampOrString === 'number' ? timestampOrString : Date.parse(timestampOrString);

  if (isNaN(timestamp)) {
    if (timestampOrString === "Just now") return "Just now";
    return timestampOrString;
  }

  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffSeconds < 45) return "Just now";
  
  const diffMins = Math.floor(diffSeconds / 60);
  if (diffMins < 60) {
    return diffMins === 1 ? "1 min ago" : `${diffMins} mins ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hr ago" : `${diffHours} hrs ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  return diffWeeks === 1 ? "1 wk ago" : `${diffWeeks} wks ago`;
};

/**
 * Play recording start beep notification sound (880Hz high-pitch chime)
 */
export const playRecordingBeep = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch chime
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    setTimeout(() => ctx.close(), 300);
  } catch (e) {
    console.warn("Beep audio context error", e);
  }
};

/**
 * Plays real recorded voice sound for a VoiceDrop (ONLY plays authentic user voice audio).
 */
export const playVoiceAudioSound = ({ audioUrl, duration = 10, onEnded, onProgress }) => {
  stopVoiceAudioSound();

  // 1. If real recorded Blob URL, Data URL (Base64), or HTTP Audio URL exists, play the raw recorded audio!
  if (audioUrl && (audioUrl.startsWith('blob:') || audioUrl.startsWith('data:') || audioUrl.startsWith('http'))) {
    try {
      globalAudioInstance = new Audio(audioUrl);
      
      globalAudioInstance.ontimeupdate = () => {
        if (globalAudioInstance && onProgress) {
          const current = globalAudioInstance.currentTime;
          const dur = globalAudioInstance.duration || duration;
          onProgress((current / dur) * 100);
        }
      };

      globalAudioInstance.onended = () => {
        if (onEnded) onEnded();
      };

      const playPromise = globalAudioInstance.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Audio autoplay blocked by browser", err);
          synthesizeAudioPlayback(duration, onEnded, onProgress);
        });
      }
      return;
    } catch (e) {
      console.warn("HTML5 Audio playback error", e);
    }
  }

  // 2. Web Audio Acoustic Tone Fallback (NO robot speech text reading)
  synthesizeAudioPlayback(duration, onEnded, onProgress);
};

/**
 * Stop any ongoing audio playback immediately
 */
export const stopVoiceAudioSound = () => {
  if (globalAudioInstance) {
    globalAudioInstance.pause();
    globalAudioInstance.currentTime = 0;
    globalAudioInstance = null;
  }
};

/**
 * Web Audio API synthesizer for playing smooth acoustic tones through speaker (fallback only)
 */
const synthesizeAudioPlayback = (durationSec = 10, onEnded, onProgress) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const startTime = ctx.currentTime;
    const endTime = startTime + durationSec;

    const notes = [220, 261.63, 329.63, 392.0, 440];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + durationSec / 2);
      osc.frequency.exponentialRampToValueAtTime(freq, endTime);

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), startTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(endTime);
    });

    const interval = setInterval(() => {
      const elapsed = ctx.currentTime - startTime;
      const progressPercent = Math.min(100, (elapsed / durationSec) * 100);
      if (onProgress) onProgress(progressPercent);

      if (elapsed >= durationSec) {
        clearInterval(interval);
        ctx.close();
        if (onEnded) onEnded();
      }
    }, 100);

    globalAudioInstance = {
      pause: () => {
        clearInterval(interval);
        try { ctx.close(); } catch(e){}
      }
    };
  } catch (e) {
    console.warn("Web Audio synthesis error", e);
  }
};

/**
 * Format seconds to mm:ss format
 */
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Generate visual waveform bars array for static or dynamic rendering
 */
export const generateWaveformHeights = (count = 35, seed = 1) => {
  const heights = [];
  let currentSeed = seed;
  for (let i = 0; i < count; i++) {
    const pseudoRand = (Math.sin(currentSeed * 9999) + 1) / 2;
    currentSeed += 1;
    const centerFactor = Math.sin((i / count) * Math.PI);
    const heightPercentage = Math.max(18, Math.min(95, Math.floor((pseudoRand * 0.75 + 0.25) * centerFactor * 100 + 20)));
    heights.push(heightPercentage);
  }
  return heights;
};

/**
 * Optional Speech Synthesizer for Voice Bios if explicitly requested
 */
export const speakCaptionText = (text) => {
  if (!('speechSynthesis' in window) || !text) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
};

/**
 * Synthesizes Audio Blob for fallbacks
 */
export const generateVoiceBlob = async (text, durationSec = 4) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    const sampleRate = ctx.sampleRate;
    const totalSamples = sampleRate * durationSec;
    const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const data = buffer.getChannelData(0);

    const baseFreqs = [220, 261.63, 329.63, 392.0, 440];
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      baseFreqs.forEach((freq, idx) => {
        const envelope = Math.sin((Math.PI * t) / durationSec);
        const pitchMod = Math.sin(2 * Math.PI * 4 * t);
        const vocalFormant = Math.sin(2 * Math.PI * (freq + pitchMod * 10) * t);
        sample += vocalFormant * envelope * (0.2 / (idx + 1));
      });
      data[i] = sample;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(dest);
    source.start();

    const mediaRecorder = new MediaRecorder(dest.stream);
    const chunks = [];

    return new Promise((resolve) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, duration: durationSec });
        ctx.close();
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, durationSec * 1000);
    });
  } catch (err) {
    console.warn("Voice blob generation error", err);
    return null;
  }
};
