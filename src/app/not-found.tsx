import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="quote-card not-found-card">
      <div className="card-accent-tag">404</div>
      <h2 className="about-card-title">Page Not Found</h2>
      <p className="about-paragraph">
        Take a gentle breath. It seems this link drifted a little off course.
      </p>
      <div className="quote-actions">
        <Link href="/" className="btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Return to Ping Check</span>
        </Link>
      </div>
    </section>
  );
}
