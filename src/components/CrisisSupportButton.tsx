'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Heart, Phone, X } from 'lucide-react';

export const CrisisSupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="crisis-floating-control">
      {isOpen && (
        <div id="urgent-support-panel" className="crisis-floating-panel" role="dialog" aria-label="Urgent support resources">
          <div className="crisis-floating-header">
            <div>
              <span className="crisis-floating-kicker">You deserve support</span>
              <h2>Need urgent help?</h2>
            </div>
            <button
              type="button"
              className="crisis-floating-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close urgent support resources"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
          <p>
            If you may hurt yourself or someone else, contact emergency responders or use a crisis line now.
          </p>
          <a className="crisis-call-link" href="tel:1553">
            <Phone size={16} aria-hidden="true" />
            <span>Call NCMH: 1553</span>
          </a>
          <Link className="crisis-support-link" href="/#support-section" onClick={() => setIsOpen(false)}>
            <Heart size={16} aria-hidden="true" />
            <span>Campus &amp; crisis resources</span>
          </Link>
          <Link className="crisis-support-link" href="https://findahelpline.com/countries/ph" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} aria-hidden="true" />
            <span>Find a helpline</span>
          </Link>
        </div>
      )}
      <button
        type="button"
        className={`crisis-floating-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-controls="urgent-support-panel"
      >
        <Heart size={18} aria-hidden="true" />
        <span>Urgent support</span>
      </button>
    </div>
  );
};
