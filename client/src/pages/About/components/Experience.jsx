import React from "react";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa6";
import { useSelector } from "react-redux";
import ExperienceTimelineSkeleton from "./ExperienceTimeLineSkeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 100, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const ExperienceTimeline = () => {
  const { experiences, isLoading } = useSelector((state) => state.experience);
  console.log(experiences);

  const exp = [
    {
      title: "Senior Developer, TechCorp",
      duration: "2022 - Present",
      desc: "Leading a team to develop a cloud-based SaaS platform leveraging React and AWS to deliver scalable solutions that enhanced client productivity by 40%.",
    },
    {
      title: "Full Stack Developer, Innovate Solutions",
      duration: "2018 - 2022",
      desc: "Built e-commerce platforms using Node.js and MongoDB, resulting in a 30% revenue increase for clients through optimized user experiences.",
    },
    {
      title: "Frontend Developer, Pixel Studio",
      duration: "2016 - 2018",
      desc: "Created responsive UI components with React and GSAP for motion-rich websites.",
    },
  ];

  const cardBackground = {
    background: `linear-gradient(135deg, rgba(0,209,243,0.08), rgba(6,12,18,0.55))`,
    border: `1px solid rgba(0,209,243,0.12)`,
    backdropFilter: `blur(6px)`,
  };

  if (isLoading) return <ExperienceTimelineSkeleton />;

  return (
    <div className="bg-[#050617]">
      <motion.div
        initial="hidden"
        whileInView="show"
        className="relative md:w-[80%] mx-auto md:py-[8vw] sm:py-[12vw] xs:py-[14vw] "
      >
        {/* Vertical timeline line */}
        <motion.div
          initial={{
            height: 0,
          }}
          whileInView={{
            height: "100%",
          }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: "easeOut",
          }}
          layout
          className="absolute left-1/2 top-0 bottom-0 md:w-[0.25vw]  bg-theme-cyan transform -translate-x-1/2 md:block xs:hidden"
        ></motion.div>

        <div className="flex flex-col xs:items-center md:items-start md:gap-[2vw] sm:gap-[3vw] xs:gap-[4vw]">
          {experiences?.map((item, idx) => {
            const startedAt = new Date(item?.startedAt).toLocaleDateString();
            const endDate = new Date(item?.endDate).toLocaleDateString();
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                style={cardBackground}
                className={`relative p-6 md:w-[45%] gradient-button group flex flex-col rounded-2xl shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-transform duration-300 transform hover:-translate-y-2 hover:scale-101 ${
                  idx % 2 === 0
                    ? "md:self-start md:ml-0 sm:ml-[10%]"
                    : "md:self-end md:mr-0 sm:mr-[10%]"
                }`}
              >
                {/* Dot on line */}
                <span
                  className={`absolute md:block xs:hidden top-[50%] w-5 h-5 bg-theme-cyan rounded-full transform -translate-y-1/2 ${
                    idx % 2 === 0
                      ? "md:right-[-4.71vw] ]"
                      : "md:left-[-4.71vw] "
                  }`}
                ></span>
                <div className="w-full h-full rounded-xl flex flex-col  gap-5">
                  <div>
                    <h2 className="md:text-3xl xs:text-2xl font-semibold font-fira-code text-theme-cyan">
                      {item?.position}
                    </h2>
                    <p className=" text-gray-400">
                      {startedAt} - {endDate}
                    </p>
                  </div>
                  <p className=" text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ExperienceTimeline;
