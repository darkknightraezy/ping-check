import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="header" role="banner">
      <div className="partnership-lockup">
        {/* PSITS Emblem (Clickable to Facebook) */}
        <a
          href="https://www.facebook.com/profile.php?id=61579591881440"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-container psits-badge"
          aria-label="Visit CHMSU PSITS on Facebook"
          title="Visit CHMSU PSITS on Facebook"
        >
          <Image
            src="/assets/logo.png"
            alt="Carlos Hilado Memorial State University - PSITS Main Campus Emblem"
            className="brand-logo"
            width={76}
            height={76}
            priority
          />
        </a>

        <div className="partnership-divider" aria-hidden="true">
          <span className="collab-sym">×</span>
        </div>

        {/* CHMSU Psychological Society Emblem (Clickable to Facebook) */}
        <a
          href="https://www.facebook.com/CHMSCPsychologicalSociety"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-container psych-badge"
          aria-label="Visit CHMSU Psychological Society on Facebook"
          title="Visit CHMSU Psychological Society on Facebook"
        >
          <Image
            src="/assets/psych-soc-logo.png"
            alt="CHMSU Psychological Society Emblem"
            className="brand-logo"
            width={76}
            height={76}
            priority
          />
        </a>
      </div>

      <div className="brand-affiliation">
        <span className="pulse-indicator" aria-hidden="true" />
        <span className="brand-eyebrow">CHMSU PSITS × CHMSU Psychological Society</span>
      </div>

      <div className="calm-signal-lockup">
        <div className="calm-signal-mark" aria-hidden="true">
          <span className="calm-signal-orbit calm-signal-orbit-one" />
          <span className="calm-signal-orbit calm-signal-orbit-two" />
          <svg viewBox="0 0 48 48" role="presentation">
            <path className="signal-wave signal-wave-one" d="M8.5 13.5C12.5 8.9 17.7 6.5 24 6.5s11.5 2.4 15.5 7" />
            <path className="signal-wave signal-wave-two" d="M12.5 17.8c3-3.2 6.8-4.8 11.5-4.8s8.5 1.6 11.5 4.8" />
            <path className="signal-heart" d="M24 40S10 31.8 10 22.1a7.7 7.7 0 0 1 14-4.7 7.7 7.7 0 0 1 14 4.7C38 31.8 24 40 24 40Z" />
            <circle className="signal-dot" cx="24" cy="25" r="3.2" />
          </svg>
        </div>
        <div className="calm-signal-wordmark">
          <span className="calm-signal-kicker">Your gentle signal</span>
          <h1 className="app-title">Ping Check</h1>
        </div>
      </div>
      <div className="connection-prompt-float" role="note" aria-label="Self-connection check-in prompt">
        <span className="connection-prompt-label">A gentle check-in</span>
        <p className="connection-prompt-question">How&apos;s your connection with yourself today?</p>
        <p className="connection-prompt-support">
          Pause for a moment. Notice what feels present—there&apos;s no right answer and no need to explain.
        </p>
        <p className="connection-prompt-instruction">Choose the word that feels closest to what you&apos;re holding.</p>
      </div>
      <p className="partnership-tagline">
        An initiative in partnership with{' '}
        <a
          href="https://www.facebook.com/CHMSCPsychologicalSociety"
          target="_blank"
          rel="noopener noreferrer"
          className="partnership-link"
          title="Visit CHMSU Psychological Society Facebook Page"
        >
          <strong>The CHMSU Psychological Society</strong>
          <ExternalLink className="external-icon" size={13} aria-hidden="true" />
        </a>
      </p>
    </header>
  );
};
