import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Code, Palette, TrendingUp, Zap } from "lucide-react";
import React, { useRef } from "react";
import { color, motion } from "motion/react";
import { useSelector } from "react-redux";
import useCreatedAtSorted from "@/hooks/useCreatedAtSorted";
import { safeParse } from "@/Utils/Utils";
import { Link } from "react-router-dom";

const colors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-emerald-500",
];
gsap.registerPlugin(ScrollTrigger, useGSAP);
const ServicesSection = () => {
  const servicesRef = useRef(null);
  const { services: sr } = useSelector((state) => state.service);
  const { sortedData: sortedServices } = useCreatedAtSorted(sr);
  const formattedServices = sortedServices?.map((item, idx) => {
    return { ...item, color: colors[idx % colors.length] };
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  useGSAP(
    () => {
      // Services Animation
      gsap.from(servicesRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: servicesRef },
  );

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description:
        "Building fast, responsive, and scalable web applications with modern technologies.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Creating intuitive and visually stunning user interfaces that delight users.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Motion Graphics",
      description:
        "Bringing designs to life with smooth animations and engaging interactions.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Brand Strategy",
      description:
        "Developing comprehensive brand identities that stand out in the market.",
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <section ref={servicesRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-4 border border-white/10">
            What I Do
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            My <span className="text-blue-500">Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            I offer a wide range of digital services to help businesses grow and
            succeed in the digital world.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formattedServices?.map((service, index) => {
            const ServiceImage = safeParse(service?.serviceImage);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8 }}
                whileTap={{ y: -2, scale: 0.99 }}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:border-cyan-400/40 hover:shadow-cyan-500/15  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                role="button"
                tabIndex={0}
                aria-label={`Learn more about ${service?.title}`}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0">
                  <img
                    src={`${backendUrl}${ServiceImage?.url}`}
                    alt={service?.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                  {/* Dynamic Hover Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${service?.color || "from-cyan-500/20"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-white drop-shadow-md">
                    {service?.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-gray-300/90 line-clamp-3">
                    {service?.description}
                  </p>

                  {/* CTA with Smooth Micro-interaction */}
                  <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm">
                    <Link
                      to={`/services/${service?.slug}`}
                      className="relative overflow-hidden"
                    >
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                        View Details
                      </span>
                      <span className="absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        Learn More
                      </span>
                    </Link>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>

                {/* Subtle Inner Border Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-cyan-400/30 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
