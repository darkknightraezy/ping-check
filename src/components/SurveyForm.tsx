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

interface SurveySliderProps {
  name: string;
  value: number;
  options: string[];
  placeholder: string;
  onChange: (value: number) => void;
  ariaLabel: string;
}

const SurveySlider: React.FC<SurveySliderProps> = ({ name, value, options, placeholder, onChange, ariaLabel }) => {
  const selected = options[value - 1];
  return (
    <div className="survey-slider-wrap">
      <div className="survey-slider-value" aria-live="polite">
        <span className="survey-slider-signal">{value}/{options.length} signal</span>
        <strong>{selected || placeholder}</strong>
      </div>
      <input
        className="survey-slider"
        type="range"
        name={name}
        min="1"
        max={options.length}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={ariaLabel}
        aria-valuetext={`${value} of ${options.length}: ${selected || 'not selected'}`}
      />
      <div className="survey-slider-labels" aria-hidden="true">
        <span>{options[0]}</span>
        <span>{options[options.length - 1]}</span>
      </div>
    </div>
  );
};

export const SurveyForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [helpfulnessLevel, setHelpfulnessLevel] = useState(3);
  const [reuseLevel, setReuseLevel] = useState(2);
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
            <div className="survey-slider-wrap">
              <div className="survey-slider-value" aria-live="polite">
                <span className="survey-slider-signal">{helpfulnessLevel}/5 signal</span>
                <strong>{answers.helpfulness || 'Move the signal to rate'}</strong>
              </div>
              <input
                className="survey-slider"
                type="range"
                name="helpfulness"
                min="1"
                max="5"
                step="1"
                value={helpfulnessLevel}
                onChange={(event) => {
                  const level = Number(event.target.value);
                  setHelpfulnessLevel(level);
                  updateAnswer('helpfulness', helpfulnessOptions[level - 1]);
                }}
                aria-label="Rate how helpful Ping Check was from 1 to 5"
                aria-valuetext={`${helpfulnessLevel} out of 5: ${answers.helpfulness || 'not rated'}`}
              />
              <div className="survey-slider-labels" aria-hidden="true">
                <span>Low signal</span>
                <span>Full bars</span>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Which part helped you most?</legend>
            <div className="survey-feature-choices">
              {featureOptions.map((option) => (
                <label key={option} className="survey-feature-choice">
                  <input type="radio" name="feature" value={option} checked={answers.feature === option} onChange={() => updateAnswer('feature', option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Would you use Ping Check again?</legend>
            <SurveySlider
              name="reuse"
              value={reuseLevel}
              options={reuseOptions}
              placeholder="Choose an answer"
              onChange={(level) => { setReuseLevel(level); updateAnswer('reuse', reuseOptions[level - 1]); }}
              ariaLabel="Choose whether you would use Ping Check again"
            />
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
