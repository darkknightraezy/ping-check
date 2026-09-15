'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MoodKey, MoodQuote, MoodQuotesRegistry } from '@/lib/types';
import moodQuotesData from '@/data/moodQuotes.json';
import { MoodSelector } from '@/components/MoodSelector';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { BreathingPacer } from '@/components/BreathingPacer';
import { VentSpace } from '@/components/VentSpace';
import { SupportDrawer } from '@/components/SupportDrawer';
import { Toast } from '@/components/Toast';
import { LocalCheckIn, MoodHistory } from '@/components/MoodHistory';
import { GroundingLibrary } from '@/components/GroundingLibrary';

const defaultQuotes = moodQuotesData as MoodQuotesRegistry;
const MOOD_HISTORY_STORAGE_KEY = 'ping-check-local-history-v1';

export default function HomePage() {
  const [quotesRegistry, setQuotesRegistry] = useState<MoodQuotesRegistry>(defaultQuotes);
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [selectedMoodLabel, setSelectedMoodLabel] = useState<string>('');
  const [quoteData, setQuoteData] = useState<MoodQuote | null>(null);
  const [moodHistory, setMoodHistory] = useState<LocalCheckIn[]>([]);

  // Quick Tools Visibility
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [showVent, setShowVent] = useState<boolean>(false);
  const [showGrounding, setShowGrounding] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch updated quotes in background if server has updates
  useEffect(() => {
    async function loadFreshQuotes() {
      try {
        const res = await fetch('/api/quotes');
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.quotes) {
            setQuotesRegistry(json.data.quotes);
          }
        }
      } catch {
        // Fallback to local embedded data
      }
    }
    loadFreshQuotes();
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MOOD_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocalCheckIn[];
        if (Array.isArray(parsed)) setMoodHistory(parsed.slice(0, 7));
      }
    } catch {
      // Local history is optional; a storage error should not affect check-ins.
    }
  }, []);

  const saveMoodHistory = useCallback((entries: LocalCheckIn[]) => {
    setMoodHistory(entries);
    try {
      window.localStorage.setItem(MOOD_HISTORY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Continue without local persistence when storage is unavailable.
    }
  }, []);

  const handleSelectMood = useCallback(
    (moodKey: MoodKey, moodLabel: string) => {
      setSelectedMood(moodKey);
      setSelectedMoodLabel(moodLabel);
      saveMoodHistory([
        { mood: moodKey, label: moodLabel, createdAt: Date.now() },
        ...moodHistory,
      ].slice(0, 7));

      const foundQuote = quotesRegistry[moodKey] || defaultQuotes[moodKey];
      setQuoteData(foundQuote);

      // Anonymous log ping
      try {
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: moodKey,
            referrer: typeof document !== 'undefined' ? document.referrer || null : null,
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Ignore network failure for background logging
      }

      // Scroll smoothly to top of main container
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [moodHistory, quotesRegistry, saveMoodHistory]
  );

  const clearMoodHistory = useCallback(() => {
    saveMoodHistory([]);
  }, [saveMoodHistory]);

  const handleBackToMoods = useCallback(() => {
    setSelectedMood(null);
    setQuoteData(null);
    setSelectedMoodLabel('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      {/* View 1: Mood Selector (if no mood selected) */}
      {!selectedMood || !quoteData ? (
        <MoodSelector
          onSelectMood={handleSelectMood}
          onToggleBreathing={() => setShowBreathing((prev) => !prev)}
          onToggleVent={() => setShowVent((prev) => !prev)}
          onToggleGrounding={() => setShowGrounding((prev) => !prev)}
          breathingActive={showBreathing}
          ventActive={showVent}
          groundingActive={showGrounding}
        />
      ) : (
        /* View 2: Empathetic Quote & Grounding Card */
        <QuoteDisplay
          moodLabel={selectedMoodLabel}
          quoteData={quoteData}
          onBack={handleBackToMoods}
        />
      )}

      {!selectedMood && (
        <MoodHistory entries={moodHistory} onClear={clearMoodHistory} />
      )}

      {/* Somatic Breathing Pacer Card */}
      {showBreathing && (
        <BreathingPacer onClose={() => setShowBreathing(false)} />
      )}

      {/* Vent & Unburden Space */}
      {showVent && (
        <VentSpace
          selectedMood={selectedMood}
          onClose={() => setShowVent(false)}
          onShowToast={showToast}
        />
      )}

      {/* Grounding Exercise Library */}
      {showGrounding && (
        <GroundingLibrary onClose={() => setShowGrounding(false)} />
      )}

      {/* Campus & Crisis Support Drawer */}
      <SupportDrawer />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </>
  );
}
