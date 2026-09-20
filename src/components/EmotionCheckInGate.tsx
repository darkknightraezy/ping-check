'use client';

import React, { useEffect } from 'react';
import { MoodKey, MoodOption, SUPPORTED_MOODS } from '@/lib/types';

const moodEmojis: Record<MoodKey, string> = {
  sad: '😔',
  happy: '😊',
  tired: '😴',
  content: '🌿',
  disconnected: '🌫️',
  calm: '🍃',
  heavy: '🪨',
  grateful: '🙏',
  broken: '💔',
  excited: '✨',
  loss: '🕊️',
  hopeful: '🌱',
  'just-okay': '😐',
};

interface EmotionCheckInGateProps {
  onSelectMood: (moodKey: MoodKey, moodLabel: string) => void;
  onExploreFirst?: () => void;
}

export const EmotionCheckInGate: React.FC<EmotionCheckInGateProps> = ({ onSelectMood, onExploreFirst }) => (
  <EmotionCheckInGateContent onSelectMood={onSelectMood} onExploreFirst={onExploreFirst} />
);

const EmotionCheckInGateContent: React.FC<EmotionCheckInGateProps> = ({ onSelectMood, onExploreFirst }) => {
  useEffect(() => {
    document.body.classList.add('emotion-gate-open');
    return () => document.body.classList.remove('emotion-gate-open');
  }, []);

  return (
    <div className="emotion-gate-backdrop" role="dialog" aria-modal="true" aria-labelledby="emotion-gate-title">
    <div className="emotion-gate-window">
      <span className="emotion-gate-kicker">Your first gentle signal</span>
      <h2 id="emotion-gate-title">How are you arriving today?</h2>
      <p className="emotion-gate-lead">Choose the word that feels closest. You can change your mind later—there is no right answer.</p>
      <div className="emotion-gate-grid" role="group" aria-label="Choose your emotion">
        {SUPPORTED_MOODS.map((mood: MoodOption) => (
          <button
            key={mood.key}
            type="button"
            className="emotion-gate-choice"
            onClick={() => onSelectMood(mood.key, mood.label)}
            aria-label={`Check in as ${mood.label}. ${mood.description}`}
          >
            <span className="emotion-gate-emoji" aria-hidden="true">{moodEmojis[mood.key]}</span>
            <span className="emotion-gate-name">{mood.label}</span>
          </button>
        ))}
      </div>
      {onExploreFirst && (
        <button type="button" className="emotion-gate-explore" onClick={onExploreFirst}>
          Explore Ping Check first
        </button>
      )}
      <p className="emotion-gate-note">Your choice stays private on this device unless you choose to use the anonymous community features.</p>
    </div>
    </div>
  );
};
