'use client';

import React from 'react';
import Link from 'next/link';
import { Wind, MessageSquareHeart, Info, Lock, Sparkles } from 'lucide-react';
import { MoodKey, MoodOption, SUPPORTED_MOODS } from '@/lib/types';

interface MoodSelectorProps {
  onSelectMood: (moodKey: MoodKey, moodLabel: string) => void;
  onToggleBreathing: () => void;
  onToggleVent: () => void;
  onToggleGrounding: () => void;
  breathingActive: boolean;
  ventActive: boolean;
  groundingActive: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  onSelectMood,
  onToggleBreathing,
  onToggleVent,
  onToggleGrounding,
  breathingActive,
  ventActive,
  groundingActive,
}) => {
  return (
    <section id="mood-view" className="view-section active" aria-labelledby="prompt-heading">
      <div className="section-intro">
        <h2 id="prompt-heading" className="prompt-text">
          Tap the word that feels closest to what you&apos;re holding:
        </h2>
      </div>

      <div id="mood-grid" className="mood-grid" role="group" aria-label="Mood selection buttons">
        {SUPPORTED_MOODS.map((mood: MoodOption) => (
          <button
            key={mood.key}
            type="button"
            className="btn-mood"
            data-mood={mood.key}
            onClick={() => onSelectMood(mood.key, mood.label)}
            aria-label={`Select mood: ${mood.label}. ${mood.description}`}
          >
            <span className="mood-name">{mood.label}</span>
            <span className="mood-desc">{mood.description}</span>
          </button>
        ))}
      </div>

      {/* Quick Wellness Actions Bar */}
      <div className="quick-tools-bar">
        <button
          id="btn-toggle-breathing"
          className={`tool-chip ${breathingActive ? 'active' : ''}`}
          type="button"
          onClick={onToggleBreathing}
          aria-expanded={breathingActive}
          aria-controls="breathing-card"
        >
          <Wind size={16} aria-hidden="true" />
          <span>Take a Mindful Breath</span>
        </button>

        <button
          id="btn-toggle-vent"
          className={`tool-chip ${ventActive ? 'active' : ''}`}
          type="button"
          onClick={onToggleVent}
          aria-expanded={ventActive}
          aria-controls="venting-card"
        >
          <MessageSquareHeart size={16} aria-hidden="true" />
          <span>Vent &amp; Unburden</span>
        </button>

        <button
          id="btn-toggle-grounding"
          className={`tool-chip ${groundingActive ? 'active' : ''}`}
          type="button"
          onClick={onToggleGrounding}
          aria-expanded={groundingActive}
          aria-controls="grounding-card"
        >
          <Sparkles size={16} aria-hidden="true" />
          <span>Grounding Tools</span>
        </button>

        <Link
          href="/about"
          className="tool-chip about-chip"
          title="Learn about the initiative and working committees"
        >
          <Info size={15} aria-hidden="true" />
          <span>About the Team</span>
        </Link>
      </div>

      {/* Privacy Assurance */}
      <div className="privacy-note">
        <Lock className="icon-lock" size={16} aria-hidden="true" />
        <span>Fully anonymous. No student numbers, names, or accounts are recorded.</span>
      </div>
    </section>
  );
};
