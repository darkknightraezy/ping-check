'use client';

import React from 'react';
import { ExternalLink, Heart, Phone } from 'lucide-react';

export const SuicidePreventionBanner: React.FC = () => (
  <section className="suicide-prevention-banner" aria-labelledby="prevention-banner-title">
    <div className="suicide-prevention-banner-icon" aria-hidden="true">
      <Heart size={20} />
    </div>
    <div className="suicide-prevention-banner-copy">
      <span className="suicide-prevention-banner-kicker">September observance</span>
      <h2 id="prevention-banner-title">Suicide Prevention Month</h2>
      <p>
        A reminder that checking in, reaching out, and asking for support are meaningful acts of care. You do not have to face a difficult moment alone.
      </p>
    </div>
    <a className="suicide-prevention-banner-action" href="#support-section">
      <Phone size={15} aria-hidden="true" />
      <span>View support resources</span>
    </a>
  </section>
);

export const SuicidePreventionResources: React.FC = () => (
  <section className="suicide-prevention-resources" aria-labelledby="prevention-resources-title">
    <div className="suicide-prevention-resources-heading">
      <div>
        <span className="suicide-prevention-banner-kicker">Suicide Prevention Month</span>
        <h3 id="prevention-resources-title">Immediate support resources</h3>
      </div>
      <Heart size={18} aria-hidden="true" />
    </div>
    <p className="suicide-prevention-resources-note">
      If you or someone nearby may be in immediate danger, call emergency services at <strong>911</strong> or go to the nearest emergency department.
    </p>
    <div className="suicide-prevention-hotlines">
      <a className="prevention-hotline primary" href="tel:1553">
        <Phone size={16} aria-hidden="true" />
        <span><strong>NCMH Crisis Hotline</strong><small>1553 · nationwide</small></span>
      </a>
      <a className="prevention-hotline" href="tel:180018881553">
        <Phone size={16} aria-hidden="true" />
        <span><strong>NCMH toll-free</strong><small>1800-1888-1553</small></span>
      </a>
      <a className="prevention-hotline" href="tel:09190571553">
        <Phone size={16} aria-hidden="true" />
        <span><strong>Smart / TNT</strong><small>0919-057-1553</small></span>
      </a>
      <a className="prevention-hotline" href="tel:09178998727">
        <Phone size={16} aria-hidden="true" />
        <span><strong>Globe / TM</strong><small>0917-899-8727</small></span>
      </a>
    </div>
    <a className="prevention-resource-link" href="https://findahelpline.com/countries/ph" target="_blank" rel="noopener noreferrer">
      <span>Find more verified support options in the Philippines</span>
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  </section>
);
