import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Ping Check — CHMSU PSITS & Psychological Society',
  description:
    'Meet the working committees and learn about the student-led mental health check-in initiative at Carlos Hilado Memorial State University.',
};

interface Member {
  name: string;
  image: string;
  subrole?: string;
}

interface Committee {
  title: string;
  badge: string;
  badgeClass?: string;
  containerClass?: string;
  roleDescription: string;
  members: Member[];
  isLead?: boolean;
}

const committees: Committee[] = [
  {
    title: 'Activity In-Charge',
    badge: 'Leadership',
    containerClass: 'highlight-lead',
    isLead: true,
    roleDescription: 'Oversees overall campaign planning, approvals, and execution.',
    members: [
      {
        name: 'Sherelyn Bello',
        image: '/assets/sherelyn-bello.webp',
        subrole: 'Activity In-Charge',
      },
    ],
  },
  {
    title: 'Web Development & Creative UI/UX Committee',
    badge: 'Technology & Design',
    badgeClass: 'tech-badge',
    containerClass: 'tech-committee',
    roleDescription:
      'Builds, hosts, and maintains the interactive web system and QR functionality and establishes the visual identity for both the physical posters and the digital interface.',
    members: [
      { name: 'Hohnsalm Natividad', image: '/assets/hohnsalm-natividad.webp' },
      { name: 'Ian Billones', image: '/assets/ian-billones.webp' },
      { name: 'Zanzhumei Lopez', image: '/assets/zanzhumei-lopez.webp' },
    ],
  },
  {
    title: 'Content & Mental Health Curation Committee',
    badge: 'Psychology & Wellness',
    badgeClass: 'psych-badge-tag',
    containerClass: 'psych-committee',
    roleDescription:
      'Manages the text content in the web system to ensure safe, empathetic, and effective messaging.',
    members: [
      { name: 'Angela Javelosa', image: '/assets/angela-javelosa.webp' },
      { name: 'Joy Almonicar', image: '/assets/joy-almonicar.webp' },
      { name: 'Princess Jamaica Jimenez', image: '/assets/princess-jamaica-jimenez.webp' },
      { name: 'Princess Mae Isuga', image: '/assets/princess-mae-isuga.webp' },
      { name: 'Marissa Bautista', image: '/assets/marissa-bautista.webp' },
      { name: 'Clyde Emmanuel Lachica Arian', image: '/assets/clyde-emmanuel-lachica-arian.webp' },
    ],
  },
  {
    title: 'Media & Publicity Committee',
    badge: 'Communications',
    roleDescription:
      'Managing post schedules, writing empathetic captions, and publishing content across all official social platforms.',
    members: [
      { name: 'Mira Fe Pelinghe', image: '/assets/mira-fe-pelinghe.webp' },
      { name: 'Christopher Caratao', image: '/assets/christopher-caratao.webp' },
    ],
  },
  {
    title: 'Logistics & Protocol Committee',
    badge: 'Operations',
    roleDescription:
      'Managing digital assets, account access, publishing workflows, and distribution channels so online content releases smoothly without technical or scheduling bottlenecks.',
    members: [
      { name: 'John Michael Polinar', image: '/assets/john-michael-polinar.webp' },
      { name: 'Xervy Dusaran', image: '/assets/xervy-dusaran.webp' },
      { name: 'Paul Robles', image: '/assets/paul-robles.webp' },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Navigation Back */}
      <nav className="about-nav" aria-label="Page navigation">
        <Link href="/" className="btn-back-home">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back to Ping Check</span>
        </Link>
      </nav>

      {/* Initiative Story & Purpose */}
      <section className="about-card story-card" aria-labelledby="story-heading">
        <div className="card-accent-tag">The Story</div>
        <h2 id="story-heading" className="about-card-title">
          Why Ping Check Exists
        </h2>
        <p className="about-paragraph">
          In computer networking, a <em>&ldquo;ping&rdquo;</em> tests whether a connection exists and how quickly a signal returns. On university campuses, students often spend so much time keeping up with academics, projects, and deadlines that they forget to check their own internal connection.
        </p>
        <p className="about-paragraph">
          <strong>Ping Check</strong> is a collaborative wellness initiative organized by the{' '}
          <strong>Philippine Society of Information Technology Students (PSITS)</strong> in partnership with the{' '}
          <strong>CHMSU Psychological Society</strong>. Accessible through simple QR code posters across campus, it offers students a quiet, judgment-free moment to pause, acknowledge how they feel, unburden their thoughts, and reach supportive hands when needed.
        </p>
      </section>

      {/* Working Committees */}
      <section className="about-card committees-card" aria-labelledby="committees-heading">
        <div className="card-accent-tag">Working Committees</div>
        <h2 id="committees-heading" className="about-card-title">
          The Student Team Behind Ping Check
        </h2>
        <p className="committees-intro">
          Dedicated student leaders working together to ensure this platform remains safe, empathetic, functional, and accessible to every CHMSUan.
        </p>

        <div className="committee-grid">
          {committees.map((comm) => (
            <article
              key={comm.title}
              className={`committee-item ${comm.containerClass || ''}`}
            >
              <div className={`committee-badge ${comm.badgeClass || ''}`}>
                {comm.badge}
              </div>
              <h3 className="committee-name">{comm.title}</h3>

              <div className="member-profiles-grid">
                {comm.members.map((member) => (
                  <div
                    key={member.name}
                    className={`member-profile-card ${comm.isLead ? 'lead-card' : ''}`}
                  >
                    <div className="member-avatar-wrap">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="member-photo"
                        width={104}
                        height={104}
                      />
                    </div>
                    <div className="member-info">
                      <span
                        className={`member-name ${comm.isLead ? 'lead-name' : ''}`}
                      >
                        {member.name}
                      </span>
                      {member.subrole && (
                        <span className="member-subrole">{member.subrole}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="committee-role">
                <strong>Role:</strong> {comm.roleDescription}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Return to Check-in CTA */}
      <section className="about-cta-section">
        <Link href="/" className="btn-primary-checkin">
          <span>Check In With Yourself Now</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
