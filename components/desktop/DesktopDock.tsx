"use client";

import React from "react";
import { motion } from "motion/react";
import {
    AboutIcon,
    ProjectsIcon,
    SkillsIcon,
    ContactIcon,
    TetrisIcon,
} from "./DesktopIcons";
import { responsive, ResponsiveConfig } from "@/lib/responsive";
import { DockApp, WindowAppType } from "./types";

export const dockApps: DockApp[] = [
    { id: "about", name: "About", icon: "about", appType: "about" },
    { id: "projects", name: "Projects", icon: "projects", appType: "projects" },
    { id: "skills", name: "Skills", icon: "skills", appType: "skills" },
    { id: "contact", name: "Contact", icon: "contact", appType: "contact" },
    { id: "tetris", name: "Tetris", icon: "tetris", appType: "tetris" },
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
    // Tooltip state tracking
    const [hoveredApp, setHoveredApp] = React.useState<string | null>(null);

    return (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 max-w-[95vw] z-50 flex flex-col items-center gap-3">
             {/* Floating Label (Tooltip) */}
             <div className="h-6 pointer-events-none">
                {hoveredApp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full shadow-lg"
                    >
                        {dockApps.find(app => app.id === hoveredApp)?.name}
                    </motion.div>
                )}
            </div>

            <div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] flex items-center shadow-2xl overflow-visible"
                style={{
                    paddingLeft: `${responsiveConfig.dockPadding}px`,
                    paddingRight: `${responsiveConfig.dockPadding}px`,
                    paddingTop: `${responsiveConfig.dockPadding * 0.8}px`,
                    paddingBottom: `${responsiveConfig.dockPadding * 0.8}px`,
                    gap: `${responsiveConfig.dockGap}px`
                }}
            >
                {dockApps.map((app) => {
                    const isOpen = openWindows[app.appType as WindowAppType];
                    const dock = responsive.dock(responsiveConfig);
                    
                    return (
                        <motion.button
                            key={app.id}
                            className="flex flex-col items-center relative group"
                            style={{
                                width: `${dock.buttonSize}px`,
                                height: `${dock.buttonSize}px`
                            }}
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                onAppClick(app, rect);
                            }}
                            onMouseEnter={() => setHoveredApp(app.id)}
                            onMouseLeave={() => setHoveredApp(null)}
                            whileHover={{
                                scale: 1.15,
                                y: -8,
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            whileTap={{ scale: 0.9, y: 0 }}
                            title={""} // Disable default browser tooltip
                        >
                            <div
                                className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-2xl relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                {/* Glossy shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-105">
                                    {app.icon === "about" && <AboutIcon />}
                                    {app.icon === "projects" && <ProjectsIcon />}
                                    {app.icon === "skills" && <SkillsIcon />}
                                    {app.icon === "contact" && <ContactIcon />}
                                    {app.icon === "tetris" && <TetrisIcon />}
                                </div>
                            </div>

                            {/* Active Indicator - macOS style */}
                            <div className="absolute -bottom-3 flex justify-center w-full">
                                <motion.div 
                                    initial={false}
                                    animate={{ 
                                        opacity: isOpen ? 1 : 0,
                                        scale: isOpen ? 1 : 0 
                                    }}
                                    className="w-1 h-1 bg-white/80 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default DesktopDock;
