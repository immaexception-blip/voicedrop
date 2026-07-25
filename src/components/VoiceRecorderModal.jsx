import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Play, Pause, RefreshCw, Sparkles, Sliders, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWaveformHeights, formatDuration, generateVoiceBlob, playVoiceAudioSound, stopVoiceAudioSound, playRecordingBeep } from '../utils/audioUtils';

const presetPhotos = [
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
];

const voiceMoods = [
  { id: 'natural', name: 'Natural Voice', icon: '🎙️' },
  { id: 'studio', name: 'Studio Clarity', icon: '✨' },
  { id: 'podcast', name: 'Warm Podcast', icon: '📻' },
  { id: 'ambient', name: 'Ambient Lounge', icon: '🌊' }
];

export default function VoiceRecorderModal() {
  const { isRecorderOpen, setIsRecorderOpen, addNewPost, showToast } = useApp();

  const [selectedPhoto, setSelectedPhoto] = useState(presetPhotos[0]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [voiceTitle, setVoiceTitle] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [textCaption, setTextCaption] = useState('');
  const [selectedMood, setSelectedMood] = useState('natural');
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  if (!isRecorderOpen) return null;

  // Handle Gallery Photo Selection
  const handleGalleryImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result);
        setCustomPhotoInput('');
        showToast("Photo loaded from gallery 📷");
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Live Audio Recording + Voice-to-Text Live Transcription
  const startMicrophoneRecording = async () => {
    // Play start recording chime beep
    playRecordingBeep();

    setIsRecording(true);
    setRecordingSeconds(0);
    setAudioBlobUrl(null);

    // 1. Android & iOS Live Speech-to-Text Transcriber
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsTranscribing(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let textResult = '';
          for (let i = 0; i < event.results.length; i++) {
            textResult += event.results[i][0].transcript + ' ';
          }
          if (textResult.trim()) {
            setVoiceTranscript(textResult.trim());
          }
        };

        recognitionRef.current.onerror = () => setIsTranscribing(false);
        recognitionRef.current.start();
      }
    } catch (e) {
      console.warn("Speech recognition not supported on device", e);
    }

    // 2. Live Audio Capture
    try {
      audioChunksRef.current = [];
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        let options = {};
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
          if (MediaRecorder.isTypeSupported('audio/mp4')) {
            options = { mimeType: 'audio/mp4' };
          } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            options = { mimeType: 'audio/webm;codecs=opus' };
          } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            options = { mimeType: 'audio/webm' };
          } else if (MediaRecorder.isTypeSupported('audio/aac')) {
            options = { mimeType: 'audio/aac' };
          }
        }

        mediaRecorderRef.current = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const type = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type });
          
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              setAudioBlobUrl(reader.result);
            }
          };
          reader.readAsDataURL(blob);

          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start(100);
      }
    } catch (err) {
      console.warn("Microphone access fallback", err);
    }
  };

  const stopMicrophoneRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(false);
    const durationSec = recordingSeconds > 0 ? recordingSeconds : 5;

    // Stop Speech Recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const synthesized = await generateVoiceBlob("Voice Note", durationSec);
      if (synthesized) {
        setAudioBlobUrl(synthesized.url);
      } else {
        setAudioBlobUrl('simulated_voice_blob');
      }
    }

    showToast("Voice caption recorded! 🎙️");
  };

  const handleResetRecord = () => {
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordingSeconds(0);
    setAudioBlobUrl(null);
    setVoiceTranscript('');
  };

  const handlePublish = () => {
    const finalPhoto = customPhotoInput || selectedPhoto;
    const hasAudio = !!audioBlobUrl;
    const duration = recordingSeconds > 0 ? recordingSeconds : (hasAudio ? 12 : 0);

    addNewPost({
      imageUrl: finalPhoto,
      audioUrl: audioBlobUrl,
      duration: duration,
      title: voiceTitle || (hasAudio ? "Voice Note Story" : ""),
      transcript: voiceTranscript || "",
      textCaption: textCaption,
      waveform: hasAudio ? generateWaveformHeights(32, Math.random() * 100) : [],
      tags: ["#VoiceDrop"]
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsRecorderOpen(false)}>
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-aqua)" />
            <span className="modal-title">Create VoiceDrop Post</span>
          </div>
          <button className="close-btn" onClick={() => setIsRecorderOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Responsive Photo Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            1. SELECT STORY PHOTO 📷
          </label>

          {/* Large Responsive Selected Image Preview */}
          <div style={{ width: '100%', height: '160px', borderRadius: '14px', overflow: 'hidden', border: '2px solid var(--accent-aqua)', marginBottom: '10px', position: 'relative' }}>
            <img src={customPhotoInput || selectedPhoto} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Action Row: Gallery Upload & Presets */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                flex: 1,
                background: 'var(--gradient-aqua)',
                color: '#0f172a',
                border: 'none',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} />
              <span>Choose from Phone Gallery</span>
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleGalleryImageUpload}
            />
          </div>

          {/* Preset Images Grid */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', marginBottom: '10px' }}>
            {presetPhotos.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt={`Preset ${idx}`} 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: (selectedPhoto === url && !customPhotoInput) ? '3px solid var(--accent-aqua)' : '1px solid var(--bg-card-border)',
                  opacity: (selectedPhoto === url && !customPhotoInput) ? 1 : 0.7
                }}
                onClick={() => {
                  setSelectedPhoto(url);
                  setCustomPhotoInput('');
                }}
              />
            ))}
          </div>

          <input 
            type="text"
            placeholder="Or paste custom image URL link..."
            value={customPhotoInput}
            onChange={(e) => setCustomPhotoInput(e.target.value)}
            className="text-input-field"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
          />
        </div>

        {/* Step 2: Optional Voice Recording */}
        <div className="recorder-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              2. VOICE CAPTION (OPTIONAL 🎙️)
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-aqua)', fontWeight: '700' }}>
              {audioBlobUrl ? "Voice Recorded ✅" : "Optional"}
            </span>
          </div>

          {!audioBlobUrl ? (
            <>
              <button 
                className={`record-btn-trigger ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopMicrophoneRecording : startMicrophoneRecording}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <Square size={26} fill="#0f172a" color="#0f172a" /> : <Mic size={32} color="#0f172a" />}
              </button>

              <div className="timer-text">
                {formatDuration(recordingSeconds)}
              </div>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '600' }}>
                {isRecording ? "🔴 Recording & transcribing live voice... Tap to finish" : "Tap microphone to record voice caption"}
              </span>
            </>
          ) : (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--accent-aqua)', fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Check size={18} />
                <span>Voice Caption Attached ({recordingSeconds || 8}s)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button 
                  onClick={() => {
                    if (isPlayingPreview) {
                      setIsPlayingPreview(false);
                      stopVoiceAudioSound();
                    } else {
                      setIsPlayingPreview(true);
                      playVoiceAudioSound({
                        audioUrl: audioBlobUrl,
                        duration: recordingSeconds || 8,
                        onEnded: () => setIsPlayingPreview(false)
                      });
                    }
                  }}
                  style={{
                    background: 'var(--gradient-aqua)',
                    border: 'none',
                    color: '#0f172a',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isPlayingPreview ? <Pause size={14} fill="#0f172a" color="#0f172a" /> : <Play size={14} fill="#0f172a" color="#0f172a" />}
                  <span>{isPlayingPreview ? "Pause Preview" : "Play Preview"}</span>
                </button>
                
                <button 
                  onClick={handleResetRecord}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--bg-card-border)',
                    color: 'var(--text-secondary)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Remove Voice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Voice Mood Presets */}
        {audioBlobUrl && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sliders size={14} color="var(--accent-aqua)" /> VOICE MOOD FILTER
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {voiceMoods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  style={{
                    background: selectedMood === m.id ? 'var(--gradient-aqua)' : 'var(--bg-glass)',
                    color: selectedMood === m.id ? '#0f172a' : 'var(--text-primary)',
                    border: selectedMood === m.id ? 'none' : '1px solid var(--bg-card-border)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Live Speech-to-Text Transcription & Text Captions */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            3. VOICE-TO-TEXT TRANSCRIPT & CAPTIONS 📝
          </label>

          <input 
            type="text"
            placeholder="Voice Story Title (optional)..."
            value={voiceTitle}
            onChange={(e) => setVoiceTitle(e.target.value)}
            className="text-input-field"
          />

          <textarea 
            placeholder={isTranscribing ? "🎙️ Transcribing your spoken voice live..." : "Spoken voice transcript (auto-transcribed or type manually)..."}
            value={voiceTranscript}
            onChange={(e) => setVoiceTranscript(e.target.value)}
            className="text-input-field"
            rows={2}
          />

          <input 
            type="text"
            placeholder="Optional text caption & hashtags (#VoiceDrop)..."
            value={textCaption}
            onChange={(e) => setTextCaption(e.target.value)}
            className="text-input-field"
          />
        </div>

        {/* Publish Button */}
        <button className="primary-btn" onClick={handlePublish}>
          🚀 Share Post to Feed
        </button>
      </div>
    </div>
  );
}
