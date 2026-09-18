'use client';

import React from 'react';
import { Clock, Home } from 'lucide-react';
import { MoodKey, MoodQuote, MoodOption, SUPPORTED_MOODS } from '@/lib/types';
import { ReflectionJournal } from '@/components/ReflectionJournal';

interface QuoteDisplayProps {
  moodKey: MoodKey;
  moodLabel: string;
  quoteData: MoodQuote;
  onBack: () => void;
  onSelectMood: (moodKey: MoodKey, moodLabel: string) => void;
}

const moodEmojis: Record<MoodKey, string> = {
  sad: '😔',
  tired: '😴',
  disconnected: '🌫️',
  heavy: '🪨',
  broken: '💔',
  loss: '🕊️',
};

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  moodKey,
  moodLabel,
  quoteData,
  onBack,
  onSelectMood,
}) => {
  return (
    <section
      id="quote-view"
      className="view-section active"
      aria-live="polite"
      aria-labelledby="selected-mood-badge"
    >
      <div className="quote-card">
        <div className="mood-badge-container">
          <span className="badge-label">You selected</span>
          <span id="selected-mood-badge" className="mood-badge">
            {moodLabel}
          </span>
        </div>

        <blockquote className="quote-block">
          <p id="quote-text" className="quote-text">
            “{quoteData.quote}”
          </p>
          {quoteData.author && (
            <footer id="quote-author" className="quote-author">
              — {quoteData.author}
            </footer>
          )}
        </blockquote>

        <div className="reflection-box">
          <div className="reflection-label">A gentle reminder</div>
          <p id="reflection-text" className="reflection-text">
            {quoteData.reflection}
          </p>
        </div>

        {quoteData.groundingExercise && (
          <div id="grounding-box" className="grounding-box">
            <div className="grounding-header">
              <Clock size={18} aria-hidden="true" />
              <span>60-Second Grounding</span>
            </div>
            <p id="grounding-text" className="grounding-text">
              {quoteData.groundingExercise}
            </p>
          </div>
        )}

        <ReflectionJournal moodKey={moodKey} moodLabel={moodLabel} />

        <div className="emotion-quick-access" aria-labelledby="emotion-quick-access-title">
          <div className="emotion-quick-access-heading">
            <span className="emotion-quick-access-kicker">Quick check-in</span>
            <h3 id="emotion-quick-access-title">Choose another feeling</h3>
          </div>
          <div className="emotion-quick-access-grid">
            {SUPPORTED_MOODS.map((mood: MoodOption) => (
              <button
                key={mood.key}
                type="button"
                className={`emotion-quick-button ${mood.key === moodKey ? 'selected' : ''}`}
                onClick={() => onSelectMood(mood.key, mood.label)}
                aria-label={`${mood.label}: ${mood.description}`}
                aria-current={mood.key === moodKey ? 'true' : undefined}
              >
                <span className="emotion-quick-emoji" aria-hidden="true">{moodEmojis[mood.key]}</span>
                <span className="emotion-quick-copy">
                  <strong>{mood.label}</strong>
                  <small>{mood.description}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="quote-actions">
          <button
            className="btn-secondary quote-home-button"
            type="button"
            onClick={onBack}
            aria-label="Return to Ping Check home"
          >
            <Home size={16} aria-hidden="true" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </section>
  );
};
