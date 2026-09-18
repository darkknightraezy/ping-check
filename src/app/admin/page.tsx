'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { BarChart3, LogOut, ShieldCheck } from 'lucide-react';

interface CountItem { label: string; count: number }
interface AdminAnalytics {
  available: boolean;
  windowDays: number;
  moodTotal: number;
  moodCounts: Array<{ mood: string; count: number }>;
  surveyTotal: number;
  surveyCounts: { helpfulness: CountItem[]; features: CountItem[]; reuse: CountItem[] };
}

const moodLabels: Record<string, string> = {
  sad: 'Sad', tired: 'Tired', disconnected: 'Disconnected', heavy: 'Heavy', broken: 'Broken', loss: 'Loss',
};

export default function AdminPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    const response = await fetch('/api/admin/analytics', { cache: 'no-store' });
    if (response.status === 401) { setUsername(null); return; }
    const payload = await response.json();
    setAnalytics(payload.data || null);
  };

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then(async (payload) => {
        if (payload.authenticated) {
          setUsername(payload.username);
          await loadAnalytics();
        }
      })
      .catch(() => setError('Unable to check the admin session.'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: loginName, password }) });
    const payload = await response.json();
    if (!response.ok) { setError(payload.message || 'Login failed.'); return; }
    setUsername(payload.username);
    setPassword('');
    await loadAnalytics();
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setUsername(null);
    setAnalytics(null);
  };

  if (loading) return <main className="admin-page"><div className="admin-card"><p>Checking secure admin access…</p></div></main>;

  if (!username) {
    return (
      <main className="admin-page">
        <section className="admin-card admin-login-card" aria-labelledby="admin-login-title">
          <div className="admin-icon" aria-hidden="true"><ShieldCheck size={26} /></div>
          <span className="admin-kicker">Restricted access</span>
          <h1 id="admin-login-title">Ping Check Admin</h1>
          <p>For the development team and responsible personnel only.</p>
          <form className="admin-login-form" onSubmit={login}>
            <label>Username<input value={loginName} onChange={(event) => setLoginName(event.target.value)} autoComplete="username" required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button type="submit" className="admin-primary-button">Sign in securely</button>
          </form>
          <p className="admin-security-note">This dashboard shows aggregate analytics only. It does not expose nicknames, ID numbers, journals, or raw reflections.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell" aria-labelledby="admin-dashboard-title">
        <header className="admin-header">
          <div><span className="admin-kicker">Private operations view</span><h1 id="admin-dashboard-title">Ping Check Analytics</h1><p>Signed in as <strong>{username}</strong></p></div>
          <button type="button" className="admin-logout-button" onClick={logout}><LogOut size={15} /> Sign out</button>
        </header>
        {!analytics?.available ? (
          <div className="admin-empty"><BarChart3 size={24} /><h2>Analytics are not available yet</h2><p>Connect the Supabase service-role configuration and collect data before viewing aggregate reports.</p></div>
        ) : (
          <>
            <div className="admin-stat-grid"><div className="admin-stat"><span>Mood check-ins</span><strong>{analytics.moodTotal}</strong><small>Last {analytics.windowDays} days</small></div><div className="admin-stat"><span>Survey responses</span><strong>{analytics.surveyTotal}</strong><small>Last {analytics.windowDays} days</small></div></div>
            <div className="admin-report-grid">
              <AdminCountCard title="Mood distribution" items={analytics.moodCounts.map((item) => ({ label: moodLabels[item.mood] || item.mood, count: item.count }))} total={analytics.moodTotal} />
              <AdminCountCard title="Would use again" items={analytics.surveyCounts.reuse} total={analytics.surveyTotal} />
              <AdminCountCard title="Most helpful features" items={analytics.surveyCounts.features} total={analytics.surveyTotal} />
              <AdminCountCard title="Helpfulness" items={analytics.surveyCounts.helpfulness} total={analytics.surveyTotal} />
            </div>
          </>
        )}
        <p className="admin-footer-note">Aggregate view only. No raw logs or identifying profile details are displayed here.</p>
      </section>
    </main>
  );
}

function AdminCountCard({ title, items, total }: { title: string; items: CountItem[]; total: number }) {
  return <article className="admin-report-card"><h2>{title}</h2>{items.length ? <div className="admin-bars">{items.map((item) => <div className="admin-bar-row" key={item.label}><div><span>{item.label}</span><strong>{item.count}</strong></div><div className="admin-bar-track"><span style={{ width: `${total ? Math.max(4, (item.count / total) * 100) : 0}%` }} /></div></div>)}</div> : <p className="admin-muted">No responses recorded.</p>}</article>;
}
