import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  AlertCircle,
  Facebook,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSendMessage } from "../Queries/SendMessage";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const contactRef = useRef(null);
  const formRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const subject = searchParams.get("subject");
  const message = searchParams.get("message");
  const paramsProcessed = useRef(false);
  const { contact_info } = useSelector((state) => state.siteSettings);

  // ===========  React Hook Form Setup ==============
  // ✅ FIX: Static empty defaultValues — kabhi bhi URL params se populate nahi honge
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  const [focusedField, setFocusedField] = useState(null);

  const {
    mutate,
    isSuccess,
    isError,
    error,
    isPending,
    reset: resetMutation,
  } = useSendMessage();

  // ✅ FIX: Params processing aur cleanup — ek baar aur sahi tarah se
  useEffect(() => {
    // Agar params hain aur abhi tak process nahi hue
    if ((subject || message) && !paramsProcessed.current) {
      paramsProcessed.current = true;

      // Form ko params se populate karo
      reset({
        fullName: "",
        email: "",
        subject: subject || "",
        message: message || "",
      });

      // URL se params hatao
      setSearchParams({}, { replace: true });
    }
    // Agar params nahi hain aur form abhi bhi purani values dikhata hai
    else if (!subject && !message && !paramsProcessed.current) {
      // Form ko completely empty karo
      reset({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    }

    // Cleanup: jab component unmount ho, ya URL change ho
    return () => {
      // Kuch nahi karna
    };
  }, [subject, message, reset, setSearchParams]);

  // ✅ FIX: Form submit success ke baad form ko completely reset karo
  useEffect(() => {
    if (isSuccess) {
      // Success state ke baad jab form wapas dikhne lage, usse empty karo
      const timer = setTimeout(() => {
        reset({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
        paramsProcessed.current = false; // Reset the flag so next time params can be processed
      }, 5000); // 5 seconds baad jab success message hat jaye

      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: contact_info?.email,
      href: `mailto:${contact_info?.email}`,
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact_info?.contactPhone,
      href: `tel:${contact_info?.contactPhone.split(" ").join()}`,
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Tando Muhammad Khan, Sindh, Pakistan",
      href: "#",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: contact_info?.github,
      label: "GitHub",
      color: "hover:text-gray-100",
    },
    {
      icon: Linkedin,
      href: contact_info?.linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Facebook,
      href: contact_info?.facebook,
      label: "Facebook",
      color: "hover:text-sky-400",
    },
    {
      icon: Instagram,
      href: contact_info?.instagram,
      label: "Instagram",
      color: "hover:text-pink-400",
    },
  ];

  const inputFields = [
    {
      name: "fullName",
      type: "text",
      label: "Your Name",
      validation: {
        required: "Name is required",
        minLength: {
          value: 2,
          message: "Name must be at least 2 characters",
        },
        maxLength: {
          value: 50,
          message: "Name must be less than 50 characters",
        },
      },
    },
    {
      name: "email",
      type: "email",
      label: "Your Email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "subject",
      type: "text",
      label: "Subject",
      validation: {
        required: "Subject is required",
        minLength: {
          value: 3,
          message: "Subject must be at least 3 characters",
        },
        maxLength: {
          value: 100,
          message: "Subject must be less than 100 characters",
        },
      },
    },
  ];

  // ===========  Form Submit Handler  ==============
  const onSubmit = (formData) => {
    mutate(formData, {
      onSuccess: () => {
        // Form empty karo
        reset({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          resetMutation();
        }, 5000);
      },
      onError: (err) => {
        console.error("Form submission error:", err);
      },
    });
  };

  const getBackendErrorMessage = () => {
    if (!error) return null;
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return "Something went wrong. Please try again.";
  };

  return (
    <section
      ref={contactRef}
      className="py-24 relative"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Background gradient decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Contact <span className="text-purple-500">Information</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Feel free to reach out through any of these channels. I'm always
                open to discussing new projects and opportunities.
              </p>
            </motion.div>

            {/* Contact Details */}
            <div className="space-y-4 mb-12">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className=" flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:border-cyan-400/30 group "
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "backOut",
                    delay: index * 0.08,
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="text-start">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
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
              <h3 className="text-xl font-semibold text-white mb-4">
                Follow Me
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center text-gray-400 ${social.color} border border-white/10 hover:border-current transition-all duration-300`}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
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
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <motion.div
              className="backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Send a Message
              </h2>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}
                    >
                      <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400">
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
                    className="space-y-6"
                    noValidate
                  >
                    {/* Backend Error Message */}
                    <AnimatePresence>
                      {isError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm"
                        >
                          <AlertCircle
                            size={20}
                            className="text-red-400 mt-0.5 shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-red-300 font-medium text-sm">
                              Submission Failed
                            </p>
                            <p className="text-red-200/80 text-sm mt-0.5">
                              {getBackendErrorMessage()}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input Fields */}
                    {inputFields.map((field) => (
                      <div key={field.name} className="relative">
                        <motion.label
                          animate={{
                            y:
                              focusedField === field.name ||
                              document.getElementById(field.name)?.value
                                ? -24
                                : 0,
                            scale:
                              focusedField === field.name ||
                              document.getElementById(field.name)?.value
                                ? 0.85
                                : 1,
                            color: errors[field.name]
                              ? "#f87171"
                              : focusedField === field.name
                                ? "#22d3ee"
                                : "#6b7280",
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-3 origin-left pointer-events-none font-medium"
                        >
                          {field.label}
                        </motion.label>
                        <input
                          id={field.name}
                          type={field.type}
                          {...register(field.name, field.validation)}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full bg-transparent border-b-2 outline-none py-3 text-white transition-colors duration-300 ${
                            errors[field.name]
                              ? "border-red-400 focus:border-red-400"
                              : "border-white/20 focus:border-cyan-400"
                          }`}
                        />

                        {/* Field Error Message */}
                        <AnimatePresence>
                          {errors[field.name] && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-red-400 text-xs mt-2 flex items-center gap-1"
                            >
                              <AlertCircle size={12} />
                              {errors[field.name].message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    {/* Message Field */}
                    <div className="relative">
                      <motion.label
                        animate={{
                          y:
                            focusedField === "message" ||
                            document.getElementById("message")?.value
                              ? -24
                              : 0,
                          scale:
                            focusedField === "message" ||
                            document.getElementById("message")?.value
                              ? 0.85
                              : 1,
                          color: errors.message
                            ? "#f87171"
                            : focusedField === "message"
                              ? "#22d3ee"
                              : "#6b7280",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-3 origin-left pointer-events-none font-medium"
                      >
                        Your Message
                      </motion.label>
                      <textarea
                        id="message"
                        {...register("message", {
                          required: "Message is required",
                          minLength: {
                            value: 10,
                            message: "Message must be at least 10 characters",
                          },
                          maxLength: {
                            value: 1000,
                            message:
                              "Message must be less than 1000 characters",
                          },
                        })}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        rows={4}
                        className={`w-full bg-transparent border-b-2 outline-none py-3 text-white transition-colors duration-300 resize-none ${
                          errors.message
                            ? "border-red-400 focus:border-red-400"
                            : "border-white/20 focus:border-cyan-400"
                        }`}
                      />

                      {/* Message Error */}
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-red-400 text-xs mt-2 flex items-center gap-1"
                          >
                            <AlertCircle size={12} />
                            {errors.message.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isPending}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-8"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
