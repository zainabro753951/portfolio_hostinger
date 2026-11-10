import BrandLogo from '@/components/ds/BrandLogo';
import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { EASE_OUT, useMotionPrefs } from '@/lib/motion';
import { NAV_LINKS } from '@/lib/navigation';
import {
  ArrowUp,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// The backend has no address field yet, so the existing location text is kept here.
// TODO(backend): move to contact_info if an address field is added.
const LOCATION = { locality: 'Tando Muhammad Khan', region: 'Sindh', country: 'PK' };

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base';
const LINK_CLS = `inline-flex min-h-9 items-center rounded-md text-sm text-ink-secondary transition-colors duration-200 hover:text-ink motion-reduce:transition-none ${FOCUS_RING}`;
const COL_TITLE = 'mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink';

const isSafeUrl = (url) => typeof url === 'string' && url.trim() !== '' && !/^(javascript|data|vbscript):/i.test(url.trim());
const isExternal = (url) => /^https?:\/\//i.test(url);

const Footer = memo(() => {
  const { contact_info, site_info } = useSelector((state) => state.siteSettings);
  const { services } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(services);
  const { reduced, isMobile } = useMotionPrefs();

  const siteName = site_info?.websiteName || 'Portfolio';
  const email = contact_info?.email?.trim();
  const phone = contact_info?.contactPhone?.trim();

  // Only real services from the backend — no placeholder list
  const footerServices = useMemo(
    () => (sortedServices || []).filter((s) => s?.title && s?.slug).slice(0, 5),
    [sortedServices]
  );

  // Only render socials that actually have a URL
  const socialLinks = useMemo(
    () =>
      [
        { icon: Github, href: contact_info?.github, label: 'GitHub' },
        { icon: Linkedin, href: contact_info?.linkedin, label: 'LinkedIn' },
        { icon: Facebook, href: contact_info?.facebook, label: 'Facebook' },
        { icon: Instagram, href: contact_info?.instagram, label: 'Instagram' },
        { icon: Twitter, href: contact_info?.twitter, label: 'Twitter' },
      ].filter((s) => isSafeUrl(s.href)),
    [contact_info]
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: typeof window !== 'undefined' ? window.location.origin : undefined,
      email: email || undefined,
      telephone: phone || undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: LOCATION.locality,
        addressRegion: LOCATION.region,
        addressCountry: LOCATION.country,
      },
      sameAs: socialLinks.filter((s) => isExternal(s.href)).map((s) => s.href),
    }),
    [siteName, email, phone, socialLinks]
  );

  const parent = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: reduced ? 0 : isMobile ? 0.05 : 0.09 } },
    }),
    [reduced, isMobile]
  );
  const child = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduced ? 0 : isMobile ? 12 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduced ? 0.01 : 0.55, ease: EASE_OUT },
      },
    }),
    [reduced, isMobile]
  );

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }),
    [reduced]
  );

  return (
    <footer className="relative overflow-hidden border-t border-line-subtle bg-surface-secondary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* One soft glow + hairline accent (no blur filters → cheap on mobile) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(var(--brand-blue)/0.10),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--brand-cyan)/0.5),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={parent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-20"
        >
          {/* Brand */}
          <motion.div variants={child} className="sm:col-span-2 lg:col-span-1">
            <BrandLogo className="mb-4 inline-flex max-w-full" />
            {site_info?.tagline && (
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-ink-secondary">
                {site_info.tagline}
              </p>
            )}
            {socialLinks.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Social media links">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={isExternal(href) ? '_blank' : undefined}
                      rel={isExternal(href) ? 'noopener noreferrer' : undefined}
                      aria-label={`${label} (opens in a new tab)`}
                      className={`grid h-11 w-11 place-items-center rounded-xl border border-line-subtle bg-surface-card/60 text-ink-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/40 hover:text-brand-cyan motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Quick links */}
          <motion.nav variants={child} aria-label="Footer navigation">
            <h2 className={COL_TITLE}>Quick Links</h2>
            <ul>
              {NAV_LINKS.map(({ name, path }) => (
                <li key={path}>
                  <Link to={path} className={LINK_CLS}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Services */}
          <motion.div variants={child}>
            <h2 className={COL_TITLE}>Services</h2>
            <ul>
              {footerServices.map((service) => (
                <li key={service.id ?? service.slug}>
                  <Link to={`/services/${service.slug}`} className={LINK_CLS}>
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className={`${LINK_CLS} font-medium text-brand-cyan hover:text-brand-cyan`}>
                  View all services
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={child}>
            <h2 className={COL_TITLE}>Get In Touch</h2>
            <ul className="space-y-3">
              {email && (
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className={`min-w-0 break-all pt-2 text-sm text-ink-secondary transition-colors hover:text-ink motion-reduce:transition-none ${FOCUS_RING} rounded-md`}
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <Phone size={16} aria-hidden="true" />
                  </span>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    className={`pt-2 text-sm text-ink-secondary transition-colors hover:text-ink motion-reduce:transition-none ${FOCUS_RING} rounded-md`}
                  >
                    {phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                  <MapPin size={16} aria-hidden="true" />
                </span>
                <address className="pt-1.5 text-sm not-italic leading-relaxed text-ink-secondary">
                  {LOCATION.locality}
                  <br />
                  {LOCATION.region}, Pakistan
                </address>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-subtle py-6 sm:flex-row">
          <p className="text-center text-sm text-ink-muted sm:text-left">
            © {currentYear} {site_info?.footerText || `${siteName}. All rights reserved.`}
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-subtle px-4 text-sm font-medium text-ink-secondary transition-colors hover:border-line-strong hover:text-ink motion-reduce:transition-none ${FOCUS_RING}`}
          >
            Back to top
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
