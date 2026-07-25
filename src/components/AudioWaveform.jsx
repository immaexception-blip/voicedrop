import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(false);

  // Simulated audio playback progress animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onTogglePlay(); // stop playing when finished
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

        {/* Speed Control & Mute */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <button className="speed-badge" onClick={toggleSpeed}>
            {speed}x
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {formatDuration(currentSeconds)} / {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Spoken Voice Transcript Preview */}
      {transcript && (
        <div style={{
          marginTop: '10px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 10px',
          borderRadius: '8px',
          borderLeft: '3px solid var(--accent-yellow)'
        }}>
          "{transcript}"
        </div>
      )}
    </div>
  );
}
