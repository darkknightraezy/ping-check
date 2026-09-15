'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BreathingPacerProps {
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale';

export const BreathingPacer: React.FC<BreathingPacerProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);

  const phaseRef = useRef<Phase>(phase);
  const isActiveRef = useRef<boolean>(isActive);
  const secondsRef = useRef<number>(secondsLeft);

  phaseRef.current = phase;
  isActiveRef.current = isActive;
  secondsRef.current = secondsLeft;

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      if (!isActiveRef.current) return;

      if (secondsRef.current > 1) {
        setSecondsLeft((prev) => prev - 1);
      } else {
        // Transition phases: inhale (4s) -> hold (4s) -> exhale (6s) -> inhale (4s)
        const currentPhase = phaseRef.current;
        if (currentPhase === 'inhale') {
          setPhase('hold');
          setSecondsLeft(4);
        } else if (currentPhase === 'hold') {
          setPhase('exhale');
          setSecondsLeft(6);
        } else {
          setPhase('inhale');
          setSecondsLeft(4);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const toggleExercise = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsActive(true);
      return;
    }

    setIsActive((prev) => !prev);
  };

  const stopExercise = () => {
    setIsActive(false);
    setHasStarted(false);
    setPhase('inhale');
    setSecondsLeft(4);
  };

  const getPhaseLabel = () => {
    if (!hasStarted) return 'Ready when you are';

    switch (phase) {
      case 'inhale':
        return 'Inhale...';
      case 'hold':
        return 'Hold gently...';
      case 'exhale':
        return 'Exhale slowly...';
    }
  };

  return (
    <section
      id="breathing-card"
      className="breathing-card"
      aria-label="Mindful Breathing Guide"
    >
      <div className="card-header-with-close">
        <div className="breathing-badge">Somatic Calming</div>
        <button
          id="btn-close-breathing"
          className="btn-icon-close"
          type="button"
          onClick={onClose}
          aria-label="Close breathing guide"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <h3 className="breathing-title">Just Breathe</h3>
      <p className="breathing-desc">
        Slow your heartbeat. Follow the gentle rhythm of the circle.
      </p>

      <div className="breather-container">
        <div
          id="breather-circle"
          className={`breather-circle phase-${phase} ${!isActive ? 'paused' : ''}`}
          aria-hidden="true"
        >
          <div className="breather-inner">
            <span id="breather-label" className="breather-label">
              {getPhaseLabel()}
            </span>
            <span id="breather-counter" className="breather-counter">
              {secondsLeft}
            </span>
          </div>
        </div>
      </div>

      <div className="breather-controls">
        <button
          id="btn-breathing-action"
          className="btn-breathing-toggle"
          type="button"
          onClick={toggleExercise}
        >
          {!hasStarted ? 'Start Exercise' : isActive ? 'Pause Exercise' : 'Resume Exercise'}
        </button>
        {hasStarted && (
          <button
            id="btn-breathing-stop"
            className="btn-breathing-toggle"
            type="button"
            onClick={stopExercise}
          >
            Stop Exercise
          </button>
        )}
      </div>
    </section>
  );
};
