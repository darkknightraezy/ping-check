import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const PrivacyFloatingButton = () => {
  return (
    <Link
      href="/privacy"
      className="privacy-floating-button"
      aria-label="Read the Ping Check privacy policy"
      title="Privacy policy"
    >
      <ShieldCheck size={18} aria-hidden="true" />
      <span>Privacy</span>
    </Link>
  );
};
