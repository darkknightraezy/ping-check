'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, LockKeyhole } from 'lucide-react';

type SurveyBreakdown = { label: string; percentage: number };
interface SurveyInsightsData {
  available: boolean;
  total: number;
  windowDays: number;
  helpfulness: SurveyBreakdown[];
  features: SurveyBreakdown[];
  reuse: SurveyBreakdown[];
}

const Breakdown: React.FC<{ items: SurveyBreakdown[] }> = ({ items }) => (
  <div className="survey-insights-bars">
    {items.map((item) => (
      <div className="survey-insight-row" key={item.label}>
        <div className="survey-insight-label"><span>{item.label}</span><strong>{item.percentage}%</strong></div>
        <div className="survey-insight-track" aria-hidden="true"><span style={{ width: `${Math.max(item.percentage, 3)}%` }} /></div>
      </div>
    ))}
  </div>
);

export const SurveyInsights: React.FC = () => {
  const [data, setData] = useState<SurveyInsightsData | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/survey')
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (active && payload?.data?.available) setData(payload.data as SurveyInsightsData);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!data) return null;

  return (
    <section className="survey-insights-card" aria-labelledby="survey-insights-title">
      <div className="survey-insights-header">
        <div className="survey-insights-title-wrap">
          <BarChart3 size={17} aria-hidden="true" />
          <div>
            <span className="survey-insights-kicker">Anonymous feedback snapshot</span>
            <h3 id="survey-insights-title">What the community is saying</h3>
          </div>
        </div>
        <LockKeyhole size={15} aria-label="Aggregate and anonymous" />
      </div>
      <p className="survey-insights-note">
        Broad percentages from {data.total} anonymous surveys collected in the last {data.windowDays} days. Free-text responses are not displayed here.
      </p>
      <div className="survey-insights-section">
        <h4>How helpful was it?</h4>
        <Breakdown items={data.helpfulness} />
      </div>
      <div className="survey-insights-section">
        <h4>Which feature helped most?</h4>
        <Breakdown items={data.features} />
      </div>
      <div className="survey-insights-section">
        <h4>Would people return?</h4>
        <Breakdown items={data.reuse} />
      </div>
      <p className="survey-insights-footnote">Shown only after enough responses are collected to protect privacy.</p>
    </section>
  );
};

export default SurveyInsights;

