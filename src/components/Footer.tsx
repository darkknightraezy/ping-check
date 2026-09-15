import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-minimal-brand">
        <span className="footer-brand-name">Ping Check</span>
        <span className="footer-link-separator" aria-hidden="true">·</span>
        <a
          href="https://www.facebook.com/profile.php?id=61579591881440"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-minimal-link"
          title="Visit CHMSU PSITS on Facebook"
        >
          CHMSU PSITS
        </a>
        <span className="footer-link-separator" aria-hidden="true">×</span>
        <a
          href="https://www.facebook.com/CHMSCPsychologicalSociety"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-minimal-link footer-psych-link"
          title="Visit CHMSU Psychological Society on Facebook"
        >
          Psychological Society
        </a>
      </div>
      <div className="footer-minimal-meta">
        <span>CHMSU Main Campus · Talisay City</span>
        <span className="footer-link-separator" aria-hidden="true">·</span>
        <Link href="/about" className="footer-minimal-link">About</Link>
        <span className="footer-link-separator" aria-hidden="true">·</span>
        <Link href="/privacy" className="footer-minimal-link">Privacy</Link>
      </div>
      <p className="footer-subnote">
        Anonymous self-reflection tool · Not a clinical or emergency service
      </p>
    </footer>
  );
};
