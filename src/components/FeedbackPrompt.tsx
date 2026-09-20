'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Star, X } from 'lucide-react';

const FEEDBACK_SESSION_KEY = 'ping-check-feedback-seen-v1';
const ratingLabels = [
  'Barely connected',
  'A little static',
  'Signal is stabilizing',
  'Feeling more connected',
  'Full bars',
];

export const FeedbackPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(FEEDBACK_SESSION_KEY)) return;
    } catch {
      // Continue without session storage when it is unavailable.
    }

    let hasTriggered = false;
    let retryTimer: number | null = null;
    const canShowPrompt = () => {
      const blockingSelectors = [
        'body.welcome-overlay-open',
        '#breathing-card',
        '#venting-card',
        '#grounding-card',
        '#support-drawer',
      ];
      return !blockingSelectors.some((selector) => document.querySelector(selector));
    };

    const showPrompt = () => {
      if (hasTriggered) return;
      if (!canShowPrompt()) {
        retryTimer = window.setTimeout(showPrompt, 1000);
        return;
      }
      hasTriggered = true;
      setIsVisible(true);
      window.removeEventListener('scroll', handleScroll);
    };

    const handleScroll = () => {
      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (reachedBottom) showPrompt();
    };

    const timer = window.setTimeout(showPrompt, 10000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const finish = () => {
    try {
      window.sessionStorage.setItem(FEEDBACK_SESSION_KEY, 'true');
    } catch {
      // Continue without session storage when it is unavailable.
    }
    setIsVisible(false);
  };

  const handleRating = (value: number) => {
    setRating(value);
    setIsComplete(true);
    window.setTimeout(finish, 1400);
  };

  if (!isVisible) return null;

  return (
    <div className="feedback-backdrop" role="presentation">
      <section
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        aria-describedby="feedback-description"
      >
        <button
          className="feedback-close"
          type="button"
          onClick={finish}
          aria-label="Close feedback window"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {!isComplete ? (
          <>
            <div className="feedback-icon" aria-hidden="true">
              <Radio size={22} />
            </div>
            <span className="feedback-kicker">Share your thoughts</span>
            <h2 id="feedback-title">How&apos;s the signal?</h2>
            <p id="feedback-description">
              Rate your connection with yourself right now—from a little static to full bars.
            </p>
            <div className="feedback-rating" role="radiogroup" aria-label="Rate your connection from 1 to 5">
              {ratingLabels.map((label, index) => {
                const value = index + 1;
                return (
                  <button
                    key={label}
                    type="button"
                    className={`feedback-star ${rating === value ? 'selected' : ''}`}
                    onClick={() => handleRating(value)}
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} out of 5: ${label}`}
                    title={label}
                  >
                    <Star size={25} fill="currentColor" aria-hidden="true" />
                    <span>{value}</span>
                  </button>
                );
              })}
            </div>
            <div className="feedback-scale-labels" aria-hidden="true">
              <span>Barely connected</span>
              <span>Full bars</span>
            </div>
            <button className="feedback-skip" type="button" onClick={finish}>
              Not now
            </button>
          </>
        ) : (
          <div className="feedback-thanks" role="status" aria-live="polite">
            <div className="feedback-icon success" aria-hidden="true">
              <Radio size={22} />
            </div>
            <h2 id="feedback-title">Signal received.</h2>
            <p id="feedback-description">Thanks for checking in with yourself.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FeedbackPrompt;
