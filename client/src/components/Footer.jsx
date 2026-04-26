import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Facebook,
} from "lucide-react";
import { useSelector } from "react-redux";
import useCreatedAtSorted from "@/hooks/useCreatedAtSorted";

const Footer = () => {
  const { contact_info, site_info } = useSelector(
    (state) => state.siteSettings,
  );
  const { services: sr } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);

  const servicesCategory = sortedServices.map((item) => item?.category);

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

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const servicesTitle = servicesCategory || [
    "Web Development",
    "UI/UX Design",
    "Motion Graphics",
    "Brand Strategy",
  ];

  return (
    <footer className="relative bg-dark-charcoal pt-20 pb-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-display font-bold">
                <span className="text-white">PORT</span>
                <span className="text-neon-cyan">FOLIO</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Crafting digital experiences that merge art with functionality.
              Let's build something amazing together.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-display font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-neon-cyan transition-colors text-sm underline-animation"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-display font-semibold text-lg mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {servicesTitle.map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-display font-semibold text-lg mb-6">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-neon-cyan mt-0.5" />
                <span className="text-gray-400 text-sm">
                  {contact_info?.email || "zainabro886@gmail.com"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-neon-cyan mt-0.5" />
                <span className="text-gray-400 text-sm">
                  {contact_info?.contactPhone || "03032150993"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-neon-cyan mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Tando Muhammad Khan
                  <br />
                  Sindh, Pakistan
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-500 text-sm text-center md:text-left">
            {site_info?.footerText || "Portfolio. All rights reserved."}
          </p>
          <div className="flex gap-6">
            <Link
              to="#"
              className="text-gray-500 hover:text-neon-cyan text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-gray-500 hover:text-neon-cyan text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
