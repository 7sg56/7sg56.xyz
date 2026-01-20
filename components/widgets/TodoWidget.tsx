"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TASKS, type Task } from "@/lib/data";

type Span = { cols?: 1 | 2 | 3; rows?: 1 | 2 | 3 | 4 };
function spanToClasses(span?: Span): string {
  if (!span) return "";
  const cls: string[] = [];
  if (span.cols === 1) cls.push("col-span-1");
  if (span.cols === 2) cls.push("col-span-2");
  if (span.cols === 3) cls.push("col-span-3");
  if (span.rows === 1) cls.push("row-span-1");
  if (span.rows === 2) cls.push("row-span-2");
  if (span.rows === 3) cls.push("row-span-3");
  if (span.rows === 4) cls.push("row-span-4");
  return cls.join(" ");
}

const tasks = TASKS;

export default function TodoWidget({ span }: { span?: Span }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tasks.length);
    }, 10000); // 10 seconds = 10000 milliseconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-full w-full ${spanToClasses(span)}`}>
      <div className="h-full w-full p-4 flex flex-col">
        <div className="text-xs font-mono text-zinc-400 mb-3">Things I be doing</div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute text-lg font-bold font-mono text-zinc-200 text-center px-4"
                >
                  {tasks[currentIndex].title === "Romancing a Marlboro Red" ? (
                    <>
                      Romancing a Marlboro <span className="text-red-500">Red</span>
                    </>
                  ) : (
                    tasks[currentIndex].title
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}
