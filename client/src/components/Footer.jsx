import useCreatedAtSorted from '@/hooks/useCreatedAtSorted';
import { motion } from 'framer-motion';
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  const { contact_info, site_info } = useSelector((state) => state.siteSettings);
  const { services: sr } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const servicesTitles = useMemo(() => {
    if (sortedServices?.length > 0) {
      return sortedServices.map((item) => item?.title).filter(Boolean);
    }
    return ['Web Development', 'UI/UX Design', 'Motion Graphics', 'Brand Strategy'];
  }, [sortedServices]);

  const socialLinks = useMemo(
    () => [
      {
        icon: Github,
        href: contact_info?.github || '#',
        label: 'GitHub',
        color: 'hover:text-gray-100',
      },
      {
        icon: Linkedin,
        href: contact_info?.linkedin || '#',
        label: 'LinkedIn',
        color: 'hover:text-blue-400',
      },
      {
        icon: Facebook,
        href: contact_info?.facebook || '#',
        label: 'Facebook',
        color: 'hover:text-sky-400',
      },
      {
        icon: Instagram,
        href: contact_info?.instagram || '#',
        label: 'Instagram',
        color: 'hover:text-pink-400',
      },
      {
        icon: Twitter,
        href: contact_info?.twitter || '#',
        label: 'Twitter',
        color: 'hover:text-blue-300',
      },
    ],
    [contact_info]
  );

  const quickLinks = useMemo(
    () => [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Services', path: '/services' },
      { name: 'Projects', path: '/projects' },
      { name: 'Contact', path: '/contact' },
    ],
    []
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const structuredData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site_info?.siteName || 'Portfolio',
      url: window.location.origin,
      email: contact_info?.email || undefined,
      telephone: contact_info?.contactPhone || undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tando Muhammad Khan',
        addressRegion: 'Sindh',
        addressCountry: 'PK',
      },
      sameAs: socialLinks.filter((s) => s.href !== '#').map((s) => s.href),
    };
  }, [site_info, contact_info, socialLinks]);

  const containerVariants = useMemo(() => {
    if (prefersReducedMotion) return {};
    return {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };
  }, [prefersReducedMotion]);

  const animationProps = {
    initial: prefersReducedMotion ? 'visible' : 'hidden',
    whileInView: prefersReducedMotion ? undefined : 'visible',
    viewport: { once: true },
  };

  return (
    <footer
      className="relative bg-dark-charcoal pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-neon-blue/20 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-neon-purple/20 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
          {/* Brand Section */}
          <motion.div variants={containerVariants} {...animationProps}>
            <Link to="/" className="inline-block mb-4 sm:mb-6" aria-label="Go to homepage">
              <span className="text-xl sm:text-2xl font-display font-bold">
                <span className="text-white">PORT</span>
                <span className="text-neon-cyan">FOLIO</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-xs">
              Crafting digital experiences that merge art with functionality. Let's build something
              amazing together.
            </p>
            <nav aria-label="Social media links">
              <ul className="flex gap-3 sm:gap-4 flex-wrap" role="list">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={`Visit ${social.label}`}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.1, y: -2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-gray-400 ${social.color} hover:border-neon-cyan/50 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-cyan`}
                    >
                      <social.icon
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                        aria-hidden="true"
                      />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={containerVariants} {...animationProps}>
            <h3 className="text-white font-display font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-neon-cyan transition-colors text-xs sm:text-sm inline-block py-1 underline-animation focus:outline-none focus:text-neon-cyan"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={containerVariants} {...animationProps}>
            <h3 className="text-white font-display font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Services
            </h3>
            <ul className="space-y-2 sm:space-y-3" role="list">
              {servicesTitles.slice(0, 4).map((service, idx) => (
                <li key={`service-${idx}`}>
                  <span className="text-gray-400 text-xs sm:text-sm block py-1">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={containerVariants} {...animationProps}>
            <h3 className="text-white font-display font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Get In Touch
            </h3>
            <ul className="space-y-3 sm:space-y-4" role="list">
              <li className="flex items-start gap-2.5 sm:gap-3">
                <Mail
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-neon-cyan mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${contact_info?.email || 'zainabro886@gmail.com'}`}
                  className="text-gray-400 text-xs sm:text-sm hover:text-neon-cyan transition-colors break-all focus:outline-none focus:text-neon-cyan"
                >
                  {contact_info?.email || 'zainabro886@gmail.com'}
                </a>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <Phone
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-neon-cyan mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${contact_info?.contactPhone || '03032150993'}`}
                  className="text-gray-400 text-xs sm:text-sm hover:text-neon-cyan transition-colors focus:outline-none focus:text-neon-cyan"
                >
                  {contact_info?.contactPhone || '03032150993'}
                </a>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <MapPin
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] text-neon-cyan mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <address className="text-gray-400 text-xs sm:text-sm not-italic leading-relaxed">
                  Tando Muhammad Khan
                  <br />
                  Sindh, Pakistan
                </address>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div
          className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6 sm:mb-8"
          aria-hidden="true"
        />

        {/* Bottom Bar */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-1"
        >
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} {site_info?.footerText || 'Portfolio. All rights reserved.'}
          </p>
          <nav aria-label="Legal links">
            <ul
              className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6"
              role="list"
            >
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-500 hover:text-neon-cyan text-xs sm:text-sm transition-colors focus:outline-none focus:text-neon-cyan"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-500 hover:text-neon-cyan text-xs sm:text-sm transition-colors focus:outline-none focus:text-neon-cyan"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
