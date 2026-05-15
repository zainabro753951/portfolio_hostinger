// ============================================================================
// 📁 ContactSection.jsx
// ============================================================================
import { GlassCard, GradientText, THEME } from '@/components/UI';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useSendMessage } from '../Queries/SendMessage';

gsap.registerPlugin(ScrollTrigger);

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
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: '', email: '', subject: '', message: '' },
    mode: 'onBlur',
  });

  const [focusedField, setFocusedField] = useState(null);
  const { mutate, isSuccess, isError, error, isPending, reset: resetMutation } = useSendMessage();

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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: contact_info?.email,
      href: `mailto:${contact_info?.email}`,
      gradient: THEME.gradientCyanBlue,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contact_info?.contactPhone,
      href: `tel:${contact_info?.contactPhone?.split(' ').join('')}`,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Tando Muhammad Khan, Sindh, Pakistan',
      href: '#',
      gradient: THEME.gradientBluePurple,
    },
  ];

  const socialLinks = [
    { icon: Github, href: contact_info?.github, label: 'GitHub', hoverColor: '#e2e8f0' },
    { icon: Linkedin, href: contact_info?.linkedin, label: 'LinkedIn', hoverColor: '#3b82f6' },
    { icon: Facebook, href: contact_info?.facebook, label: 'Facebook', hoverColor: '#0ea5e9' },
    { icon: Instagram, href: contact_info?.instagram, label: 'Instagram', hoverColor: '#ec4899' },
  ];

  const inputFields = [
    {
      name: 'fullName',
      type: 'text',
      label: 'Your Name',
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
      validation: {
        required: 'Subject is required',
        minLength: { value: 3, message: 'Minimum 3 characters' },
        maxLength: { value: 100, message: 'Maximum 100 characters' },
      },
    },
  ];

  const onSubmit = useCallback(
    (formData) => {
      mutate(formData, {
        onSuccess: () => reset({ fullName: '', email: '', subject: '', message: '' }),
        onError: (err) => console.error('Submission error:', err),
      });
    },
    [mutate, reset]
  );

  const getBackendErrorMessage = () => {
    if (!error) return null;
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong.'
    );
  };

  return (
    <section ref={contactRef} className="relative" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: THEME.textWhite }}
              >
                Contact <GradientText>Information</GradientText>
              </h2>
              <p className="leading-relaxed" style={{ color: THEME.textGray }}>
                Feel free to reach out through any of these channels. I'm always open to discussing
                new projects and opportunities.
              </p>
            </motion.div>

            {/* Contact Details */}
            <div className="space-y-4 mb-12">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                  style={{
                    background: THEME.bgCard,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${THEME.border}`,
                  }}
                  whileHover={{
                    x: 10,
                    scale: 1.02,
                    borderColor: 'rgba(2, 211, 254, 0.3)',
                    boxShadow: '0 0 20px rgba(2, 211, 254, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'backOut', delay: index * 0.08 }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-lg"
                    style={{ background: item.gradient }}
                  >
                    <item.icon size={24} style={{ color: '#ffffff' }} />
                  </div>
                  <div className="text-start">
                    <p className="text-sm" style={{ color: THEME.textGrayDark }}>
                      {item.label}
                    </p>
                    <p
                      className="font-medium transition-colors duration-300 group-hover:text-cyan-400"
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: THEME.textWhite }}>
                Follow Me
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
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
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <GlassCard className="p-8 shadow-2xl" hover={false}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.textWhite }}>
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
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <CheckCircle size={40} style={{ color: '#ffffff' }} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: THEME.textWhite }}>
                      Message Sent!
                    </h3>
                    <p style={{ color: THEME.textGray }}>
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
                    className="space-y-8"
                    noValidate
                  >
                    {/* Backend Error */}
                    <AnimatePresence>
                      {isError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="flex items-start gap-3 p-4 rounded-xl border"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                            style={{ color: '#f87171' }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm" style={{ color: '#fca5a5' }}>
                              Submission Failed
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: '#fecaca' }}>
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
                      const inputEl = formRef.current?.querySelector(`#${field.name}`);
                      const hasValue = inputEl?.value?.length > 0;

                      return (
                        <div key={field.name} className="relative">
                          <motion.label
                            animate={{
                              y: isFocused || hasValue ? -20 : 4,
                              scale: isFocused || hasValue ? 0.85 : 1,
                              color: hasError
                                ? '#f87171'
                                : isFocused
                                  ? THEME.cyan
                                  : THEME.textGrayDark,
                            }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 origin-left pointer-events-none font-medium"
                          >
                            {field.label}
                          </motion.label>
                          <input
                            id={field.name}
                            type={field.type}
                            {...register(field.name, field.validation)}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full bg-transparent outline-none py-3 text-white transition-colors duration-300 border-b-2 ${hasError ? 'border-red-400' : isFocused ? 'border-cyan-400' : 'border-white/20'}`}
                          />
                          <AnimatePresence>
                            {hasError && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-red-400 text-xs mt-2 flex items-center gap-1"
                              >
                                <AlertCircle size={12} /> {errors[field.name].message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* Message Field */}
                    <div className="relative">
                      <motion.label
                        animate={{
                          y:
                            focusedField === 'message' ||
                            formRef.current?.querySelector('#message')?.value?.length > 0
                              ? -20
                              : 4,
                          scale:
                            focusedField === 'message' ||
                            formRef.current?.querySelector('#message')?.value?.length > 0
                              ? 0.85
                              : 1,
                          color: errors.message
                            ? '#f87171'
                            : focusedField === 'message'
                              ? THEME.cyan
                              : THEME.textGrayDark,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 origin-left pointer-events-none font-medium"
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
                        className={`w-full bg-transparent outline-none py-3 text-white transition-colors duration-300 resize-none border-b-2 ${errors.message ? 'border-red-400' : focusedField === 'message' ? 'border-cyan-400' : 'border-white/20'}`}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-red-400 text-xs mt-2 flex items-center gap-1"
                          >
                            <AlertCircle size={12} /> {errors.message.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isPending}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(2, 211, 254, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
                      style={{ background: THEME.gradientPrimary, color: '#ffffff' }}
                    >
                      <span
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                      />
                      {isPending ? (
                        <>
                          <Loader2 size={20} className="animate-spin relative z-10" />{' '}
                          <span className="relative z-10">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} className="relative z-10" />{' '}
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
  );
});

export default ContactSection;
