import React, { useState } from 'react';
import { X, Mic, Square, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../utils/audioUtils';

export default function VoiceCommentModal() {
  const { 
    isCommentModalOpen, 
    setIsCommentModalOpen, 
    targetCommentPostId, 
    addVoiceComment 
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');

  if (!isCommentModalOpen) return null;

  const handleStartRecord = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 15) {
          clearInterval(interval);
          setIsRecording(false);
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
  };

  const handleSubmitComment = () => {
    addVoiceComment(targetCommentPostId, {
      duration: seconds || 8,
      transcript: transcript || "Recorded a quick voice note reaction!"
    });
    setSeconds(0);
    setTranscript('');
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsCommentModalOpen(false)}>
      <div className="modal-content" style={{ maxHeight: '70%' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mic size={20} color="var(--accent-yellow)" />
            <span className="modal-title">Voice Reply</span>
          </div>
          <button className="close-btn" onClick={() => setIsCommentModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="recorder-box">
          <button 
            className={`record-btn-trigger ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? handleStopRecord : handleStartRecord}
            style={{ width: '64px', height: '64px' }}
          >
            {isRecording ? <Square size={22} fill="#18181b" color="#18181b" /> : <Mic size={28} color="#18181b" />}
          </button>

          <div className="timer-text">
            {formatDuration(seconds)} / 0:15
          </div>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isRecording ? "Recording your voice reply... Max 15s" : "Tap to record your voice reaction"}
          </span>
        </div>

        <input 
          type="text"
          placeholder="Brief comment transcript (optional)..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="text-input-field"
        />

        <button className="primary-btn" onClick={handleSubmitComment}>
          <Check size={18} inline style={{ marginRight: '6px' }} /> Drop Voice Comment
        </button>
      </div>
    </div>
  );
}
