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
        <div className="calm-signal-wordmark">
          <span className="calm-signal-kicker">Your gentle signal</span>
          <div className="app-title-row">
            <Image
              src="/assets/ping-check-logo.webp"
              alt=""
              width={48}
              height={48}
              className="app-title-logo"
              priority
            />
            <h1 className="app-title">Ping Check</h1>
          </div>
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
