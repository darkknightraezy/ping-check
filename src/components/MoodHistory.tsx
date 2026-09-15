'use client';

import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { MoodKey } from '@/lib/types';

export interface LocalCheckIn {
  mood: MoodKey;
  label: string;
  createdAt: number;
}

interface MoodHistoryProps {
  entries: LocalCheckIn[];
  onClear: () => void;
}

export const MoodHistory: React.FC<MoodHistoryProps> = ({ entries, onClear }) => {
  if (entries.length === 0) return null;

  return (
    <section className="mood-history" aria-labelledby="mood-history-title">
      <div className="mood-history-header">
        <div className="mood-history-title-wrap">
          <History size={16} aria-hidden="true" />
          <h3 id="mood-history-title">My recent check-ins</h3>
        </div>
        <button type="button" className="mood-history-clear" onClick={onClear}>
          <Trash2 size={14} aria-hidden="true" />
          Clear
        </button>
      </div>
      <p className="mood-history-note">Stored only in this browser · up to 7 entries</p>
      <div className="mood-history-list" role="list" aria-label="Recent mood check-ins">
        {entries.map((entry) => (
          <div className="mood-history-item" role="listitem" key={`${entry.createdAt}-${entry.mood}`}>
            <span className={`mood-history-dot mood-history-dot-${entry.mood}`} aria-hidden="true" />
            <span className="mood-history-label">{entry.label}</span>
            <time dateTime={new Date(entry.createdAt).toISOString()}>
              {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </time>
          </div>
        ))}
      </div>
    </section>
  );
};
