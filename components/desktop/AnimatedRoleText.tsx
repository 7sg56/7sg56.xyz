"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";

const AnimatedRoleText = () => {
    const [currentRole, setCurrentRole] = useState("innovation");
    const [isAnimating, setIsAnimating] = useState(false);

    const roles = useMemo(() => ["innovation", "creativity", "excellence", "vision"], []);
    const randomChars = "abcdefghijklmnopqrstuvwxyz";

    useEffect(() => {
        let currentIndex = 0;

        const cycleRoles = () => {
            // Show current role for 2.5 seconds
            setTimeout(() => {
                // Glitch/randomizer animation
                setIsAnimating(true);
                let glitchCount = 0;

                const glitchInterval = setInterval(() => {
                    if (glitchCount < 40) {
                        const randomText = Array.from({ length: roles[currentIndex].length }, () =>
                            randomChars[Math.floor(Math.random() * randomChars.length)]
                        ).join('');
                        setCurrentRole(randomText);
                        glitchCount++;
                    } else {
                        clearInterval(glitchInterval);
                        // Move to next role
                        currentIndex = (currentIndex + 1) % roles.length;
                        setCurrentRole(roles[currentIndex]);
                        setIsAnimating(false);
                        // Continue cycling
                        setTimeout(cycleRoles, 2500);
                    }
                }, 20);
            }, 2500);
        };

        cycleRoles();
    }, [roles]);

    return (
        <motion.span
            className="text-accent font-medium ml-2"
            animate={{
                y: isAnimating ? [0, -1, 0] : 0,
                scale: isAnimating ? [1, 1.02, 1] : 1
            }}
            transition={{
                duration: 0.1,
                ease: "easeInOut"
            }}
        >
            {currentRole}
        </motion.span>
    );
};

export default AnimatedRoleText;
