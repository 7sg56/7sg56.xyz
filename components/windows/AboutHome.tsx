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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
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
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-8"
            >

              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Hey, I&apos;m Sourish!</h2>
                  <p className="text-lg text-gray-300">{profile.tagline}</p>
                </div>

                <p className="text-gray-200 leading-relaxed text-lg mb-4">
                  Thanks for taking the time to explore my portfolio. I hope you enjoy it as much as I enjoyed developing it!
                </p>

                <div className="flex items-center gap-2 p-4 bg-black/30 rounded-lg border border-red-500/20">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:sghosh.ile.7@gmail.com"
                    className="text-red-400 hover:text-red-300 transition-colors font-medium"
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
                className="block relative overflow-hidden rounded-xl border border-red-500/20 bg-black/40 p-6 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Download My Resume</h3>
                      <p className="text-sm text-gray-300">Get the full picture of my experience</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-red-400 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </motion.a>
            </motion.div>

            {/* About Me Section */}
            <motion.div variants={itemVariants} className="rounded-xl border border-red-500/20 bg-black/30 p-6">
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

            {/* Hobbies & Interests */}
            <motion.div variants={itemVariants} className="rounded-xl border border-red-500/20 bg-black/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-red-500 rounded"></div>
                <h2 className="text-2xl font-bold text-white">Beyond Code</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                  <h4 className="font-semibold text-white mb-1">Gaming</h4>
                  <p className="text-sm text-gray-300">Soulsborne fan, platinum trophy hunter</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                  <h4 className="font-semibold text-white mb-1">Chess</h4>
                  <p className="text-sm text-gray-300">1500 rating on Chess.com</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                  <h4 className="font-semibold text-white mb-1">Cat Lover</h4>
                  <p className="text-sm text-gray-300">Proud owner of feline friends</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                  <h4 className="font-semibold text-white mb-1">Cooking</h4>
                  <p className="text-sm text-gray-300">Experimenting in the kitchen</p>
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
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
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
