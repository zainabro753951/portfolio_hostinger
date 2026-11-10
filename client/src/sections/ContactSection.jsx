import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  CheckCircle,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';

import { useSendMessage } from '../Queries/SendMessage';
import { useMotionPrefs, fadeUp, VIEWPORT_ONCE } from '@/lib/motion';

const ContactSection = memo(() => {
  const contactRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectParam = searchParams.get('subject');
  const messageParam = searchParams.get('message');
  const planParam = searchParams.get('plan');
  const serviceParam = searchParams.get('service');
  const paramsProcessed = useRef(false);

  const { contact_info } = useSelector((state) => state.siteSettings);
  const { prefersReducedMotion } = useMotionPrefs();

  // Combine URL parameters intelligently
  const initialSubject = useMemo(() => {
    if (subjectParam) return subjectParam;
    if (planParam) return `Inquiry regarding ${planParam} Plan`;
    if (serviceParam) return `Inquiry regarding ${serviceParam} Service`;
    return '';
  }, [subjectParam, planParam, serviceParam]);

  const initialMessage = useMemo(() => {
    if (messageParam) return messageParam;
    if (planParam) return `Hello, I am interested in discussing the ${planParam} plan for my upcoming project.`;
    if (serviceParam) return `Hello, I would like to get more details and a quote for the ${serviceParam} service.`;
    return '';
  }, [messageParam, planParam, serviceParam]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({
    defaultValues: { fullName: '', email: '', subject: '', message: '' },
    mode: 'onBlur',
  });

  const { mutate, isSuccess, isError, error, isPending } = useSendMessage();

  // Process URL params on mount or when searchParams change
  useEffect(() => {
    if ((initialSubject || initialMessage) && !paramsProcessed.current) {
      paramsProcessed.current = true;
      reset({
        fullName: '',
        email: '',
        subject: initialSubject,
        message: initialMessage,
      });
      // Clear URL params cleanly without reloading
      setSearchParams({}, { replace: true });
    }
  }, [initialSubject, initialMessage, reset, setSearchParams]);

  // Reset form on successful submission
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset({ fullName: '', email: '', subject: '', message: '' });
        paramsProcessed.current = false;
        clearErrors();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset, clearErrors]);

  // Contact detail cards
  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: 'Direct Email',
        value: contact_info?.email || 'contact@developer.com',
        href: `mailto:${contact_info?.email || 'contact@developer.com'}`,
        gradient: 'from-brand-cyan/20 to-brand-blue/20',
        borderColor: 'border-brand-cyan/30',
        textColor: 'text-brand-cyan',
      },
      {
        icon: Phone,
        label: 'Direct Line / WhatsApp',
        value: contact_info?.contactPhone || '+92 303 215 0993',
        href: `tel:${(contact_info?.contactPhone || '+923032150993').replace(/\s/g, '')}`,
        gradient: 'from-emerald-500/20 to-teal-500/20',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
      },
      {
        icon: MapPin,
        label: 'Location & Timezone',
        value: 'Sindh, Pakistan (UTC+5 / PKT)',
        href: '#',
        gradient: 'from-brand-purple/20 to-brand-blue/20',
        borderColor: 'border-brand-purple/30',
        textColor: 'text-brand-purple',
      },
    ],
    [contact_info]
  );

  // Social platform links
  const socialLinks = useMemo(
    () => [
      {
        icon: Github,
        href: contact_info?.github || 'https://github.com',
        label: 'GitHub',
      },
      {
        icon: Linkedin,
        href: contact_info?.linkedin || 'https://linkedin.com',
        label: 'LinkedIn',
      },
      {
        icon: Facebook,
        href: contact_info?.facebook || '#',
        label: 'Facebook',
      },
      {
        icon: Instagram,
        href: contact_info?.instagram || '#',
        label: 'Instagram',
      },
    ].filter((s) => s.href && s.href !== '#'),
    [contact_info]
  );

  const onSubmit = useCallback(
    (formData) => {
      mutate(formData, {
        onSuccess: () => reset({ fullName: '', email: '', subject: '', message: '' }),
        onError: (err) => console.error('Message submission error:', err),
      });
    },
    [mutate, reset]
  );

  const backendErrorMessage = useMemo(() => {
    if (!error) return null;
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Unable to deliver message. Please try again or reach out directly via email.'
    );
  }, [error]);

  // Schema.org Structured Data
  const structuredData = useMemo(() => {
    if (!contact_info) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Portfolio Developer Services',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contact_info.contactPhone,
        contactType: 'technical sales & client support',
        email: contact_info.email,
        availableLanguage: ['English', 'Urdu'],
      },
      sameAs: socialLinks.map((s) => s.href),
    };
  }, [contact_info, socialLinks]);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div
        ref={contactRef}
        className="w-full relative z-10"
        aria-label="Contact channels and message form"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ═════════════════════════════════════════════════════════════════
              LEFT COLUMN: CONTACT INFORMATION & CHANNELS
             ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
            <motion.div
              variants={fadeUp}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 mb-3 shadow-glow-cyan">
                <Sparkles size={13} className="text-brand-cyan" aria-hidden="true" />
                Direct Communication
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink mb-3 tracking-tight">
                Get In <span className="text-brand-cyan">Touch</span>
              </h2>
              <p className="text-ink-secondary text-sm sm:text-base leading-relaxed">
                Whether you're looking for full-stack engineering, performance audits, or architecture
                consultation, my inbox is always open.
              </p>
            </motion.div>

            {/* Contact channels list */}
            <div className="space-y-3.5">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  variants={fadeUp}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                  whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-card/80 backdrop-blur-md border border-line-subtle hover:border-brand-cyan/40 hover:shadow-glow-cyan transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  aria-label={`Contact via ${item.label}: ${item.value}`}
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.gradient} border ${item.borderColor} ${item.textColor} group-hover:scale-105 transition-transform duration-300 shadow-md`}
                    aria-hidden="true"
                  >
                    <item.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-ink-muted uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-ink truncate group-hover:text-brand-cyan transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social media presence */}
            {socialLinks.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial={prefersReducedMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                className="pt-2"
              >
                <h3 className="text-xs font-mono uppercase tracking-wider text-ink-secondary mb-3">
                  Online Profiles
                </h3>
                <nav aria-label="Social media links">
                  <ul className="flex items-center gap-2.5 flex-wrap">
                    {socialLinks.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${social.label} profile`}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-card/80 hover:bg-surface-elevated border border-line-subtle hover:border-brand-cyan/50 text-ink-secondary hover:text-brand-cyan flex items-center justify-center transition-all duration-200 hover:shadow-glow-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                        >
                          <social.icon size={18} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            )}
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT COLUMN: INTERACTIVE MESSAGE FORM
             ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative rounded-3xl bg-surface-card/90 backdrop-blur-xl border border-line-subtle p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
              {/* Subtle top ambient accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple"
                aria-hidden="true"
              />

              <div className="mb-6">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink mb-1">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary">
                  Fill in your details and I'll get back to you promptly.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success-state"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 sm:py-16 text-center"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                      <CheckCircle size={36} aria-hidden="true" />
                    </div>
                    <h4 className="font-heading text-xl sm:text-2xl font-bold text-ink mb-2">
                      Message Successfully Sent!
                    </h4>
                    <p className="text-sm sm:text-base text-ink-secondary max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. Your transmission has been received, and I'll review
                      your notes and reply within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="active-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-5"
                    noValidate
                    aria-label="Contact inquiry form"
                  >
                    {/* Error Banner */}
                    <AnimatePresence>
                      {isError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3"
                          role="alert"
                          aria-live="assertive"
                        >
                          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <div className="text-xs sm:text-sm">
                            <p className="font-semibold text-red-300">Submission Error</p>
                            <p className="mt-0.5 text-red-200/90">{backendErrorMessage}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Name & Email Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-mono font-medium text-ink-secondary"
                        >
                          Your Name <span className="text-brand-cyan">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          placeholder="Jane Doe"
                          autoComplete="name"
                          {...register('fullName', {
                            required: 'Please enter your name',
                            minLength: { value: 2, message: 'Minimum 2 characters' },
                            maxLength: { value: 60, message: 'Maximum 60 characters' },
                          })}
                          style={{
                            backgroundColor: '#0A0A0F',
                            color: '#F5F7FA',
                            colorScheme: 'dark',
                          }}
                          className={`w-full rounded-xl bg-[#0A0A0F] border px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#737386] transition-all duration-200 outline-none focus:ring-1 ${
                            errors.fullName
                              ? 'border-red-400/80 focus:border-red-400 focus:ring-red-400'
                              : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan focus:shadow-glow-cyan'
                          }`}
                          aria-invalid={errors.fullName ? 'true' : 'false'}
                          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                        />
                        {errors.fullName && (
                          <p
                            id="fullName-error"
                            className="text-xs text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle size={12} aria-hidden="true" />
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="block text-xs font-mono font-medium text-ink-secondary"
                        >
                          Your Email <span className="text-brand-cyan">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          autoComplete="email"
                          {...register('email', {
                            required: 'Please enter your email',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Please provide a valid email address',
                            },
                          })}
                          style={{
                            backgroundColor: '#0A0A0F',
                            color: '#F5F7FA',
                            colorScheme: 'dark',
                          }}
                          className={`w-full rounded-xl bg-[#0A0A0F] border px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#737386] transition-all duration-200 outline-none focus:ring-1 ${
                            errors.email
                              ? 'border-red-400/80 focus:border-red-400 focus:ring-red-400'
                              : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan focus:shadow-glow-cyan'
                          }`}
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                          <p
                            id="email-error"
                            className="text-xs text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle size={12} aria-hidden="true" />
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="block text-xs font-mono font-medium text-ink-secondary"
                      >
                        Subject <span className="text-brand-cyan">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="Project Consultation / Full-Stack Development"
                        {...register('subject', {
                          required: 'Please enter a subject',
                          minLength: { value: 3, message: 'Minimum 3 characters' },
                          maxLength: { value: 120, message: 'Maximum 120 characters' },
                        })}
                        style={{
                          backgroundColor: '#0A0A0F',
                          color: '#F5F7FA',
                          colorScheme: 'dark',
                        }}
                        className={`w-full rounded-xl bg-[#0A0A0F] border px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#737386] transition-all duration-200 outline-none focus:ring-1 ${
                          errors.subject
                            ? 'border-red-400/80 focus:border-red-400 focus:ring-red-400'
                            : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan focus:shadow-glow-cyan'
                        }`}
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                      />
                      {errors.subject && (
                        <p
                          id="subject-error"
                          className="text-xs text-red-400 flex items-center gap-1 mt-1"
                          role="alert"
                        >
                          <AlertCircle size={12} aria-hidden="true" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="block text-xs font-mono font-medium text-ink-secondary"
                      >
                        Project Details / Message <span className="text-brand-cyan">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell me about your product vision, timeline, target deliverables, or requirements..."
                        {...register('message', {
                          required: 'Please write your message',
                          minLength: { value: 10, message: 'Minimum 10 characters' },
                          maxLength: { value: 10000, message: 'Maximum 10,000 characters' },
                        })}
                        style={{
                          backgroundColor: '#0A0A0F',
                          color: '#F5F7FA',
                          colorScheme: 'dark',
                        }}
                        className={`w-full rounded-xl bg-[#0A0A0F] border px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#737386] transition-all duration-200 outline-none focus:ring-1 resize-none ${
                          errors.message
                            ? 'border-red-400/80 focus:border-red-400 focus:ring-red-400'
                            : 'border-white/10 focus:border-brand-cyan focus:ring-brand-cyan focus:shadow-glow-cyan'
                        }`}
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          className="text-xs text-red-400 flex items-center gap-1 mt-1"
                          role="alert"
                        >
                          <AlertCircle size={12} aria-hidden="true" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPending || isSubmitting}
                      className="w-full mt-2 py-3.5 sm:py-4 px-6 rounded-xl font-heading font-semibold text-sm sm:text-base text-surface-base bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan bg-[length:200%_auto] hover:bg-right hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                          <span>Delivering Transmission...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} aria-hidden="true" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ContactSection.displayName = 'ContactSection';
export default ContactSection;
