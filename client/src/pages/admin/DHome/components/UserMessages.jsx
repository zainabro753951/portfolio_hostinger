import React from 'react'
import { motion } from 'motion/react'

const UserMessages = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }
  const messagesData = [
    {
      id: 1,
      name: 'Ali Khan',
      email: 'ali@example.com',
      message: 'Hello, I want to collaborate!',
      read: false,
    },
    {
      id: 2,
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      message: 'Can you review my project?',
      read: true,
    },
    {
      id: 3,
      name: 'Usman Ali',
      email: 'usman@example.com',
      message: 'Your portfolio looks amazing!',
      read: false,
    },
  ]

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 0 10px #06b5d46c,0 0 20px #06b5d463,0 0 30px #06b5d442',
      }}
      transition={{ duration: 0.3 }}
      className="md:w-full md:p-[2vw] sm:p-[3vw] xs:p-[4vw] md:rounded-[1vw] sm:rounded-[1.5vw] xs:rounded-[2vw]
                     bg-gradient-to-br from-[#0a0a2a]/60 to-[#101040]/30
                 border border-white/20 backdrop-blur-2xl overflow-y-auto custom-scrollbar max-h-[70vh]"
    >
      <h4 className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] font-semibold mb-[1vw] sm:mb-[2vw] xs:mb-[3vw]">
        User Messages
      </h4>
      <ul className="flex flex-col md:gap-[0.5vw] sm:gap-[1.5vw] xs:gap-[2.5vw]">
        {messagesData.map(msg => (
          <li
            key={msg.id}
            className={`flex justify-between items-start md:p-[1vw] sm:p-[2vw] xs:p-[3vw] rounded-md transition-all bg-cyan-500/10`}
          >
            <div>
              <p className="font-semibold text-white md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw]">
                {msg.name}
              </p>
              <p className="text-gray-300 md:text-[1.1vw] sm:text-[2.1vw] xs:text-[4.1vw] text-gray-300">
                {msg.email}
              </p>
              <p className="text-gray-400 md:text-[1vw] sm:text-[2vw] xs:text-[4vw] mt-1">
                {msg.message}
              </p>
            </div>
            <div>
              <a
                href={`mailto:${msg.email}`}
                className="md:py-[0.4vw] sm:py-[0.9vw] xs:py-[1.4vw] md:px-[0.7vw] sm:px-[1.2vw] xs:px-[1.7vw] bg-theme-purple hover:bg-purple-500/70 text-white md:rounded-[0.4vw] sm:rounded-[0.9vw] xs:rounded-[1.4vw] md:text-[1vw] sm:text-[2vw] xs:text-[4vw] text-center"
              >
                Reply
              </a>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default UserMessages
