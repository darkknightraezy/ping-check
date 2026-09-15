'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, Copy, Send, RefreshCw, Lightbulb } from 'lucide-react';
import { MoodKey } from '@/lib/types';

interface VentSpaceProps {
  selectedMood: MoodKey | null;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

const SAFETY_NOTICE_VERSION = 'v1';
const SAFETY_NOTICE_STORAGE_KEY = `ping-check-safety-notice-${SAFETY_NOTICE_VERSION}`;
const REFLECTION_PROMPTS = [
  'What has been taking up space in your mind today?',
  'What do you need more of right now: rest, support, clarity, or something else?',
  'What is one small thing that helped you get through today?',
  'If your feelings could speak gently, what might they want you to notice?',
];

export const VentSpace: React.FC<VentSpaceProps> = ({
  selectedMood,
  onClose,
  onShowToast,
}) => {
  const [text, setText] = useState<string>('');
  const [isDissolving, setIsDissolving] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [hasAcknowledgedSafety, setHasAcknowledgedSafety] = useState<boolean>(false);
  const [showSafetyAcknowledgement, setShowSafetyAcknowledgement] = useState<boolean>(false);
  const [acknowledgementChecked, setAcknowledgementChecked] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [promptIndex, setPromptIndex] = useState<number>(0);

  useEffect(() => {
    try {
      setHasAcknowledgedSafety(
        window.localStorage.getItem(SAFETY_NOTICE_STORAGE_KEY) === 'acknowledged'
      );
    } catch {
      // Private browsing or blocked storage should not prevent the user from continuing.
    }
  }, []);

  const handleDissolve = () => {
    if (!text.trim()) {
      onShowToast('Please write a thought first before releasing.');
      return;
    }

    setIsDissolving(true);
    setTimeout(() => {
      setText('');
      setIsDissolving(false);
      setIsSubmitted(true);
      onShowToast('🍃 Your words have been gently released.');
    }, 1200);
  };

  const handleCopy = async () => {
    if (!text.trim()) {
      onShowToast('Write your thoughts first before copying.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      onShowToast('📋 Copied! You can paste this in a message to a counselor or hotline.');
    } catch {
      onShowToast('Copied text to clipboard.');
    }
  };

  const submitAnonymousReflection = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/vent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mood: selectedMood || 'unspecified',
        }),
      });

      if (res.ok) {
        setText('');
        setIsSubmitted(true);
        onShowToast('✉️ Reflection received anonymously. Thank you.');
      } else {
        onShowToast('Notice: Could not submit. Your thought remains private.');
      }
    } catch {
      onShowToast('Notice: Could not reach server. Your thought remains private.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendAnonymous = async () => {
    if (!text.trim()) {
      onShowToast('Please type your reflection first.');
      return;
    }

    if (!hasAcknowledgedSafety) {
      setAcknowledgementChecked(false);
      setShowSafetyAcknowledgement(true);
      return;
    }

    await submitAnonymousReflection();
  };

  const handleAcknowledgeAndSend = async () => {
    if (!acknowledgementChecked) {
      onShowToast('Please acknowledge the safety reminder before sending.');
      return;
    }

    try {
      window.localStorage.setItem(SAFETY_NOTICE_STORAGE_KEY, 'acknowledged');
    } catch {
      // Continue even when browser storage is unavailable.
    }
    setHasAcknowledgedSafety(true);
    setShowSafetyAcknowledgement(false);
    await submitAnonymousReflection();
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setText('');
    setShowPrompt(false);
  };

  const showNextPrompt = () => {
    setPromptIndex((current) => (current + 1) % REFLECTION_PROMPTS.length);
    setShowPrompt(true);
  };

  return (
    <section
      id="venting-card"
      className="venting-card"
      aria-label="Vent and unburden your thoughts"
    >
      <div className="card-header-with-close">
        <div className="vent-badge">Safe Expression Space</div>
        <button
          id="btn-close-vent"
          className="btn-icon-close"
          type="button"
          onClick={onClose}
          aria-label="Close vent space"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <h3 className="vent-title">Unburden Your Heart</h3>
      <p className="vent-subtitle">
        No one is grading or judging you. Write what made you tired, what hurt today, or what you wish someone understood.
      </p>

      <div className="vent-safety-notice" role="note">
        <strong>A gentle safety reminder</strong>
        <p>
          Vent Space is for self-reflection, not monitored crisis support. Please don&apos;t include your name, contact details, address, passwords, or other identifying information.
        </p>
        <div className="vent-safety-links">
          <Link href="/privacy">Read the privacy policy</Link>
          <Link href="/#support-section" onClick={onClose}>Open support resources</Link>
        </div>
      </div>

      {!isSubmitted ? (
        <div id="vent-input-wrapper" className="vent-input-wrapper">
          <div className="reflection-prompt-tools">
            <button
              type="button"
              className="reflection-prompt-toggle"
              onClick={() => setShowPrompt((visible) => !visible)}
              aria-expanded={showPrompt}
              aria-controls="reflection-prompt-panel"
              disabled={isDissolving || isSending}
            >
              <Lightbulb size={15} aria-hidden="true" />
              <span>{showPrompt ? 'Hide writing prompt' : 'Need a gentle prompt?'}</span>
            </button>
          </div>

          {showPrompt && (
            <div id="reflection-prompt-panel" className="reflection-prompt-panel" role="note">
              <span className="reflection-prompt-label">A thought to begin with</span>
              <p>&ldquo;{REFLECTION_PROMPTS[promptIndex]}&rdquo;</p>
              <div className="reflection-prompt-actions">
                <button type="button" onClick={showNextPrompt} disabled={isDissolving || isSending}>
                  <RefreshCw size={14} aria-hidden="true" />
                  Try another
                </button>
                <button type="button" onClick={() => setShowPrompt(false)}>
                  Not right now
                </button>
              </div>
            </div>
          )}

          <textarea
            id="vent-textarea"
            className={`vent-textarea ${isDissolving ? 'dissolving' : ''}`}
            rows={5}
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type freely here... (It's safe to be honest with yourself)"
            aria-label="Write your thoughts freely"
            disabled={isDissolving || isSending}
          />

          <div className="vent-meta">
            <span id="char-counter" className="char-counter">
              {text.length} / 1000
            </span>
            <span className="confidential-pill">Anonymous by design</span>
          </div>

          <div className="vent-action-grid">
            <button
              id="btn-vent-dissolve"
              className="btn-vent-action primary-dissolve"
              type="button"
              onClick={handleDissolve}
              disabled={isDissolving || isSending}
            >
              <Sparkles size={18} aria-hidden="true" />
              <span>Release into the Wind</span>
            </button>

            <button
              id="btn-vent-copy"
              className="btn-vent-action secondary-copy"
              type="button"
              onClick={handleCopy}
              disabled={isDissolving || isSending}
            >
              <Copy size={16} aria-hidden="true" />
              <span>Copy to Send Counselor</span>
            </button>

            <button
              id="btn-vent-submit"
              className="btn-vent-action tertiary-send"
              type="button"
              onClick={handleSendAnonymous}
              disabled={isDissolving || isSending}
            >
              <Send size={16} aria-hidden="true" />
              <span>{isSending ? 'Sending...' : 'Send Anonymously'}</span>
            </button>
          </div>

          {showSafetyAcknowledgement && (
            <div
              className="safety-acknowledgement"
              role="dialog"
              aria-labelledby="safety-acknowledgement-title"
            >
              <div className="safety-acknowledgement-header">
                <div>
                  <span className="safety-acknowledgement-kicker">Before you send</span>
                  <h4 id="safety-acknowledgement-title">A quick safety check</h4>
                </div>
                <button
                  type="button"
                  className="safety-acknowledgement-close"
                  onClick={() => setShowSafetyAcknowledgement(false)}
                  aria-label="Cancel anonymous submission"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <label className="safety-acknowledgement-label">
                <input
                  type="checkbox"
                  checked={acknowledgementChecked}
                  onChange={(event) => setAcknowledgementChecked(event.target.checked)}
                />
                <span>
                  I understand this is not emergency or clinical support, and I will not include identifying information.
                </span>
              </label>
              <div className="safety-acknowledgement-actions">
                <button
                  type="button"
                  className="btn-acknowledgement-cancel"
                  onClick={() => setShowSafetyAcknowledgement(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-acknowledgement-continue"
                  onClick={handleAcknowledgeAndSend}
                  disabled={!acknowledgementChecked || isSending}
                >
                  {isSending ? 'Sending...' : 'Acknowledge & send'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div id="vent-success-banner" className="vent-success-banner">
          <div className="success-icon-wrap" aria-hidden="true">
            🍃
          </div>
          <h4 className="success-heading">Your thoughts have been released.</h4>
          <p className="success-message">
            You don&apos;t have to carry every heavy thought by yourself. Notice the air filling your lungs right now. You are safe.
          </p>
          <button
            id="btn-vent-reset"
            className="btn-vent-reset"
            type="button"
            onClick={handleReset}
          >
            Write another thought
          </button>
        </div>
      )}
    </section>
  );
};
