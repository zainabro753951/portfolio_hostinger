import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { useSelector } from 'react-redux'

const AllServices = () => {
  const { services } = useSelector(state => state.service)
  console.log(services)

  // const services = [
  //   {
  //     title: 'Web Development (Frontend + Backend)',
  //     desc: 'Building responsive, high-performance web applications using React, Next.js, Node.js, and Express for seamless frontend and backend integration. Ensuring fast loading, smooth UI, and scalable architecture tailored for every business need.',
  //   },
  //   {
  //     title: 'API Development & Integration',
  //     desc: 'Creating secure, efficient, and RESTful APIs using Express and Node.js for smooth data flow between frontend and backend. I specialize in integrating third-party APIs, payment gateways, and cloud services to enhance app functionality and user experience.',
  //   },
  //   {
  //     title: 'Database Design & Management',
  //     desc: 'Designing and managing scalable databases using MongoDB and Mongoose. Ensuring optimized queries, data security, and high performance for real-time applications with structured and well-maintained data architecture.',
  //   },
  //   {
  //     title: 'Authentication & Security',
  //     desc: 'Implementing secure user authentication and authorization using JWT, OAuth, and modern security best practices. I focus on building safe web apps with encrypted data transmission, role-based access, and protection from vulnerabilities.',
  //   },
  //   {
  //     title: 'Performance Optimization',
  //     desc: 'Optimizing web application speed and performance through code-splitting, caching, and efficient API calls. My approach ensures reduced load times, smooth interactions, and better Core Web Vitals for SEO and user satisfaction.',
  //   },
  //   {
  //     title: 'Deployment & Maintenance',
  //     desc: 'Deploying full-stack applications on modern cloud platforms like Vercel, Render, and MongoDB Atlas. I also handle continuous monitoring, updates, and maintenance to keep your web app secure, stable, and future-ready.',
  //   },
  // ]

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    show: i => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: i * 0.2,
      },
    }),
  }

  return (
    <div className="md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-dark w-full text-white font-inter overflow-hidden">
      <div className="w-full h-full grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 md:gap-[3vw] sm:gap-[4vw] xs:gap-[5vw] ">
        {services.map((item, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{
              y: -10,
              scale: 1.03,
              boxShadow: '0 0 15px #06b5d46c, 0 0 25px #06b5d463, 0 0 35px #06b5d442',
            }}
            transition={{ duration: 0.3 }}
            className={`relative md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] gradient-button w-full `}
          >
            <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
              <motion.div
                className="md:w-full md:h-[20vw] sm:h-[30vw] xs:h-[40vw]"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <img
                  src={item?.serviceImage?.url || '/imgs/elementor-placeholder-image.png'}
                  className="w-full h-full object-cover"
                  alt={item?.title || 'Default Image'}
                />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:text-[1.6vw] sm:text-[2.6vw] xs:text-[4.6vw] md:leading-[2.1vw] sm:leading-[3.1vw] xs:leading-[5.1vw] font-semibold font-fira-code text-theme-cyan"
              >
                {item.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-300 leading-relaxed"
              >
                {item.shortDesc}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AllServices
