'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Save, Trash2 } from 'lucide-react';
import { MoodKey } from '@/lib/types';

const REFLECTION_STORAGE_KEY = 'ping-check-private-reflections-v1';
const MAX_REFLECTIONS = 12;

const reflectionPrompts: Record<MoodKey, string> = {
  sad: 'What feels hardest to carry today, and what would make this moment a little gentler?',
  happy: 'What is making your heart feel lighter today, and how would you like to share or remember it?',
  tired: 'What is one thing you can release, postpone, or ask for help with today?',
  content: 'What is helping you feel settled today, and how can you protect a little more of that ease?',
  disconnected: 'What usually helps you feel a little more present, safe, or like yourself?',
  calm: 'What feels steady in you right now, and where could you carry that steadiness next?',
  heavy: 'If you could set down one part of this weight for now, what would it be?',
  grateful: 'What or who are you thankful for today, and what do you want to remember about it?',
  broken: 'What part of you needs the most patience and care in this moment?',
  excited: 'What are you looking forward to, and what is one grounded first step you could take?',
  loss: 'What would you like to remember, honor, or gently say to what you are grieving?',
  hopeful: 'What possibility are you holding onto, and what small step could move you toward it?',
  'just-okay': 'What would make today feel a little easier, kinder, or more manageable?',
};

interface ReflectionEntry {
  id: string;
  mood: MoodKey;
  moodLabel: string;
  text: string;
  createdAt: number;
}

interface ReflectionJournalProps {
  moodKey: MoodKey;
  moodLabel: string;
}

export const ReflectionJournal: React.FC<ReflectionJournalProps> = ({ moodKey, moodLabel }) => {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(REFLECTION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReflectionEntry[];
        if (Array.isArray(parsed)) setEntries(parsed.slice(0, MAX_REFLECTIONS));
      }
    } catch {
      // Private reflections are optional; continue if storage is unavailable.
    }
  }, []);

  const persist = (nextEntries: ReflectionEntry[]) => {
    setEntries(nextEntries);
    try {
      window.localStorage.setItem(REFLECTION_STORAGE_KEY, JSON.stringify(nextEntries));
    } catch {
      // Continue in memory when local storage is unavailable.
    }
  };

  const saveReflection = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextEntries = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        mood: moodKey,
        moodLabel,
        text: trimmed,
        createdAt: Date.now(),
      },
      ...entries,
    ].slice(0, MAX_REFLECTIONS);

    persist(nextEntries);
    setText('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const clearReflections = () => {
    persist([]);
    setShowPast(false);
  };

  return (
    <section className="reflection-journal" aria-labelledby="reflection-journal-title">
      <div className="reflection-journal-header">
        <div className="reflection-journal-title-wrap">
          <BookOpen size={18} aria-hidden="true" />
          <div>
            <span className="reflection-journal-kicker">Private reflection</span>
            <h3 id="reflection-journal-title">Give the feeling some room</h3>
          </div>
        </div>
        {entries.length > 0 && (
          <button
            className="reflection-journal-history-toggle"
            type="button"
            onClick={() => setShowPast((previous) => !previous)}
            aria-expanded={showPast}
          >
            {showPast ? 'Hide notes' : `${entries.length} saved ${entries.length === 1 ? 'note' : 'notes'}`}
          </button>
        )}
      </div>
      <p className="reflection-journal-privacy">
        Your words stay in this browser only. They are not sent to Ping Check or shared with anyone.
      </p>
      <div className="reflection-journal-prompt">
        <span>Try this prompt</span>
        <p>{reflectionPrompts[moodKey]}</p>
      </div>
      <label className="reflection-journal-label" htmlFor="private-reflection">
        Write as much or as little as you need
      </label>
      <textarea
        id="private-reflection"
        className="reflection-journal-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="This moment feels like..."
        rows={4}
        maxLength={2000}
      />
      <div className="reflection-journal-actions">
        <span className="reflection-journal-count">{text.length}/2000</span>
        <button
          className="reflection-journal-save"
          type="button"
          onClick={saveReflection}
          disabled={!text.trim()}
        >
          <Save size={15} aria-hidden="true" />
          <span>{saved ? 'Saved privately' : 'Save reflection'}</span>
        </button>
      </div>
      {saved && <p className="reflection-journal-confirmation" role="status">Your reflection is safe in this browser.</p>}
      {showPast && entries.length > 0 && (
        <div className="reflection-journal-history">
          <div className="reflection-journal-history-heading">
            <span>Your private notes</span>
            <button type="button" onClick={clearReflections}>
              <Trash2 size={13} aria-hidden="true" /> Clear all
            </button>
          </div>
          {entries.map((entry) => (
            <article className="reflection-journal-entry" key={entry.id}>
              <div>
                <strong>{entry.moodLabel}</strong>
                <time dateTime={new Date(entry.createdAt).toISOString()}>
                  {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </time>
              </div>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReflectionJournal;
