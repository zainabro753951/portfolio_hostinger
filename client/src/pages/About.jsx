import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Code, Coffee, Heart, Lightbulb } from 'lucide-react';
import { marked } from 'marked';
import { motion } from 'motion/react'; // ✅ Fixed: motion/react -> framer-motion
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import aboutImage from '../assets/images/about-portrait.jpg';
import MarkUpTextRender from '../sections/MarkUpTextRender';
import gardientPool from '../Utils/gardientPool.js';

gsap.registerPlugin(ScrollTrigger, useGSAP); // ✅ Fixed: removed duplicate useGSAP registration

const sortByEndDate = (exps) => {
  return [...exps].sort((a, b) => b.currentlyWorking - a.currentlyWorking);
};

const About = () => {
  const containerRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const { data: about } = useSelector((state) => state.about);
  const { testimonials } = useSelector((state) => state.testimonial);
  const { projectCounts } = useSelector((state) => state.projects);
  const { skills: skillsDB } = useSelector((state) => state.skills);
  const { experiences: exp } = useSelector((state) => state.experience);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const sortedByExpEndDate = sortByEndDate(exp);
  console.log(sortedByExpEndDate);

  // markdown configuration
  marked.setOptions({
    gfm: true, // GitHub flavored markdown (lists, tables, etc)
    breaks: true, // \n ko <br> banata hai
    headerIds: true, // headings ko id deta hai
    mangle: false, // emails ko encode nahi karta
  });

  // ✅ Single useGSAP with proper scope and cleanup
  useGSAP(
    () => {
      // About Section Timeline
      const aboutTL = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      aboutTL
        .from('.about-content', {
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from(
          '.about-image',
          {
            x: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        );

      // Skills Animation
      gsap.from('.skill-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    },
    { scope: containerRef } // ✅ Fixed: scope set to main container
  );

  const generateSkillsColor = (skillsArray) => {
    return skillsArray?.map((_, idx) => {
      return gardientPool[idx % gardientPool.length];
    });
  };

  const skillColors = generateSkillsColor(skillsDB);

  const skills = skillsDB.map((skill, idx) => {
    return {
      ...skill,
      color: skillColors[idx],
    };
  });

  const experiences = [
    {
      year: '2022 - Present',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      description: 'Leading frontend development team, building scalable web applications.',
    },
    {
      year: '2020 - 2022',
      title: 'Full Stack Developer MERN Stack',
      company: 'Digital Solutions Ltd.',
      description: 'Developed full-stack applications using React and Node.js.',
    },
    {
      year: '2018 - 2020',
      title: 'Junior Web Developer',
      company: 'Creative Agency',
      description: 'Started my journey in web development, learning modern technologies.',
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Always exploring new technologies and creative solutions.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Loving what I do and putting my heart into every project.',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Delivering high-quality work that exceeds expectations.',
    },
    {
      icon: Coffee,
      title: 'Dedication',
      description: 'Committed to meeting deadlines and achieving goals.',
    },
  ];

  return (
    <div ref={containerRef} className="bg-gray-900 min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-6 border border-white/10">
              About Me
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Get To Know <span className="text-blue-500">Me</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              I'm a passionate developer and designer dedicated to creating exceptional digital
              experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content Section */}
      <section ref={aboutRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="about-content">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Crafting Digital <span className="text-purple-500">Experiences</span>
              </h2>

              <MarkUpTextRender markedDesc={about?.longDesc}>
                <p>
                  Hello! I'm <strong>Zain Ul Abbas</strong>, a creative developer and designer with
                  over 1 year of experience in building modern web applications. I specialize in
                  creating beautiful, functional, and user-friendly digital experiences.
                </p>
                <p>
                  My journey in web development started with a curiosity for how things work on the
                  internet. That curiosity quickly turned into a passion, and I've been honing my
                  skills ever since.
                </p>
                <p>
                  I believe in the power of clean code, thoughtful design, and smooth animations to
                  create memorable user experiences. Every project I work on is an opportunity to
                  push boundaries and create something unique.
                </p>{' '}
              </MarkUpTextRender>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10">
                {[
                  { value: projectCounts?.publishedProjects, label: 'Projects' },
                  { value: testimonials?.length, label: 'Clients' },
                  { value: about?.experience, label: 'Years' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                  >
                    <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="about-image relative">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-3xl opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500" />

                {/* Image Container */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 w-full h-auto">
                  <img
                    src={about?.poseImage ? `${backendUrl}${about?.poseImage?.url}` : aboutImage}
                    alt={about?.poseImage ? about?.poseImage?.key : 'About Portrait'}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                      <Code size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">5+ Years</div>
                      <div className="text-gray-400 text-sm">Experience</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-blue-400 text-sm font-medium mb-4 border border-white/10">
              My Expertise
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Skills & <span className="text-blue-500">Technologies</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills?.map((skill, index) => (
              <div key={index} className="skill-item group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                    {skill.skillName}
                  </span>
                  <span className="text-cyan-400 font-semibold">{skill.proficiency}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} shadow-lg relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-400 text-sm font-medium mb-4 border border-white/10">
              My Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Work <span className="text-purple-500">Experience</span>
            </h2>
          </motion.div>

          <div className="timeline relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-400" />

            {sortedByExpEndDate.map((exp, index) => {
              const startYear = new Date(exp?.startedAt).getFullYear();
              const endDate = new Date(exp?.endDate).getFullYear();

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`timeline-item relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row ' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 border-4 border-gray-900 shadow-lg shadow-cyan-400/50" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-xl"
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm mb-3 font-medium">
                        {startYear} - {exp?.currentlyWorking === 1 ? 'Present' : endDate}
                      </span>
                      <h3 className="text-xl font-semibold text-white mb-1">{exp.position}</h3>
                      <p className="text-purple-400 mb-3 font-medium">{exp.company}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-cyan-400 text-sm font-medium mb-4 border border-white/10">
              What Drives Me
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              My <span className="text-cyan-400">Values</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:border-cyan-400/30  group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
