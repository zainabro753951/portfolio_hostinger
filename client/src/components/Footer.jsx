import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

// Modern, responsive footer component
// - Uses TailwindCSS for styling
// - Reads optional `site_info` from redux (siteSettings)
// - Includes: brand, quick links, resources, contact, newsletter, social icons
// - Accessible and mobile-friendly

export default function ModernFooter() {
  const { site_info } = useSelector((state) => state.siteSettings || {});
  const footerText =
    site_info?.footerText ||
    `© ${new Date().getFullYear()} Zain Abro. All rights reserved.`;
  const logo = site_info?.logo || null;
  const social = site_info?.social || {}; // expected keys: facebook, twitter, linkedin, github, instagram
  const contact = site_info?.contact || {};

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'ok' | 'error'

  function handleSubscribe(e) {
    e.preventDefault();
    // lightweight front-end validation
    const isValid = /^\S+@\S+\.\S+$/.test(email);
    if (!isValid) {
      setStatus("error");
      return;
    }

    // This component is UI-only. Replace this block with your API call.
    setStatus("ok");
    setTimeout(() => setStatus(null), 3500);
    setEmail("");
  }

  const socialMap = [
    { key: "facebook", icon: FaFacebookF },
    { key: "twitter", icon: FaTwitter },
    { key: "linkedin", icon: FaLinkedinIn },
    { key: "github", icon: FaGithub },
    { key: "instagram", icon: FaInstagram },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-linear-to-br from-[#050617] via-[#07122a] to-[#061022] border-t border-theme-cyan/20 text-gray-300"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 grid-cols-1 gap-8 md:gap-12 items-start">
          {/* Brand / About */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-3">
              {logo ? (
                <img
                  src={logo}
                  alt={site_info?.siteName || "Logo"}
                  className="h-12 w-auto rounded-md object-contain shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-black font-bold">
                  Z
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {site_info?.siteName || "Zain Abro"}
                </h3>
                <p className="text-sm text-theme-cyan/60">
                  {site_info?.tagline || "Design · Build · Scale"}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              {site_info?.description ||
                "I build modern, performant web experiences. Follow along for engineering notes, case studies and practical UI tips."}
            </p>

            <div className="flex items-center gap-3">
              {socialMap.map(({ key, icon: Icon }) => {
                const url = social[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all border border-white/3"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <nav>
            <h4 className="text-sm font-semibold text-white mb-3">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white transition-colors" href="/about">
                  About
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/portfolio"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="/blog">
                  Blog
                </a>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white transition-colors" href="/docs">
                  Docs
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/privacy"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="/terms">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Get in touch
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FiMail />
                    <a
                      href={`mailto:${contact?.email || "hello@zainabro.example"}`}
                      className="hover:text-white"
                    >
                      {contact?.email || "hello@zainabro.example"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                    <FiPhone />
                    <a
                      href={`tel:${contact?.phone || "+92-300-0000000"}`}
                      className="hover:text-white"
                    >
                      {contact?.phone || "+92 300 0000000"}
                    </a>
                  </div>
                  {contact?.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-300 mt-2">
                      <FiMapPin className="mt-0.5" />
                      <span>{contact.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="w-full sm:w-[260px] bg-white/3 p-3 rounded-lg"
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Subscribe to newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  aria-required
                  className="flex-1 bg-transparent placeholder:text-gray-400 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-linear-to-br from-cyan-400 to-violet-500 text-black text-sm font-semibold hover:brightness-95"
                >
                  Join
                </button>
              </div>

              {status === "ok" && (
                <p className="mt-2 text-xs text-green-300">
                  Thanks — you’re on the list!
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-xs text-rose-300">
                  Enter a valid email.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-white/6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">{footerText}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="/terms" className="hover:text-white">
              Terms
            </a>
            <span className="hidden sm:inline">•</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
