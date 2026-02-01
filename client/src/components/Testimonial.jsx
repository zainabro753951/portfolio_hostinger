import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Swiper modules
import {
  Pagination,
  Navigation,
  A11y,
  Autoplay,
  Keyboard,
} from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa6";
import { motion } from "motion/react";

// Dummy testimonials
const testimonials = [
  {
    message:
      "Working with this developer was an absolute pleasure. The UI/UX quality, performance, and attention to detail exceeded our expectations. Highly recommended!",
    clientName: "Ahmed Raza",
    designation: "Founder, TechNova",
    clientImage: { url: "https://randomuser.me/api/portraits/men/32.jpg" },
  },
  {
    message:
      "Modern design, smooth animations, and very professional communication. Our website looks premium and performs flawlessly across all devices.",
    clientName: "Sarah Khan",
    designation: "Product Manager, Softify",
    clientImage: { url: "https://randomuser.me/api/portraits/women/44.jpg" },
  },
  {
    message:
      "The best part was understanding our vision and converting it into a clean, elegant UI. Everything feels fast, intuitive, and visually impressive.",
    clientName: "Usman Ali",
    designation: "CEO, Creative Labs",
    clientImage: { url: "https://randomuser.me/api/portraits/men/75.jpg" },
  },
];

const Testimonial = () => {
  const accent = "#00D1F3"; // your cyan accent
  const primary = "#00d596";
  const alt = "#7a89ff";
  const swiperRef = useRef(null);

  return (
    <section
      aria-label="User testimonials"
      className="relative md:py-[6rem] sm:py-[4.5rem] py-[3.5rem] px-4 bg-[#050617] w-full text-white font-inter"
    >
      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-8">
          What our users say
        </h2>

        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          modules={[Pagination, Navigation, A11y, Autoplay, Keyboard]}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          spaceBetween={28}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          keyboard={{ enabled: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1.05 },
            1024: { slidesPerView: 1.18 },
            1280: { slidesPerView: 1.12 },
          }}
          className="w-full"
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={idx}>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: "0 18px 40px rgba(2,6,23,0.55)",
                }}
                transition={{ duration: 0.28 }}
                className="mx-4 md:mx-8"
              >
                {/* card */}
                <article
                  style={{
                    background: `linear-gradient(135deg, rgba(0,209,243,0.06), rgba(8,12,18,0.6))`,
                    border: `1px solid rgba(0,209,243,0.08)`,
                    backdropFilter: "blur(8px)",
                  }}
                  className="rounded-2xl p-6 md:p-8 border-[rgba(255,255,255,0.02)] shadow-[0_8px_40px_rgba(2,6,23,0.6)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* quote + message */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <span
                          className="p-3 rounded-lg shrink-0 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(180deg, ${accent}22, transparent)`,
                            border: `1px solid rgba(255,255,255,0.02)`,
                          }}
                        >
                          <FaQuoteRight className="w-5 h-5 text-white/90" />
                        </span>

                        <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                          “{item.message}”
                        </p>
                      </div>

                      {/* meta */}
                      <div className="mt-5 flex items-center gap-3">
                        <img
                          src={
                            item.clientImage?.url ||
                            "/images/avatar-fallback.png"
                          }
                          alt={item.clientName || "Client"}
                          loading="lazy"
                          decoding="async"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "/images/avatar-fallback.png")
                          }
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-[rgba(255,255,255,0.04)]"
                        />

                        <div>
                          <div className="text-white font-semibold">
                            {item.clientName}
                          </div>
                          <div className="text-gray-400 text-xs md:text-sm">
                            {item.designation}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* optional right column: rating or badges */}
                    <aside className="mt-4 md:mt-0 md:ml-6 w-full md:w-40 flex-shrink-0">
                      {/* example: rating or CTA */}
                      <div className="flex items-center justify-center md:flex-col md:items-end gap-3">
                        <div className="text-sm md:text-base text-gray-300">
                          Trusted
                        </div>
                        <div
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ background: primary, color: "#022" }}
                        >
                          Verified client
                        </div>
                      </div>
                    </aside>
                  </div>
                </article>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <button
            aria-label="Previous testimonial"
            className="swiper-button-prev-custom flex items-center justify-center text-white p-3 md:p-4 rounded-full transition-transform duration-300 ease-out focus-visible:outline-none"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${accent})`,
              boxShadow: "0 10px 30px rgba(0,209,243,0.28)",
              backdropFilter: "blur(6px)",
            }}
          >
            <FaChevronLeft className="text-[1rem] md:text-[1.2rem]" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <button
            aria-label="Next testimonial"
            className="swiper-button-next-custom flex items-center justify-center text-white p-3 md:p-4 rounded-full transition-transform duration-300 ease-out focus-visible:outline-none"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${alt})`,
              boxShadow: "0 10px 30px rgba(122,137,255,0.28)",
              backdropFilter: "blur(6px)",
            }}
          >
            <FaChevronRight className="text-[1rem] md:text-[1.2rem]" />
          </button>
        </div>

        {/* Pagination bullets */}
        <div className="custom-pagination flex justify-center gap-3 md:gap-4 mt-6"></div>

        {/* local styles for bullets + focus rings */}
        <style jsx global>{`
          .custom-bullet {
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 999px;
            transform-origin: center;
            transition:
              transform 0.28s ease,
              background 0.28s ease,
              box-shadow 0.28s ease,
              opacity 0.28s ease;
            opacity: 0.8;
          }

          .custom-bullet:hover {
            transform: scale(1.12);
            opacity: 1;
          }

          .custom-bullet-active {
            background: ${accent};
            transform: scale(1.35);
            box-shadow:
              0 10px 28px ${accent}33,
              0 6px 18px ${accent}40;
            opacity: 1;
          }

          .swiper-button-prev-custom:focus-visible,
          .swiper-button-next-custom:focus-visible {
            outline: none;
            box-shadow: 0 0 0 6px rgba(0, 209, 243, 0.12);
            transform: translateY(-1px) scale(1.02);
          }

          /* small responsive tweak for bullets on mobile */
          @media (max-width: 640px) {
            .custom-bullet {
              width: 9px;
              height: 9px;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Testimonial;
