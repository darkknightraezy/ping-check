'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ChevronDown, Phone, ExternalLink } from 'lucide-react';

export const SupportDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#support-section') {
        setIsOpen(true);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <section
      id="support-section"
      className="support-section"
      aria-labelledby="support-heading"
    >
      <button
        id="btn-support-toggle"
        className={`support-toggle-btn ${isOpen ? 'active' : ''}`}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="support-drawer"
      >
        <span className="support-icon-wrap" aria-hidden="true">
          <Heart size={22} />
        </span>
        <span id="support-heading" className="support-toggle-label">
          Need a human connection? Tap here for support
        </span>
        <ChevronDown
          className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
          size={20}
          aria-hidden="true"
        />
      </button>

      {/* Expandable Support Drawer */}
      {isOpen && (
        <div id="support-drawer" className="support-drawer">
          <div className="support-content">
            <p className="support-intro">
              You are never alone, fellow CHMSUan. Speaking to someone can help ease what you carry. All support options are confidential, welcoming, and safe.
            </p>

            <div className="support-card-grid">
              {/* CHMSU Campus Guidance and Counseling */}
              <div className="resource-card campus-resource">
                <div className="resource-badge">CHMSU Campus Support</div>
                <h3 className="resource-title">
                  Guidance &amp; Counseling Services Unit (GCSU)
                </h3>
                <p className="resource-desc">
                  Carlos Hilado Memorial State University — Main Campus (Talisay City). Free, compassionate, and confidential counseling for all students, supported by peer wellness advocates from the <strong>CHMSU Psychological Society</strong>.
                </p>
                <div className="resource-details">
                  <div className="detail-item">
                    <span className="detail-label">Campus Location:</span>
                    <span className="detail-value">
                      Office of Student Affairs and Services (OSAS), Main Campus
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Office Hours:</span>
                    <span className="detail-value">
                      Monday to Friday, 8:00 AM – 5:00 PM
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Walk-ins:</span>
                    <span className="detail-value">
                      Students are always welcome to walk in or schedule private sessions
                    </span>
                  </div>
                </div>
                <div className="resource-actions">
                  <a
                    href="https://chmsu.edu.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-resource primary external-link"
                  >
                    <span>Visit CHMSU Portal</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* National Center for Mental Health (NCMH) Philippines */}
              <div className="resource-card">
                <div className="resource-badge">National 24/7 Crisis Hotline</div>
                <h3 className="resource-title">NCMH Crisis Hotline (Philippines)</h3>
                <p className="resource-desc">
                  Free, confidential nationwide 24/7 crisis intervention and emotional support by the Department of Health (DOH).
                </p>
                <div className="resource-actions">
                  <a href="tel:1553" className="btn-resource primary">
                    <Phone size={16} aria-hidden="true" />
                    <span>Toll-Free Landline: 1553</span>
                  </a>
                  <a href="tel:09663514518" className="btn-resource secondary">
                    <span>Globe / TM: 0966-351-4518</span>
                  </a>
                  <a href="tel:09086392672" className="btn-resource secondary">
                    <span>Smart / TNT: 0908-639-2672</span>
                  </a>
                </div>
              </div>

              {/* Hopeline Philippines */}
              <div className="resource-card">
                <div className="resource-badge">Hopeline Philippines</div>
                <h3 className="resource-title">Hopeline 24/7 Suicide Prevention</h3>
                <p className="resource-desc">
                  Dedicated 24/7 crisis support lines operated in the Philippines.
                </p>
                <div className="resource-actions">
                  <a href="tel:2919" className="btn-resource primary">
                    <Phone size={16} aria-hidden="true" />
                    <span>Toll-Free (Globe/TM): 2919</span>
                  </a>
                  <a href="tel:09175584673" className="btn-resource secondary">
                    <span>Mobile: 0917-558-4673</span>
                  </a>
                </div>
              </div>

              {/* Worldwide & Anonymous Directories */}
              <div className="resource-card international-card">
                <div className="resource-badge">Worldwide Directories</div>
                <h3 className="resource-title">Global Free &amp; Confidential Support</h3>
                <p className="resource-desc">
                  Access international hotlines, online crisis chats, and specialized peer support directories.
                </p>
                <div className="resource-actions">
                  <a
                    href="https://findahelpline.com/countries/ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-resource secondary external-link"
                  >
                    <span>Find A Helpline (Philippines &amp; Global)</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.befrienders.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-resource secondary external-link"
                  >
                    <span>Befrienders Worldwide</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
