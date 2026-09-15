'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, LockKeyhole } from 'lucide-react';
import { MoodKey } from '@/lib/types';

const moodLabels: Record<MoodKey, string> = {
  sad: 'Sad',
  tired: 'Tired',
  disconnected: 'Disconnected',
  heavy: 'Heavy',
  broken: 'Broken',
  loss: 'Loss',
};

interface InsightsData {
  available: boolean;
  total: number;
  windowDays: number;
  distribution: Array<{ mood: MoodKey; percentage: number }>;
}

export const CommunityInsights: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/insights')
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (active && payload?.data) setInsights(payload.data as InsightsData);
      })
      .catch(() => {
        // Community insights are optional and never interrupt the check-in flow.
      });

    return () => { active = false; };
  }, []);

  const available = insights?.available;

  return (
    <section className="community-insights" aria-labelledby="community-insights-title">
      <div className="community-insights-header">
        <div className="community-insights-title-wrap">
          <BarChart3 size={17} aria-hidden="true" />
          <div>
            <span className="community-insights-kicker">Anonymous community signal</span>
            <h3 id="community-insights-title">You are not the only one checking in</h3>
          </div>
        </div>
        <LockKeyhole size={15} aria-label="Aggregate and anonymous" />
      </div>
      {available ? (
        <>
          <p className="community-insights-note">
            A quiet snapshot of mood check-ins from the last {insights?.windowDays} days. No names, accounts, or individual entries are shown.
          </p>
          <div className="community-insights-bars" aria-label="Anonymous mood distribution">
            {insights?.distribution.map((item) => (
              <div className="community-insight-row" key={item.mood}>
                <div className="community-insight-label">
                  <span>{moodLabels[item.mood] || 'Other'}</span>
                  <strong>{item.percentage}%</strong>
                </div>
                <div className="community-insight-track" aria-hidden="true">
                  <span style={{ width: `${Math.max(item.percentage, 3)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="community-insights-footnote">Shared only when there are enough responses to protect privacy.</p>
        </>
      ) : (
        <p className="community-insights-empty">
          The community signal is still gathering. Once enough anonymous check-ins are available, a broad mood snapshot will appear here.
        </p>
      )}
    </section>
  );
};

export default CommunityInsights;

