import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Ping Check',
  description: 'Terms and conditions for using the Ping Check self-reflection tool.',
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-nav">
        <Link href="/" className="btn-back-home">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Ping Check</span>
        </Link>
      </div>

      <article className="legal-card">
        <div className="legal-heading">
          <div className="legal-icon" aria-hidden="true">
            <FileText size={26} />
          </div>
          <div>
            <span className="card-accent-tag">Please read before using</span>
            <h1 className="legal-title">Terms and Conditions</h1>
          </div>
        </div>

        <p className="legal-updated">Last updated: September 14, 2026</p>

        <p>
          These Terms and Conditions describe the boundaries for using Ping Check, an anonymous self-reflection and wellness-support tool created for the CHMSU community. By entering and using the service, you acknowledge these terms.
        </p>

        <h2>1. Purpose of the service</h2>
        <p>
          Ping Check provides a private-feeling space to pause, identify a feeling, try a brief grounding activity, or write a reflection. It is intended for general wellness and self-reflection only.
        </p>

        <h2>2. Not professional or emergency care</h2>
        <p>
          Ping Check is not a clinical assessment, diagnosis, counseling service, therapy service, or emergency response channel. It does not create a counselor–client, doctor–patient, or other professional relationship, and it cannot guarantee a personal response.
        </p>
        <p>
          If you may hurt yourself or someone else, or if you are in immediate danger, stop using Ping Check and contact local emergency responders, a trusted person, a campus support service, or the nearest emergency department.
        </p>

        <h2>3. Use the service safely</h2>
        <p>
          Do not enter your name, student number, address, phone number, email address, passwords, account details, or other identifying or highly sensitive information. Do not use Vent Space to submit threats, unlawful content, malware, spam, or content that targets another person.
        </p>

        <h2>4. Anonymous use and privacy</h2>
        <p>
          The application is designed not to request accounts or direct identifiers. Information handling, including anonymous mood selections and optional reflections, is described in the <Link href="/privacy">Privacy Policy</Link>. No online service can promise absolute security or uninterrupted availability.
        </p>

        <h2>5. External resources</h2>
        <p>
          Ping Check may link to campus services, hotlines, and other support directories. Those services operate independently and have their own terms, availability, and privacy practices. Verify contact details and review their policies before sharing information.
        </p>

        <h2>6. Availability and updates</h2>
        <p>
          The project team may update, suspend, or discontinue features, content, or access without notice. These terms may also change when the service or its responsibilities change. The date above indicates the latest revision.
        </p>

        <h2>7. Institutional review</h2>
        <p>
          These terms are general project information and are not legal advice. The project owners should review them with the appropriate CHMSU institutional representative or legal adviser before treating them as a final legal agreement.
        </p>

        <p className="legal-note">
          By selecting “I agree and enter Ping Check” on the welcome screen, you confirm that you have read these boundaries and agree to use the service accordingly.
        </p>
      </article>
    </div>
  );
}
