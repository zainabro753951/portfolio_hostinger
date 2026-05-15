import { GlassCard, GradientText, THEME } from '@/components/UI';
import { AnimatePresence, motion } from 'framer-motion';
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
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useSendMessage } from '../Queries/SendMessage';

const ContactSection = memo(() => {
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const subject = searchParams.get('subject');
  const message = searchParams.get('message');
  const paramsProcessed = useRef(false);
  const { contact_info } = useSelector((state) => state.siteSettings);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitted },
    clearErrors,
  } = useForm({
    defaultValues: { fullName: '', email: '', subject: '', message: '' },
    mode: 'onBlur',
  });

  const [focusedField, setFocusedField] = useState(null);
  const { mutate, isSuccess, isError, error, isPending } = useSendMessage();

  // Track values for floating label animation without DOM queries
  const watchedValues = watch(['fullName', 'email', 'subject', 'message']);
  const hasValue = (fieldName, index) => {
    const value = watchedValues[index];
    return typeof value === 'string' ? value.trim().length > 0 : false;
  };

  // Process URL params
  useEffect(() => {
    if ((subject || message) && !paramsProcessed.current) {
      paramsProcessed.current = true;
      reset({ fullName: '', email: '', subject: subject || '', message: message || '' });
      setSearchParams({}, { replace: true });
    } else if (!subject && !message && !paramsProcessed.current) {
      reset({ fullName: '', email: '', subject: '', message: '' });
    }
  }, [subject, message, reset, setSearchParams]);

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset({ fullName: '', email: '', subject: '', message: '' });
        paramsProcessed.current = false;
        clearErrors();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset, clearErrors]);

  // Memoized static data
  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: 'Email',
        value: contact_info?.email || 'contact@example.com',
        href: `mailto:${contact_info?.email}`,
        gradient: THEME.gradientCyanBlue,
      },
      {
        icon: Phone,
        label: 'Phone',
        value: contact_info?.contactPhone || '+92 303 215 0993',
        href: `tel:${(contact_info?.contactPhone || '+923032150993').replace(/\s/g, '')}`,
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
      },
      {
        icon: MapPin,
        label: 'Location',
        value: 'Tando Muhammad Khan, Sindh, Pakistan',
        href: '#',
        gradient: THEME.gradientBluePurple,
      },
    ],
    [contact_info]
  );

  const socialLinks = useMemo(
    () => [
      { icon: Github, href: contact_info?.github || '#', label: 'GitHub', hoverColor: '#e2e8f0' },
      {
        icon: Linkedin,
        href: contact_info?.linkedin || '#',
        label: 'LinkedIn',
        hoverColor: '#3b82f6',
      },
      {
        icon: Facebook,
        href: contact_info?.facebook || '#',
        label: 'Facebook',
        hoverColor: '#0ea5e9',
      },
      {
        icon: Instagram,
        href: contact_info?.instagram || '#',
        label: 'Instagram',
        hoverColor: '#ec4899',
      },
    ],
    [contact_info]
  );

  const inputFields = useMemo(
    () => [
      {
        name: 'fullName',
        type: 'text',
        label: 'Your Name',
        idx: 0,
        validation: {
          required: 'Name is required',
          minLength: { value: 2, message: 'Minimum 2 characters' },
          maxLength: { value: 50, message: 'Maximum 50 characters' },
        },
      },
      {
        name: 'email',
        type: 'email',
        label: 'Your Email',
        idx: 1,
        validation: {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        },
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject',
        idx: 2,
        validation: {
          required: 'Subject is required',
          minLength: { value: 3, message: 'Minimum 3 characters' },
          maxLength: { value: 100, message: 'Maximum 100 characters' },
        },
      },
    ],
    []
  );

  const onSubmit = useCallback(
    (formData) => {
      mutate(formData, {
        onSuccess: () => reset({ fullName: '', email: '', subject: '', message: '' }),
        onError: (err) => console.error('Submission error:', err),
      });
    },
    [mutate, reset]
  );

  const getBackendErrorMessage = useCallback(() => {
    if (!error) return null;
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong. Please try again later.'
    );
  }, [error]);

  // Structured Data for SEO
  const structuredData = useMemo(() => {
    if (!contact_info) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Portfolio',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contact_info.contactPhone,
        contactType: 'customer service',
        email: contact_info.email,
        availableLanguage: ['English', 'Urdu'],
      },
      sameAs: socialLinks.filter((s) => s.href !== '#').map((s) => s.href),
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
      <section
        ref={contactRef}
        className="relative w-full"
        style={{ zIndex: 2 }}
        aria-label="Contact Form and Information"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
            {/* Contact Info */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: '-50px' }}
                className="mb-6 sm:mb-8 lg:mb-12"
              >
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight"
                  style={{ color: THEME.textWhite }}
                >
                  Contact <GradientText>Information</GradientText>
                </h2>
                <p
                  className="leading-relaxed text-sm sm:text-base max-w-md"
                  style={{ color: THEME.textGray }}
                >
                  Feel free to reach out through any of these channels. I'm always open to
                  discussing new projects and opportunities.
                </p>
              </motion.div>

              {/* Contact Details */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 lg:mb-12">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                    style={{
                      background: THEME.bgCard,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${THEME.border}`,
                    }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -24, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'backOut', delay: index * 0.08 }}
                    viewport={{ once: true, margin: '-50px' }}
                    aria-label={`Contact via ${item.label}`}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-lg flex-shrink-0"
                      style={{ background: item.gradient }}
                    >
                      <item.icon
                        size={20}
                        className="sm:w-6 sm:h-6 md:w-6 md:h-6"
                        style={{ color: '#ffffff' }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-start min-w-0">
                      <p className="text-xs sm:text-sm" style={{ color: THEME.textGrayDark }}>
                        {item.label}
                      </p>
                      <p
                        className="text-sm sm:text-base font-medium truncate transition-colors duration-300 group-hover:text-cyan-400"
                        style={{ color: THEME.textWhite }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <h3
                  className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4"
                  style={{ color: THEME.textWhite }}
                >
                  Follow Me
                </h3>
                <nav aria-label="Social media links">
                  <ul className="flex gap-2 sm:gap-3 flex-wrap">
                    {socialLinks.map((social, index) => (
                      <li key={index}>
                        <motion.a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${social.label}`}
                          whileHover={{ scale: 1.1, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          style={{
                            background: THEME.bgCard,
                            border: `1px solid ${THEME.border}`,
                            color: THEME.textGray,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = social.hoverColor;
                            e.currentTarget.style.borderColor = social.hoverColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = THEME.textGray;
                            e.currentTarget.style.borderColor = THEME.border;
                          }}
                        >
                          <social.icon size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              className="order-1 lg:order-2"
              initial={{ x: 24, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <GlassCard className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl" hover={false}>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
                  style={{ color: THEME.textWhite }}
                >
                  Send a Message
                </h2>

                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="text-center py-8 sm:py-10 md:py-12"
                      role="alert"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <CheckCircle
                          size={32}
                          className="sm:w-10 sm:h-10"
                          style={{ color: '#ffffff' }}
                          aria-hidden="true"
                        />
                      </motion.div>
                      <h3
                        className="text-xl sm:text-2xl font-bold mb-2"
                        style={{ color: THEME.textWhite }}
                      >
                        Message Sent!
                      </h3>
                      <p className="text-sm sm:text-base px-4" style={{ color: THEME.textGray }}>
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5 sm:space-y-6 md:space-y-8"
                      noValidate
                      aria-label="Contact form"
                    >
                      {/* Backend Error */}
                      <AnimatePresence>
                        {isError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border"
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                            }}
                            role="alert"
                            aria-live="polite"
                          >
                            <AlertCircle
                              size={18}
                              className="sm:w-5 sm:h-5 mt-0.5 shrink-0"
                              style={{ color: '#f87171' }}
                              aria-hidden="true"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm" style={{ color: '#fca5a5' }}>
                                Submission Failed
                              </p>
                              <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#fecaca' }}>
                                {getBackendErrorMessage()}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Input Fields */}
                      {inputFields.map((field) => {
                        const hasError = !!errors[field.name];
                        const isFocused = focusedField === field.name;
                        const hasVal = hasValue(field.name, field.idx);

                        return (
                          <div key={field.name} className="relative pt-2">
                            <motion.label
                              htmlFor={field.name}
                              animate={{
                                y: isFocused || hasVal ? -16 : 2,
                                scale: isFocused || hasVal ? 0.85 : 1,
                                color: hasError
                                  ? '#f87171'
                                  : isFocused
                                    ? THEME.cyan
                                    : THEME.textGrayDark,
                                left: isFocused || hasVal ? 0 : 0,
                              }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="absolute origin-left pointer-events-none font-medium text-sm sm:text-base px-0.5"
                            >
                              {field.label}
                            </motion.label>
                            <input
                              id={field.name}
                              type={field.type}
                              {...register(field.name, field.validation)}
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => {
                                setFocusedField(null);
                                // trigger validation on blur
                                if (errors[field.name] || isSubmitted) return;
                              }}
                              className={`w-full bg-transparent outline-none py-2.5 sm:py-3 text-sm sm:text-base text-white transition-colors duration-300 border-b-2 ${
                                hasError
                                  ? 'border-red-400'
                                  : isFocused
                                    ? 'border-cyan-400'
                                    : 'border-white/20 focus:border-white/40'
                              }`}
                              aria-invalid={hasError ? 'true' : 'false'}
                              aria-describedby={hasError ? `${field.name}-error` : undefined}
                              autoComplete={field.name === 'email' ? 'email' : field.name}
                            />
                            <AnimatePresence>
                              {hasError && (
                                <motion.p
                                  id={`${field.name}-error`}
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="text-red-400 text-xs mt-2 flex items-center gap-1"
                                  role="alert"
                                >
                                  <AlertCircle size={12} aria-hidden="true" />{' '}
                                  {errors[field.name].message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {/* Message Field */}
                      <div className="relative pt-2">
                        <motion.label
                          htmlFor="message"
                          animate={{
                            y: focusedField === 'message' || hasValue('message', 3) ? -16 : 2,
                            scale: focusedField === 'message' || hasValue('message', 3) ? 0.85 : 1,
                            color: errors.message
                              ? '#f87171'
                              : focusedField === 'message'
                                ? THEME.cyan
                                : THEME.textGrayDark,
                          }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute origin-left pointer-events-none font-medium text-sm sm:text-base px-0.5"
                        >
                          Your Message
                        </motion.label>
                        <textarea
                          id="message"
                          {...register('message', {
                            required: 'Message is required',
                            minLength: { value: 10, message: 'Minimum 10 characters' },
                            maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                          })}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          rows={4}
                          className={`w-full bg-transparent outline-none py-2.5 sm:py-3 text-sm sm:text-base text-white transition-colors duration-300 resize-none border-b-2 ${
                            errors.message
                              ? 'border-red-400'
                              : focusedField === 'message'
                                ? 'border-cyan-400'
                                : 'border-white/20 focus:border-white/40'
                          }`}
                          aria-invalid={errors.message ? 'true' : 'false'}
                          aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p
                              id="message-error"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-red-400 text-xs mt-2 flex items-center gap-1"
                              role="alert"
                            >
                              <AlertCircle size={12} aria-hidden="true" /> {errors.message.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={
                          !isPending
                            ? { scale: 1.01, boxShadow: '0 0 30px rgba(2, 211, 254, 0.3)' }
                            : {}
                        }
                        whileTap={!isPending ? { scale: 0.99 } : {}}
                        className="w-full py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                        style={{ background: THEME.gradientPrimary, color: '#ffffff' }}
                      >
                        <span
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                          style={{
                            background:
                              'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          }}
                          aria-hidden="true"
                        />
                        {isPending ? (
                          <>
                            <Loader2
                              size={18}
                              className="sm:w-5 sm:h-5 animate-spin relative z-10"
                              aria-hidden="true"
                            />{' '}
                            <span className="relative z-10">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send
                              size={18}
                              className="sm:w-5 sm:h-5 relative z-10"
                              aria-hidden="true"
                            />{' '}
                            <span className="relative z-10">Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
});

ContactSection.displayName = 'ContactSection';
export default ContactSection;
