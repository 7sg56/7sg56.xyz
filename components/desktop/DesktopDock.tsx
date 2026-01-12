"use client";

import React from "react";
import { motion } from "motion/react";
import {
    AboutIcon,
    ProjectsIcon,
    SkillsIcon,
    ContactIcon,
    TetrisIcon,
    AlgorithmsIcon
} from "./DesktopIcons";
import { responsive, ResponsiveConfig } from "@/lib/responsive";
import { DockApp, WindowAppType } from "./types";

export const dockApps: DockApp[] = [
    { id: "about", name: "About", icon: "about", appType: "about" },
    { id: "projects", name: "Projects", icon: "projects", appType: "projects" },
    { id: "skills", name: "Skills", icon: "skills", appType: "skills" },
    { id: "contact", name: "Contact", icon: "contact", appType: "contact" },
    { id: "tetris", name: "Tetris", icon: "tetris", appType: "tetris" },
    { id: "algorithms", name: "Algorithms", icon: "algorithms", appType: "algorithms" },
];

interface DesktopDockProps {
    openWindows: Record<WindowAppType, boolean>;
    responsiveConfig: ResponsiveConfig;
    width: number;
    onAppClick: (app: DockApp, rect: DOMRect) => void;
}

const DesktopDock: React.FC<DesktopDockProps> = ({
    openWindows,
    responsiveConfig,
    width,
    onAppClick,
}) => {
    return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 max-w-[95vw] z-50">
            <div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-end shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-x-auto scrollbar-hide"
                style={{
                    padding: `${responsiveConfig.dockPadding}px`,
                    gap: `${responsiveConfig.dockGap}px`
                }}
            >
                {dockApps.map((app) => {
                    const isOpen = openWindows[app.appType as WindowAppType];
                    const hasIndicator = isOpen;
                    const dock = responsive.dock(responsiveConfig);
                    const showLabel = width >= 1024; // Show labels only on lg and up
                    return (
                        <motion.button
                            key={app.id}
                            className="flex flex-col items-center text-gray-100 relative flex-shrink-0"
                            style={{
                                minWidth: `${dock.buttonSize}px`,
                                height: `${dock.buttonSize}px`
                            }}
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                onAppClick(app, rect);
                            }}
                            whileHover={{
                                scale: 1.1,
                                y: -5,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            title={app.name}
                        >
                            <div
                                className={`glass-2 border border-theme rounded-xl flex items-center justify-center mb-1 hover:glass-1 transition-colors duration-200 shadow-md ${hasIndicator ? 'ring-2 ring-red-500/50' : ''}`}
                                style={{
                                    width: `${dock.iconSize}px`,
                                    height: `${dock.iconSize}px`
                                }}
                            >
                                {app.icon === "about" && <AboutIcon />}
                                {app.icon === "projects" && <ProjectsIcon />}
                                {app.icon === "skills" && <SkillsIcon />}
                                {app.icon === "contact" && <ContactIcon />}
                                {app.icon === "tetris" && <TetrisIcon />}
                                {app.icon === "algorithms" && <AlgorithmsIcon />}
                            </div>
                            {/* macOS-style indicator dot */}
                            {hasIndicator && (
                                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-red-500"></div>
                            )}
                            {showLabel && (
                                <span
                                    className="font-medium text-gray-200 whitespace-nowrap"
                                    style={{ fontSize: `${dock.fontSize}px` }}
                                >
                                    {app.name}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default DesktopDock;
