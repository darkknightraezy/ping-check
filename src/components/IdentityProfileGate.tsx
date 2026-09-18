'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { Heart, Lock, UserRound } from 'lucide-react';

export interface CheckInProfile {
  nickname: string;
  idNumber?: string;
}

interface IdentityProfileGateProps {
  onComplete: (profile: CheckInProfile) => void;
}

const PROFILE_STORAGE_KEY = 'ping-check-local-profile-v1';

export const IdentityProfileGate: React.FC<IdentityProfileGateProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [idNumber, setIdNumber] = useState('');

  useEffect(() => {
    document.body.classList.add('identity-gate-open');
    try {
      const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const profile = JSON.parse(stored) as CheckInProfile;
        if (profile?.nickname) setNickname(profile.nickname);
        if (profile?.idNumber) setIdNumber(profile.idNumber);
      }
    } catch {
      // A storage error should not prevent the profile step from working.
    }
    return () => document.body.classList.remove('identity-gate-open');
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanNickname = nickname.trim();
    const cleanIdNumber = idNumber.trim();
    if (!cleanNickname) return;

    const profile: CheckInProfile = {
      nickname: cleanNickname,
      ...(cleanIdNumber ? { idNumber: cleanIdNumber } : {}),
    };

    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Continue without local persistence when storage is unavailable.
    }
    onComplete(profile);
  };

  return (
    <div className="identity-gate-backdrop" role="dialog" aria-modal="true" aria-labelledby="identity-gate-title">
      <form className="identity-gate-window" onSubmit={handleSubmit}>
        <div className="identity-gate-icon" aria-hidden="true">
          <UserRound size={25} />
        </div>
        <span className="identity-gate-kicker">Make this space yours</span>
        <h2 id="identity-gate-title">How may we welcome you?</h2>
        <p className="identity-gate-lead">
          Add a nickname or alias so your check-in can feel more personal. Your ID number is optional and can help you identify yourself if you choose to seek follow-up care.
        </p>

        <div className="identity-gate-fields">
          <label className="identity-gate-field">
            <span>Nickname / Alias <strong aria-hidden="true">*</strong></span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="e.g., Thirdy"
              maxLength={40}
              autoComplete="nickname"
              required
              autoFocus
            />
          </label>
          <label className="identity-gate-field">
            <span>ID Number <em>(optional)</em></span>
            <input
              type="text"
              value={idNumber}
              onChange={(event) => setIdNumber(event.target.value)}
              placeholder="Only if you want to add one"
              maxLength={40}
              autoComplete="off"
            />
          </label>
        </div>

        <p className="identity-gate-privacy">
          <Lock size={14} aria-hidden="true" />
          <span>Stored only on this device. Your nickname and ID are not sent with anonymous mood analytics.</span>
        </p>
        <p className="identity-gate-care-note">
          <Heart size={14} aria-hidden="true" />
          <span>This does not create a monitored help request. Use the support resources when you need direct care.</span>
        </p>

        <button type="submit" className="identity-gate-submit" disabled={!nickname.trim()}>
          <span>Continue to my check-in</span>
        </button>
      </form>
    </div>
  );
};

export { PROFILE_STORAGE_KEY };
