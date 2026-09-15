'use client';

import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { MoodKey, MoodQuote } from '@/lib/types';
import { ReflectionJournal } from '@/components/ReflectionJournal';

interface QuoteDisplayProps {
  moodKey: MoodKey;
  moodLabel: string;
  quoteData: MoodQuote;
  onBack: () => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  moodKey,
  moodLabel,
  quoteData,
  onBack,
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

        <div className="quote-actions">
          <button
            id="btn-back"
            className="btn-secondary"
            type="button"
            onClick={onBack}
            aria-label="Return to mood selection"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Check in with another feeling</span>
          </button>
        </div>
      </div>
    </section>
  );
};
