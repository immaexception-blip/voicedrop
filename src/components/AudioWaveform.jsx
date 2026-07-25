import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDuration } from '../utils/audioUtils';

export default function AudioWaveform({ 
  postId, 
  waveform = [], 
  duration = 15, 
  isPlaying = false, 
  onTogglePlay,
  title = "",
  transcript = ""
}) {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  // Simulated audio playback progress animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onTogglePlay();
            return 0;
          }
          return prev + (100 / (duration * 10 * (1 / speed)));
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, speed]);

  const handleBarClick = (index, total) => {
    const newProgress = (index / total) * 100;
    setProgress(newProgress);
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const currentSeconds = (progress / 100) * duration;

  return (
    <div className="audio-player-card">
      {title && <div className="voice-title">🎙️ {title}</div>}

      <div className="player-controls-row">
        {/* Play / Pause Toggle Button */}
        <button className="play-toggle-btn" onClick={onTogglePlay} title={isPlaying ? "Pause" : "Play Voice"}>
          {isPlaying ? <Pause size={20} fill="#18181b" color="#18181b" /> : <Play size={20} fill="#18181b" color="#18181b" style={{ marginLeft: '2px' }} />}
        </button>

        {/* Dynamic Interactive Audio Scrubber Waveform */}
        <div className="waveform-container">
          {waveform.map((heightPercent, idx) => {
            const barProgressPosition = (idx / waveform.length) * 100;
            const isPlayed = barProgressPosition <= progress;
            const isActivePlaying = isPlaying && Math.abs(barProgressPosition - progress) < 10;

            return (
              <div
                key={idx}
                className={`wave-bar ${isPlayed ? 'played' : ''} ${isActivePlaying ? 'active-playing' : ''}`}
                style={{ height: `${heightPercent}%` }}
                onClick={() => handleBarClick(idx, waveform.length)}
              />
            );
          })}
        </div>

        {/* Speed Control */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <button className="speed-badge" onClick={toggleSpeed}>
            {speed}x
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {formatDuration(currentSeconds)} / {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Spoken Voice Transcript Collapsible Caret Toggle */}
      {transcript && (
        <div style={{ marginTop: '8px' }}>
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.74rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            {showTranscript ? <ChevronUp size={13} color="var(--accent-aqua)" /> : <ChevronDown size={13} color="var(--accent-aqua)" />}
            <span>{showTranscript ? 'Hide Transcript' : 'Read Transcript'}</span>
          </button>

          {showTranscript && (
            <div style={{
              marginTop: '6px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              background: 'var(--bg-glass)',
              padding: '8px 12px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--accent-aqua)',
              lineHeight: '1.3'
            }}>
              "{transcript}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
