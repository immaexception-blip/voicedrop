import React, { useState, useRef } from 'react';
import { X, Mic, Square, Play, Pause, RefreshCw, Upload, Check, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playRecordingBeep, generateVoiceBlob, playVoiceAudioSound, stopVoiceAudioSound } from '../utils/audioUtils';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  
  // Voice Bio states
  const [voiceBioTranscript, setVoiceBioTranscript] = useState(user.voiceBioTranscript || '');
  const [voiceBioDuration, setVoiceBioDuration] = useState(user.voiceBioDuration || 8);
  const [voiceBioAudioUrl, setVoiceBioAudioUrl] = useState(user.voiceBioAudioUrl || null);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  if (!isOpen) return null;

  // Handle Photo Upload from Gallery
  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        showToast("Profile photo loaded! 📷");
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Voice Bio Recording
  const startVoiceBioRecord = async () => {
    playRecordingBeep();
    setIsRecording(true);
    setRecordingSeconds(0);
    setVoiceBioAudioUrl(null);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    try {
      audioChunksRef.current = [];
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        let options = {};
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
          if (MediaRecorder.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };
          else if (MediaRecorder.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
          else if (MediaRecorder.isTypeSupported('audio/aac')) options = { mimeType: 'audio/aac' };
        }

        mediaRecorderRef.current = new MediaRecorder(stream, options);
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const type = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type });
          
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) setVoiceBioAudioUrl(reader.result);
          };
          reader.readAsDataURL(blob);
          stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorderRef.current.start(100);
      }
    } catch (e) {}
  };

  // Stop Voice Bio Recording
  const stopVoiceBioRecord = async () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    const duration = recordingSeconds > 0 ? recordingSeconds : 8;
    setVoiceBioDuration(duration);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      const synthesized = await generateVoiceBlob("Voice Bio", duration);
      if (synthesized) setVoiceBioAudioUrl(synthesized.url);
    }
  };

  const handleSave = () => {
    updateUserProfile({
      name,
      username,
      avatar,
      bio,
      voiceBioTranscript: voiceBioTranscript || "Listen to my personal Voice Bio!",
      voiceBioDuration: voiceBioDuration || 8,
      voiceBioAudioUrl
    });
    onClose();
  };

  return (
    <div className="full-page-screen">
      {/* Instagram-style Header */}
      <div className="full-page-header">
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={22} />
        </button>

        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          Edit Profile
        </span>

        <button 
          onClick={handleSave}
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
          Done
        </button>
      </div>

      {/* Full Page Body */}
      <div className="full-page-body">
        {/* Profile Picture Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div className="avatar-ring" style={{ width: '96px', height: '96px', marginBottom: '12px' }}>
            <img src={avatar} alt="Profile" className="avatar-img" />
          </div>

          <button 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--accent-aqua)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Upload size={14} color="var(--accent-aqua)" />
            <span>Change Profile Picture</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleAvatarUpload} 
          />
        </div>

        {/* Name & Username Fields */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            NAME
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="text-input-field" 
          />

          <label style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', marginTop: '12px' }}>
            USERNAME
          </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="text-input-field" 
          />

          <label style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', marginTop: '12px' }}>
            BIO
          </label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="text-input-field" 
            rows={3} 
          />
        </div>

        {/* Voice Bio Studio */}
        <div className="recorder-box" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              RECORD VOICE BIO 🎙️
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-aqua)', fontWeight: '700' }}>
              {voiceBioAudioUrl ? "Voice Bio Recorded ✅" : "Optional"}
            </span>
          </div>

          {!voiceBioAudioUrl ? (
            <>
              <button 
                className={`record-btn-trigger ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopVoiceBioRecord : startVoiceBioRecord}
              >
                {isRecording ? <Square size={24} fill="#0f172a" color="#0f172a" /> : <Mic size={28} color="#0f172a" />}
              </button>

              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '600' }}>
                {isRecording ? `🔴 Recording Voice Bio (${recordingSeconds}s)... Tap to stop` : "Tap to record your 8s Voice Bio"}
              </span>
            </>
          ) : (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-aqua)', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Check size={16} />
                <span>Voice Bio Attached ({voiceBioDuration}s)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button 
                  onClick={() => {
                    if (isPlayingPreview) {
                      setIsPlayingPreview(false);
                      stopVoiceAudioSound();
                    } else {
                      setIsPlayingPreview(true);
                      playVoiceAudioSound({
                        audioUrl: voiceBioAudioUrl,
                        duration: voiceBioDuration,
                        onEnded: () => setIsPlayingPreview(false)
                      });
                    }
                  }}
                  style={{
                    background: 'var(--gradient-aqua)',
                    border: 'none',
                    color: '#0f172a',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isPlayingPreview ? <Pause size={14} fill="#0f172a" color="#0f172a" /> : <Play size={14} fill="#0f172a" color="#0f172a" />}
                  <span>{isPlayingPreview ? "Pause" : "Preview Voice Bio"}</span>
                </button>

                <button 
                  onClick={() => { setVoiceBioAudioUrl(null); setIsRecording(false); }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--bg-card-border)',
                    color: 'var(--text-secondary)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={13} />
                  <span>Re-record</span>
                </button>
              </div>
            </div>
          )}

          <input 
            type="text"
            placeholder="Voice bio transcript text..."
            value={voiceBioTranscript}
            onChange={(e) => setVoiceBioTranscript(e.target.value)}
            className="text-input-field"
            style={{ marginTop: '12px' }}
          />
        </div>

        {/* Save Button */}
        <button className="primary-btn" onClick={handleSave} style={{ padding: '14px', fontSize: '1rem' }}>
          ✨ Save Profile Changes
        </button>
      </div>
    </div>
  );
}
