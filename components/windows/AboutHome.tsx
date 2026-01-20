"use client";

import React, { useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { getAllExperience, getResume, getProfile } from "@/lib/data";
import { motion } from "motion/react";

export type OpenAppFn = (app: "about" | "projects" | "skills" | "contact") => void;

type View = "about" | "experience";

export default function AboutHome({ onOpen }: { onOpen: OpenAppFn }) {
  const [currentView, setCurrentView] = useState<View>("about");

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
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]">
          <h1 className="text-2xl font-bold text-white">About</h1>
          <div className="flex flex-row gap-2">
            <motion.button
              onClick={() => setCurrentView("experience")}
              className="rounded-lg border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-white px-3 py-1.5 transition-all duration-200 font-medium text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Experience
            </motion.button>

            <motion.button
              onClick={() => onOpen("projects")}
              className="rounded-lg border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-white px-3 py-1.5 transition-all duration-200 font-medium text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Projects
            </motion.button>

            <motion.button
              onClick={() => onOpen("skills")}
              className="rounded-lg border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-white px-3 py-1.5 transition-all duration-200 font-medium text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skills
            </motion.button>

            <motion.button
              onClick={() => onOpen("contact")}
              className="rounded-lg border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-white px-3 py-1.5 transition-all duration-200 font-medium text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Welcome Card */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 px-8 py-10 shadow-sm"
            >

              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Hey, I&apos;m Sourish!</h2>
                  <p className="text-xl text-gray-300 font-light">{profile.tagline}</p>
                </div>

                <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-2xl">
                  Thanks for taking the time to explore my website. I hope you enjoy it as much as I enjoyed developing it!
                </p>

                <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#0d0d0d] rounded-xl border border-red-500/10 hover:border-red-500/30 transition-colors group cursor-pointer">
                  <svg className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:sghosh.ile.7@gmail.com"
                    className="text-zinc-200 group-hover:text-white transition-colors font-medium"
                  >
                    sghosh.ile.7@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>



            {/* Resume Download Card */}
            <motion.div variants={itemVariants}>
              <motion.a
                href={resume.url}
                download={resume.filename}
                className="flex items-center justify-between relative overflow-hidden rounded-2xl border border-red-500/10 bg-zinc-900 p-6 group hover:border-red-500/30 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                      <svg className="w-7 h-7 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Download My Resume</h3>
                      <p className="text-sm text-gray-400">Get the full picture of my experience</p>
                    </div>
                  </div>
                  <div className="bg-zinc-800 rounded-full p-2 group-hover:bg-red-500/20 transition-colors">
                     <svg className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                  </div>
              </motion.a>
            </motion.div>

            {/* About Me Section */}
            <motion.div variants={itemVariants} className="rounded-xl border border-red-500/20 bg-zinc-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-red-500 rounded"></div>
                <h2 className="text-2xl font-bold text-white">My Journey</h2>
              </div>
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p className="text-base">
                  From a young age, I was captivated by computers and technology - particularly games.
                  What began as simple curiosity grew into a <span className="text-red-400 font-medium">true passion for programming and development</span>.
                </p>
                <p className="text-base">
                  I am currently pursuing my <span className="text-red-400 font-medium">B.Tech in Computer Science (Software Engineering)</span> at SRMIST, Chennai,
                  where I have built a strong groundwork in programming, data structures and web development.
                  Throughout my studies, I have developed a keen interest in <span className="text-red-400 font-medium">machine learning and Linux networking</span>,
                  which I pursued alongside my core technologies.
                </p>
                <p className="text-base">
                  I am currently working in <span className="text-red-400 font-medium">full-stack web development (MERN)</span> to develop my problem-solving skills
                  through DSA while diving into new technologies that require me to think differently.
                </p>
              </div>
            </motion.div>

            {/* Hobbies & Interests - Grid Layout Refined */}
            <motion.div variants={itemVariants} className="rounded-2xl border border-white/5 bg-zinc-900 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Beyond Code</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-red-500/20 transition-colors group">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center gap-2">
                     <span>🎮</span> Gaming
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Soulsborne fan, platinum trophy hunter</p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-red-500/20 transition-colors group">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center gap-2">
                     <span>♟️</span> Chess
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">1500 rating on Chess.com</p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-red-500/20 transition-colors group">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center gap-2">
                     <span>😺</span> Cat Lover
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Proud owner of feline friends</p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-red-500/20 transition-colors group">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center gap-2">
                     <span>🍳</span> Cooking
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">Experimenting in the kitchen</p>
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
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]">
          <h2 className="text-2xl font-bold text-white">Experience</h2>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={() => setCurrentView("about")}
          >
            ← Back to About
          </button>
        </div>

        <div className="p-6">
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
