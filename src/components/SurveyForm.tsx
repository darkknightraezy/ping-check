'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { Check, ClipboardList, X } from 'lucide-react';

const SURVEY_SESSION_KEY = 'ping-check-survey-completed-v1';

type SurveyAnswers = {
  helpfulness: string;
  feature: string;
  reuse: string;
  improvement: string;
};

const initialAnswers: SurveyAnswers = {
  helpfulness: '',
  feature: '',
  reuse: '',
  improvement: '',
};

const helpfulnessOptions = ['Not helpful', 'A little helpful', 'Somewhat helpful', 'Helpful', 'Very helpful'];
const featureOptions = ['Mood check-in', 'Reflection journal', 'Breathing exercise', 'Grounding activity', 'Support resources', 'Other'];
const reuseOptions = ['Yes', 'Maybe', 'No'];

export const SurveyForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SURVEY_SESSION_KEY)) setIsSubmitted(true);
    } catch {
      // The survey remains available when session storage is unavailable.
    }
  }, []);

  const updateAnswer = (field: keyof SurveyAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }));
  };

  const submitSurvey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answers.helpfulness || !answers.feature || !answers.reuse || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'The survey could not be saved right now.');
      }
      try {
        window.sessionStorage.setItem(SURVEY_SESSION_KEY, 'true');
      } catch {
        // Continue without session storage when it is unavailable.
      }
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The survey could not be saved right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="survey-card survey-complete" aria-live="polite">
        <div className="survey-complete-icon" aria-hidden="true"><Check size={20} /></div>
        <div>
          <h3>Thank you for the signal.</h3>
          <p>Your anonymous feedback helps us make Ping Check gentler and more useful.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`survey-card ${isOpen ? 'is-open' : ''}`} aria-labelledby="survey-title">
      <div className="survey-card-header">
        <div className="survey-card-title-wrap">
          <ClipboardList size={17} aria-hidden="true" />
          <div>
            <span className="survey-kicker">Help shape Ping Check</span>
            <h3 id="survey-title">Got one minute to share feedback?</h3>
          </div>
        </div>
        {isOpen && (
          <button type="button" className="survey-close" onClick={() => setIsOpen(false)} aria-label="Close survey">
            <X size={17} aria-hidden="true" />
          </button>
        )}
      </div>

      {!isOpen ? (
        <>
          <p className="survey-intro">A few quick answers can help us improve this space for students.</p>
          <button type="button" className="survey-open-button" onClick={() => setIsOpen(true)}>
            Share quick feedback
          </button>
        </>
      ) : (
        <form className="survey-form" onSubmit={submitSurvey}>
          <p className="survey-privacy">Anonymous and optional. Answers are aggregated for improvement. Please do not include names, student numbers, contact details, or private journal entries.</p>
          <fieldset>
            <legend>How helpful was Ping Check today?</legend>
            <div className="survey-options survey-options-inline">
              {helpfulnessOptions.map((option) => (
                <label key={option} className="survey-option">
                  <input type="radio" name="helpfulness" value={option} checked={answers.helpfulness === option} onChange={() => updateAnswer('helpfulness', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Which part helped you most?</legend>
            <div className="survey-options">
              {featureOptions.map((option) => (
                <label key={option} className="survey-option">
                  <input type="radio" name="feature" value={option} checked={answers.feature === option} onChange={() => updateAnswer('feature', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Would you use Ping Check again?</legend>
            <div className="survey-options survey-options-row">
              {reuseOptions.map((option) => (
                <label key={option} className="survey-option">
                  <input type="radio" name="reuse" value={option} checked={answers.reuse === option} onChange={() => updateAnswer('reuse', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="survey-text-label" htmlFor="survey-improvement">What could make Ping Check better? <span>(optional)</span></label>
          <textarea id="survey-improvement" value={answers.improvement} onChange={(event) => updateAnswer('improvement', event.target.value)} maxLength={500} rows={3} placeholder="A small idea, request, or encouragement..." />
          <div className="survey-actions">
            <span>Required questions are marked by the choices above.</span>
            <button type="submit" className="survey-submit" disabled={!answers.helpfulness || !answers.feature || !answers.reuse || isSubmitting}>{isSubmitting ? 'Sending…' : 'Send feedback'}</button>
          </div>
          {submitError && <p className="survey-error" role="alert">{submitError}</p>}
        </form>
      )}
    </section>
  );
};

export default SurveyForm;
