'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Heart, ShieldCheck } from 'lucide-react';

export const WelcomeOverlay: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('welcome-overlay-open');
    } else {
      document.body.classList.remove('welcome-overlay-open');
    }

    return () => document.body.classList.remove('welcome-overlay-open');
  }, [isOpen]);

  const enterPingCheck = () => {
    if (!termsChecked) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent('ping-check:agreement-complete'));
    }, 320);
  };

  const openPrivacy = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsClosing(true);
    window.setTimeout(() => router.push('/privacy'), 320);
  };

  const openTerms = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsClosing(true);
    window.setTimeout(() => router.push('/terms'), 320);
  };

  if (!isOpen) return null;

  return (
    <div className={`welcome-overlay ${isClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-window">
        <div className="welcome-window-icon" aria-hidden="true">
          <Heart size={25} />
        </div>
        <span className="welcome-kicker">A quiet moment for you</span>
        <h2 id="welcome-title">Welcome to Ping Check</h2>
        <p className="welcome-lead">
          Before you begin, take one gentle breath. This is a space to pause, notice what you&apos;re carrying, and check in with yourself without judgment.
        </p>
        <div className="welcome-points">
          <div className="welcome-point">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Your check-in is designed to be anonymous.</span>
          </div>
          <div className="welcome-point">
            <Heart size={17} aria-hidden="true" />
            <span>There is no right feeling and no pressure to explain.</span>
          </div>
        </div>
        <p className="welcome-safety-note">
          Ping Check is not a clinical assessment or emergency service. If you are in immediate danger, please contact emergency responders or open the support resources after entering.
        </p>
        <label className="welcome-agreement">
          <input
            type="checkbox"
            checked={termsChecked}
            onChange={(event) => setTermsChecked(event.target.checked)}
          />
          <span>
            I have read and agree to the <Link href="/terms" onClick={openTerms}>Terms and Conditions</Link> and <Link href="/privacy" onClick={openPrivacy}>Privacy Policy</Link>.
          </span>
        </label>
        <button type="button" className="welcome-enter-button" onClick={enterPingCheck} disabled={!termsChecked} autoFocus>
          <span>I agree and enter Ping Check</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        <p className="welcome-legal-links">
          <Link href="/terms" onClick={openTerms}>Terms</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy" onClick={openPrivacy}>Privacy</Link>
        </p>
      </div>
    </div>
  );
};
