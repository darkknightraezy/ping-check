import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Ping Check',
  description: 'How Ping Check handles anonymous check-ins, reflections, and technical information.',
};

export default function PrivacyPage() {
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
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="card-accent-tag">Your privacy matters</span>
            <h1 className="legal-title">Privacy Policy</h1>
          </div>
        </div>

        <p className="legal-updated">Last updated: September 14, 2026</p>

        <p>
          Ping Check is an anonymous self-reflection and wellness-support tool created for the CHMSU community. This policy explains what information the site handles, why it is handled, and the choices available to you.
        </p>

        <h2>Information we receive</h2>
        <p>
          When you select a mood, Ping Check may record the selected mood and an optional referring page for anonymous, aggregate usage insights. The application is designed not to request your name, email address, account, password, precise location, IP address, session identifier, cookie, or user-agent information.
        </p>
        <p>
          If you use the optional Vent Space, the text you submit is sent to the application so it can acknowledge your reflection. Please do not include your name, contact details, passwords, or other identifying or highly sensitive information in a reflection.
        </p>

        <h2>How information is used</h2>
        <p>
          Anonymous mood selections may be used to understand which check-in experiences are useful and to improve the site. We do not use these selections to identify, profile, contact, or make decisions about individual visitors.
        </p>
        <p>
          Vent Space is not a clinical service, emergency service, or monitored crisis channel. A reflection does not create a counseling relationship or guarantee a personal response.
        </p>

        <h2>Storage and service providers</h2>
        <p>
          Anonymous mood data may be stored in Supabase when analytics credentials are enabled. When Supabase is not configured, the application uses a local fallback and does not write the mood selection to a database. The site is deployed through Vercel, and Vercel or other infrastructure providers may process ordinary technical information in their own logs and according to their own privacy policies.
        </p>
        <p>
          We retain information only for as long as needed for the purposes described above, operational troubleshooting, security, or legal obligations. Retention periods can depend on the configured service providers.
        </p>

        <h2>Links to other resources</h2>
        <p>
          Ping Check links to CHMSU resources, crisis hotlines, and international support directories. Those services have their own policies and practices. Review the privacy information of any external service before sharing personal information with it.
        </p>

        <h2>Safety and urgent support</h2>
        <p>
          Ping Check is not a substitute for professional care. If you may hurt yourself or someone else, or if you are in immediate danger, contact local emergency responders or go to the nearest emergency department. You can also open the support section on the home page for campus and crisis resources.
        </p>

        <h2>Questions and updates</h2>
        <p>
          We may update this policy when the site or its data practices change. The “Last updated” date above indicates the latest revision. For questions about this policy or the project, please use the contact or official social links provided by CHMSU PSITS and the CHMSU Psychological Society.
        </p>

        <p className="legal-note">
          This page is general project information and is not legal advice. The project owners should review it with their institution or legal adviser before treating it as a final legal notice.
        </p>
      </article>
    </div>
  );
}
