'use client';

import React, { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';

interface GroundingLibraryProps {
  onClose: () => void;
}

type Exercise = {
  title: string;
  duration: string;
  intro: string;
  steps: string[];
};

const EXERCISES: Exercise[] = [
  {
    title: 'Five-senses reset',
    duration: '1–2 minutes',
    intro: 'Gently reconnect with the room around you.',
    steps: ['Notice 5 things you can see.', 'Notice 4 things you can feel.', 'Notice 3 things you can hear.', 'Notice 2 things you can smell.', 'Notice 1 thing you can taste or appreciate.'],
  },
  {
    title: 'Unclench and release',
    duration: '1 minute',
    intro: 'Let your body soften without forcing it.',
    steps: ['Lower your shoulders away from your ears.', 'Unclench your jaw and soften your hands.', 'Let your next exhale be a little longer.', 'Notice one place that feels even slightly lighter.'],
  },
  {
    title: 'Study reset',
    duration: '2 minutes',
    intro: 'Create a small bridge back to your next manageable task.',
    steps: ['Put both feet on the floor.', 'Take one slow breath and sip water if available.', 'Name the next task in one short sentence.', 'Choose a first step that can take less than five minutes.'],
  },
];

export const GroundingLibrary: React.FC<GroundingLibraryProps> = ({ onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const exercise = EXERCISES[selectedIndex];

  const selectExercise = (index: number) => {
    setSelectedIndex(index);
    setCompletedSteps([]);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((current) => current.includes(index)
      ? current.filter((step) => step !== index)
      : [...current, index]
    );
  };

  const resetSteps = () => setCompletedSteps([]);

  return (
    <section className="grounding-card" aria-label="Grounding exercise library">
      <div className="card-header-with-close">
        <div className="grounding-badge">Small grounding tools</div>
        <button type="button" className="btn-icon-close" onClick={onClose} aria-label="Close grounding exercises">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <h3 className="grounding-title">Find your next small step</h3>
      <p className="grounding-description">Choose an exercise that fits this moment. You can stop whenever you want.</p>

      <div className="grounding-tabs" role="tablist" aria-label="Grounding exercise choices">
        {EXERCISES.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            className={`grounding-tab ${selectedIndex === index ? 'active' : ''}`}
            onClick={() => selectExercise(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grounding-exercise" role="tabpanel">
        <div className="grounding-exercise-meta">
          <span>{exercise.duration}</span>
          <span>{completedSteps.length}/{exercise.steps.length} steps</span>
        </div>
        <p className="grounding-intro">{exercise.intro}</p>
        <ol className="grounding-steps">
          {exercise.steps.map((step, index) => (
            <li key={step} className={completedSteps.includes(index) ? 'completed' : ''}>
              <button type="button" onClick={() => toggleStep(index)} aria-label={`${completedSteps.includes(index) ? 'Unmark' : 'Mark'} step ${index + 1}`}>
                {completedSteps.includes(index) ? <Check size={15} aria-hidden="true" /> : index + 1}
              </button>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <button type="button" className="grounding-reset" onClick={resetSteps}>
          <RotateCcw size={14} aria-hidden="true" /> Reset steps
        </button>
      </div>
    </section>
  );
};
