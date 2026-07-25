import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Play, Pause, RefreshCw, Sparkles, Sliders, Check, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWaveformHeights, formatDuration, generateVoiceBlob, playVoiceAudioSound, stopVoiceAudioSound, playRecordingBeep } from '../utils/audioUtils';

const presetPhotos = [
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
];

const voiceMoods = [
  { id: 'natural', name: 'Natural Voice' },
  { id: 'studio', name: 'Studio Clarity' },
  { id: 'podcast', name: 'Warm Podcast' },
  { id: 'ambient', name: 'Ambient Lounge' }
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

  const startMicrophoneRecording = async () => {
    playRecordingBeep();
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    setVoiceTranscript('');

    // Setup Web Speech API for Android & Browser Speech-to-Text Transcription
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsTranscribing(true);
        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setVoiceTranscript(currentTranscript);
          }
        };
        recognition.onerror = () => setIsTranscribing(false);
        recognition.onend = () => setIsTranscribing(false);

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("Speech recognition error:", e);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      showToast("Recording live voice caption...");
    } catch (e) {
      // Fallback synthetic voice blob generator if mic permission denied
      setIsRecording(true);
      showToast("Recording voice...");
    }
  };

  const stopMicrophoneRecording = () => {
    setIsRecording(false);
    setIsTranscribing(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const fallbackBlobUrl = generateVoiceBlob(recordingSeconds || 8);
      setAudioBlobUrl(fallbackBlobUrl);
    }
  };

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoInput(event.target.result);
        showToast("Photo selected from gallery!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetRecord = () => {
    stopVoiceAudioSound();
    setIsPlayingPreview(false);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    setVoiceTranscript('');
  };

  const handlePublish = () => {
    const finalPhoto = customPhotoInput.trim() || selectedPhoto;
    const duration = recordingSeconds || (audioBlobUrl ? 12 : 0);
    const hasAudio = duration > 0;

    addNewPost({
      imageUrl: finalPhoto,
      audioUrl: audioBlobUrl,
      duration: duration,
      title: voiceTitle || (hasAudio ? "Voice Note Story" : ""),
      transcript: voiceTranscript || "",
      textCaption: textCaption,
      waveform: hasAudio ? generateWaveformHeights(32, Math.random() * 100) : []
    });
  };

  return (
    <div className="full-page-screen">
      {/* Instagram-style Full Page Header */}
      <div className="full-page-header">
        <button 
          onClick={() => setIsRecorderOpen(false)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={18} color="var(--accent-aqua)" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            New VoiceDrop
          </span>
        </div>

        <button 
          onClick={handlePublish}
          style={{
            background: 'var(--gradient-aqua)',
            border: 'none',
            color: '#0f172a',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          Share
        </button>
      </div>

      {/* Full Page Studio Scrollable Body */}
      <div className="full-page-body">
        {/* Step 1: Responsive Photo Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            1. SELECT STORY PHOTO
          </label>

          {/* Large Image Preview */}
          <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--accent-aqua)', marginBottom: '12px', position: 'relative' }}>
            <img src={customPhotoInput || selectedPhoto} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                flex: 1,
                background: 'var(--gradient-aqua)',
                color: '#0f172a',
                border: 'none',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} />
              <span>Choose from Gallery / Photos</span>
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleGalleryImageUpload}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', marginBottom: '10px' }}>
            {presetPhotos.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt={`Preset ${idx}`} 
                style={{
                  width: '64px',
                  height: '64px',
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
            placeholder="Or paste public image URL link..."
            value={customPhotoInput}
            onChange={(e) => setCustomPhotoInput(e.target.value)}
            className="text-input-field"
            style={{ fontSize: '0.8rem', padding: '10px 14px' }}
          />
        </div>

        {/* Step 2: Voice Recording */}
        <div className="recorder-box" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              2. VOICE CAPTION (OPTIONAL)
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-aqua)', fontWeight: '700' }}>
              {audioBlobUrl ? "Voice Recorded" : "Optional"}
            </span>
          </div>

          {!audioBlobUrl ? (
            <>
              <button 
                className={`record-btn-trigger ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopMicrophoneRecording : startMicrophoneRecording}
              >
                {isRecording ? <Square size={26} fill="#0f172a" color="#0f172a" /> : <Mic size={32} color="#0f172a" />}
              </button>

              <div className="timer-text">
                {formatDuration(recordingSeconds)}
              </div>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '600' }}>
                {isRecording ? "Recording live voice... Tap to finish" : "Tap microphone to record voice caption"}
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
          <div style={{ marginBottom: '20px' }}>
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
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Text Transcripts & Captions */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            3. VOICE TRANSCRIPT & CAPTIONS
          </label>

          <input 
            type="text"
            placeholder="Voice Story Title (optional)..."
            value={voiceTitle}
            onChange={(e) => setVoiceTitle(e.target.value)}
            className="text-input-field"
          />

          <textarea 
            placeholder={isTranscribing ? "Transcribing your spoken voice live..." : "Spoken voice transcript..."}
            value={voiceTranscript}
            onChange={(e) => setVoiceTranscript(e.target.value)}
            className="text-input-field"
            rows={2}
          />

          <input 
            type="text"
            placeholder="Optional text caption..."
            value={textCaption}
            onChange={(e) => setTextCaption(e.target.value)}
            className="text-input-field"
          />
        </div>

        {/* Bottom Full Share Button */}
        <button className="primary-btn" onClick={handlePublish} style={{ padding: '14px', fontSize: '1rem' }}>
          Share Post to Feed
        </button>
      </div>
    </div>
  );
}
