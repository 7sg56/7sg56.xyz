"use client";

import React, { useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { getAllExperience, getResume, getProfile } from "@/lib/data";
import { motion } from "motion/react";

export type OpenAppFn = (app: "about" | "projects" | "skills" | "contact") => void;

type View = "about" | "experience";

export default function AboutHome({ onOpen }: { onOpen: OpenAppFn }) {
  const [currentView, setCurrentView] = useState<View>("about");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bevan:ital@0;1&family=Rammetto+One&family=Roboto+Slab:wght@400..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const renderAbout = () => {
    const resume = getResume();
    const profile = getProfile();

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05 // Faster stagger
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 }, // Reduced y distance for subtler pop-in
      visible: { opacity: 1, y: 0 }
    };

    return (
      <div className="flex flex-col relative z-50 pb-6">
        {/* Header with CTA buttons */}
        <div className={`sticky top-0 z-50 flex ${isMobile ? 'flex-col gap-3 items-start' : 'flex-row items-center justify-between'} px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md`}>
          <h1 className="text-2xl font-bold text-white">About</h1>
          <div className={`flex flex-row ${isMobile ? 'overflow-x-auto w-full pb-1 scrollbar-hide' : 'gap-2'}`}>
            <motion.button
              onClick={() => setCurrentView("experience")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Experience
            </motion.button>

            <motion.button
              onClick={() => onOpen("projects")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Projects
            </motion.button>

            <motion.button
              onClick={() => onOpen("skills")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skills
            </motion.button>

            <motion.button
              onClick={() => onOpen("contact")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className={isMobile ? "p-4" : "p-6"}>
          <motion.div
            className="max-w-4xl mx-auto space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Welcome */}
            <motion.div
              variants={itemVariants}
              className={isMobile ? "pl-0" : "pl-2"}
            >
                <div className="mb-6">
                  <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black text-white mb-4 tracking-tight`}>Hey, I&apos;m Sourish!</h2>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} text-zinc-400 font-light max-w-2xl`}>{profile.tagline}</p>
                </div>

                <p className="text-zinc-400 leading-relaxed text-lg mb-8 max-w-2xl">
                  Thanks for taking the time to explore my website. I hope you enjoy it as much as I enjoyed developing it!
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mt-8 border-t border-white/5 pt-8">
                    <motion.a
                        href={resume.url}
                        download={resume.filename}
                        className="group relative inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download CV
                        </span>
                    </motion.a>

                    <a
                      href="mailto:sghosh.ile.7@gmail.com"
                      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors self-center font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      sghosh.ile.7@gmail.com
                    </a>
                </div>
            </motion.div>

            {/* About Me Section */}
            <motion.div variants={itemVariants} className={isMobile ? "ml-0" : "pl-2 border-l-2 border-white/10 ml-1"}>
              <div className={isMobile ? "pl-0 space-y-4" : "pl-6 space-y-4"}>
                  <h2 className="text-2xl font-bold text-white mb-4">My Journey</h2>
                  <div className="space-y-4 text-zinc-400 leading-relaxed max-w-3xl">
                    <p>
                        From a young age, I was captivated by computers and technology - particularly games.
                        What began as simple curiosity grew into a <span className="text-zinc-200 font-medium">true passion for programming and development</span>.
                    </p>
                    <p>
                        I am currently pursuing my <span className="text-zinc-200 font-medium">B.Tech in Computer Science (Software Engineering)</span> at SRMIST, Chennai,
                        where I have built a strong groundwork in programming, data structures and web development.
                        Throughout my studies, I have developed a keen interest in <span className="text-zinc-200 font-medium">machine learning and Linux networking</span>,
                        which I pursued alongside my core technologies.
                    </p>
                    <p>
                        I am currently working in <span className="text-zinc-200 font-medium">full-stack web development (MERN)</span> to develop my problem-solving skills
                        through DSA while diving into new technologies that require me to think differently.
                    </p>
                  </div>
              </div>
            </motion.div>

            {/* Hobbies & Interests */}
            <motion.div variants={itemVariants} className={isMobile ? "pl-0" : "pl-2"}>
              <h2 className="text-2xl font-bold text-white mb-6">Beyond Code</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl">
                <div className="group">
                  <h4 className="font-medium text-zinc-200 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                     <span>🎮</span> Gaming
                  </h4>
                  <p className="text-sm text-zinc-500">Soulsborne fan, platinum trophy hunter</p>
                </div>
                <div className="group">
                  <h4 className="font-medium text-zinc-200 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                     <span>♟️</span> Chess
                  </h4>
                  <p className="text-sm text-zinc-500">1500 rating on Chess.com</p>
                </div>
                <div className="group">
                  <h4 className="font-medium text-zinc-200 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                     <span>😺</span> Cat Lover
                  </h4>
                  <p className="text-sm text-zinc-500">Proud owner of feline friends</p>
                </div>
                <div className="group">
                  <h4 className="font-medium text-zinc-200 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                     <span>🍳</span> Cooking
                  </h4>
                  <p className="text-sm text-zinc-500">Experimenting in the kitchen</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    );
  };


  const renderExperience = () => {
    const experience = getAllExperience();

    return (
      <div className="flex flex-col relative z-50 pb-6">
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Experience</h2>
          <button
            className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setCurrentView("about")}
          >
            ← Back
          </button>
        </div>

        <div className={isMobile ? "p-4" : "p-6"}>
          <div className="max-w-4xl mx-auto space-y-4">
            {experience.map((exp, index) => (
              <ExperienceCard
                key={index}
                title={exp.title}
                company={exp.company}
                duration={exp.period}
                description={exp.description}
                isCurrent={exp.period.includes("Present")}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {currentView === "about" && renderAbout()}
      {currentView === "experience" && renderExperience()}
    </div>
  );
}
