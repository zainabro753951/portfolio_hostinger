import React, { useEffect } from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useCursorHoverContext } from "../context/CursorHover";
import GardientButton from "../components/GardientButton";
import { useForm } from "react-hook-form";
import { useSendMessage } from "../Queries/SendMessage";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ContactSectionSkeleton from "../components/ContactSectionSkeleton";
import { useLocation, useParams } from "react-router-dom";
import { planFindById, clearPlan } from "../features/planSlice";
import Plan from "./Plan";
import { capitalize } from "../Utils/Utils";

// --------------------
// Modern, responsive, and attention-grabbing Contact component
// - Uses glassmorphism + trendy violet -> cyan gradient
// - Improved accessible form (floating labels + inline errors)
// - Subtle but polished motion with framer-motion
// - Fully responsive: mobile-first, collapses gracefully
// --------------------

const Contact = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { onCursorEnter, onCursorLeave } = useCursorHoverContext();

  const { contact_info, isLoading } = useSelector((s) => s.siteSettings || {});
  const { plan = {}, plans = [] } = useSelector((s) => s.plan || {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    if (planId) dispatch(planFindById(Number(planId)));
    else dispatch(clearPlan());
  }, [planId, dispatch, plans]);

  useEffect(() => {
    if (plan && Object.keys(plan).length && Number(planId)) {
      const autoMessage = `Hello,\n\nI am very interested in your "${capitalize(
        plan?.planName,
      )}" plan. I would like to proceed with this plan and would appreciate it if you could provide me with the next steps to get started.\n\nThanks!`;
      setValue("message", autoMessage);
    } else setValue("message", "");
  }, [plan, planId, setValue]);

  const { mutate, isPending, isSuccess, isError, data, error } =
    useSendMessage();

  const onSubmit = (formData) => {
    mutate({ planId, ...formData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Message sent successfully 🎉", {
        position: "top-right",
        autoClose: 4000,
        pauseOnHover: true,
        theme: "dark",
      });
      reset();
    }
    if (isError) {
      const errMsg = error?.response?.data?.message || "Something went wrong.";
      toast.error(errMsg, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [isSuccess, isError, data, error, reset]);

  if (isLoading) return <ContactSectionSkeleton />;

  // motion variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  const social = [
    { Icon: FaGithub, url: contact_info?.github || "#", label: "GitHub" },
    {
      Icon: FaLinkedinIn,
      url: contact_info?.linkedin || "#",
      label: "LinkedIn",
    },
    {
      Icon: FaFacebookF,
      url: contact_info?.facebook || "#",
      label: "Facebook",
    },
    {
      Icon: FaInstagram,
      url: contact_info?.instagram || "#",
      label: "Instagram",
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#050617] text-white overflow-hidden">
      <ToastContainer />

      {/* Background: layered radial gradients + subtle animated blobs */}
      <div className="pointer-events-none absolute inset-0  overflow-hidden">
        {/* LEFT BLOB */}
        <div
          className="
      absolute -left-28 -bottom-20 
      w-[48vw] aspect-square rounded-full 
      bg-[linear-gradient(135deg,#7B88FF40,#00D0F340,#00D49630)]
      blur-3xl transform-gpu animate-blob
    "
        />

        {/* RIGHT BLOB */}
        <div
          className="
      absolute -right-28 -top-24 
      w-[36vw] aspect-square rounded-full 
      bg-[linear-gradient(225deg,#00D0F330,#7B88FF30,#00D49625)]
      blur-3xl transform-gpu animate-blob animation-delay-2000
    "
        />

        {/* CENTER SOFT OVERLAY */}
        <div
          className="
      absolute inset-0 
      bg-[radial-gradient(ellipse_at_center,rgba(0,208,243,0.08),transparent_65%)]
      opacity-40
    "
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* LEFT - Info Column */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 bg-linear-to-br from-white/5 via-white/3 to-transparent backdrop-blur-md border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl"
          >
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-violet-300 to-cyan-300">
              Let's collaborate
            </h3>
            <p className="mt-4 text-gray-300 leading-relaxed">
              I’m excited to hear about your project — whether it’s an AI
              prototype, a portfolio refresh, or a full product build. Tell me
              about goals, timeline, and budget and I’ll reply with a clear next
              step.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/6">
                  <MdEmail className="text-xl text-theme-cyan" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href={`mailto:${contact_info?.email || "zainabro886@gmail.com"}`}
                    onMouseEnter={onCursorEnter}
                    onMouseLeave={onCursorLeave}
                    className="mt-1 block text-white font-medium hover:text-cyan-300"
                  >
                    {contact_info?.email || "zainabro886@gmail.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/6">
                  <MdPhone className="text-xl text-theme-cyan" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a
                    href={`tel:${contact_info?.contactPhone || "+923032150993"}`}
                    onMouseEnter={onCursorEnter}
                    onMouseLeave={onCursorLeave}
                    className="mt-1 block text-white font-medium hover:text-cyan-300"
                  >
                    {contact_info?.contactPhone || "+92 303 2150993"}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-sm text-gray-400">Follow</p>
                <div className="mt-3 flex items-center gap-3">
                  {social.map((s, idx) => (
                    <motion.a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      whileHover={{ scale: 1.12 }}
                      className="p-3 rounded-full bg-white/4 hover:bg-white/6 transition-transform"
                    >
                      <s.Icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              Tip: mention the timeline in your message for faster
              prioritization.
            </div>
          </motion.div>

          {/* RIGHT - Form Column */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
              noValidate
            >
              <div className="rounded-2xl p-1 bg-linear-to-br from-violet-600/30 via-pink-500/20 to-cyan-400/20 shadow-xl">
                <div className="bg-theme-dark rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-semibold">Send a message</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Use the form below — we’ll reply within 1-2 business days.
                    (If urgent, use the phone.)
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <label className="relative block">
                      <input
                        type="text"
                        placeholder="Full name"
                        className={`peer w-full rounded-md bg-gray-800 border border-white/6 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/30`}
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 3,
                            message: "At least 3 characters",
                          },
                        })}
                        aria-invalid={errors.fullName ? "true" : "false"}
                      />
                      {errors.fullName && (
                        <span className="mt-1 text-xs text-rose-400">
                          {errors.fullName.message}
                        </span>
                      )}
                    </label>

                    {/* Subject */}
                    <label className="relative block">
                      <input
                        type="text"
                        placeholder="Subject"
                        className={`peer w-full rounded-md bg-gray-800 border border-white/6 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/30`}
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        aria-invalid={errors.subject ? "true" : "false"}
                      />
                      {errors.subject && (
                        <span className="mt-1 text-xs text-rose-400">
                          {errors.subject.message}
                        </span>
                      )}
                    </label>

                    {/* Email */}
                    <label className="relative block md:col-span-1">
                      <input
                        type="email"
                        placeholder="Email"
                        className={`peer w-full rounded-md bg-gray-800 border border-white/6 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/30`}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email",
                          },
                        })}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      {errors.email && (
                        <span className="mt-1 text-xs text-rose-400">
                          {errors.email.message}
                        </span>
                      )}
                    </label>

                    {/* Message */}
                    <label className="relative block md:col-span-2">
                      <textarea
                        rows={6}
                        placeholder="Write your message..."
                        className={`w-full rounded-md bg-gray-800 border border-white/6 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/30 resize-none`}
                        {...register("message", {
                          required: "Message is required",
                          minLength: {
                            value: 10,
                            message: "At least 10 characters",
                          },
                        })}
                        aria-invalid={errors.message ? "true" : "false"}
                      />
                      {errors.message && (
                        <span className="mt-1 text-xs text-rose-400">
                          {errors.message.message}
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Plan preview */}
                  <div className="mt-4">
                    {Object.keys(plan || {}).length > 0 && (
                      <Plan
                        item={plan}
                        isInContact={
                          location?.pathname === `/contact/${planId}`
                        }
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-4 justify-between">
                    <div className="text-sm text-gray-400">
                      I'll usually respond within 24–48 hours.
                    </div>
                    <div className="text-center">
                      <button className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-indigo-500 to-cyan-400 px-6 py-3 font-medium shadow-lg hover:scale-105 transition-transform duration-300">
                        {isPending ? "Sending..." : "Send message"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>

      {/* Small animations CSS (tailwind utilities expected) */}
      <style>{`
        @keyframes blob { 0%{ transform: translateY(0) scale(1);} 33%{ transform: translateY(-12px) scale(1.05);} 66%{ transform: translateY(6px) scale(0.98);} 100%{ transform: translateY(0) scale(1);} }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .bg-theme-dark { background: linear-gradient(180deg, rgba(8,10,14,0.9) 0%, rgba(6,7,10,0.85) 100%); }
        .text-theme-cyan{ color: #7dd3fc }
      `}</style>
    </section>
  );
};

export default Contact;
