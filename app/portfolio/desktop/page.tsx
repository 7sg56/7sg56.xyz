"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import MenuBar from "@/components/desktop/MenuBar";
import DesktopBackground from "@/components/desktop/DesktopBackground";
import AppWindow from "@/components/windows/AppWindow";
import SkillsWindow from "@/components/windows/SkillsWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import AboutHome from "@/components/windows/AboutHome";
import TetrisGameWindow from "@/components/windows/TetrisGameWindow";
import AlgorithmWindow from "@/components/windows/AlgorithmWindow";
import TodoWidget from "@/components/widgets/TodoWidget";
import NowListeningWidget from "@/components/widgets/NowListeningWidget";
import DateNowWidget from "@/components/widgets/DateNowWidget";
import TechStackStrip from "@/components/TechStackStrip";
import { getResponsiveConfig, responsive } from "@/lib/responsive";
import AnimatedRoleText from "@/components/desktop/AnimatedRoleText";
import DesktopDock from "@/components/desktop/DesktopDock";
import { WindowAppType, WidgetType, DesktopItem, DockApp } from "@/components/desktop/types";

export default function DesktopOSPage() {

  // track which windows are open and a z-order stack for layering
  const [openWindows, setOpenWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    tetris: false,
    algorithms: false,
  });

  // Window dimensions - use consistent initial values to prevent hydration mismatch
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(900);
  const [windowStack, setWindowStack] = useState<WindowAppType[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<WindowAppType | null>(null);

  // Responsive configuration
  const responsiveConfig = useMemo(() => getResponsiveConfig(width, height), [width, height]);

  // Track fullscreen state per window
  const [fullscreenWindows, setFullscreenWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    tetris: false,
    algorithms: false,
  });

  // Track minimized state per window
  const [minimizedWindows, setMinimizedWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    tetris: false,
    algorithms: false,
  });

  // Update window dimensions after hydration to prevent hydration mismatch
  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);





  // Window helpers
  const bringToFront = useCallback((appType: WindowAppType) => {
    setWindowStack(prev => [...prev.filter(w => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const openWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows(prev => ({ ...prev, [appType]: true }));
    setWindowStack(prev => [...prev.filter(w => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const closeWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows(prev => ({ ...prev, [appType]: false }));
    setMinimizedWindows(prev => ({ ...prev, [appType]: false }));
    setWindowStack(prev => prev.filter(w => w !== appType));
    setFocusedWindow(prev => (prev === appType ? null : prev));
  }, []);

  const minimizeWindow = useCallback((appType: WindowAppType) => {
    setMinimizedWindows(prev => ({ ...prev, [appType]: true }));
    setFocusedWindow(prev => (prev === appType ? null : prev));
  }, []);

  const toggleFullscreen = useCallback((appType: WindowAppType) => {
    // Disable fullscreen for tetris game
    if (appType === 'tetris') return;
    setFullscreenWindows(prev => ({ ...prev, [appType]: !prev[appType] }));
    bringToFront(appType);
  }, [bringToFront]);

  // Dock app click
  const handleDockAppClick = useCallback((app: DockApp) => {
    const appType = app.appType as WindowAppType;
    if (app.appType in openWindows) {
      if (minimizedWindows[appType]) {
        // Restore minimized window
        setMinimizedWindows(prev => ({ ...prev, [appType]: false }));
        bringToFront(appType);
      } else {
        // Open or focus window
        openWindow(appType);
      }
    }
  }, [openWindow, openWindows, minimizedWindows, bringToFront]);

  const clearSelection = useCallback(() => { }, []);

  // Widget Layout - Using Responsive System
  const desktopItems: DesktopItem[] = useMemo(() => {
    // Base dimensions (unscaled)
    const baseTodoWidth = 310;
    const baseTodoHeight = 150;
    const baseSmallWidth = 150;
    const baseSmallHeight = 150;

    // Scale factor from config
    const scale = responsiveConfig.widgetScale;
    const margin = responsiveConfig.widgetMargin;

    // Computed scaled dimensions for layout positioning
    const scaledTodoWidth = baseTodoWidth * scale;
    const scaledTodoHeight = baseTodoHeight * scale;
    const scaledSmallWidth = baseSmallWidth * scale;
    const scaledSmallHeight = baseSmallHeight * scale;

    // Consistent top spacing for all screen sizes (same as 13" MacBook)
    const topSpacing = 46;

    return [
      {
        id: "todo-widget",
        name: "Things I Be Doing",
        icon: "",
        type: "widget",
        widgetType: "todo",
        // TOP-RIGHT CORNER - Consistent spacing
        x: width - scaledTodoWidth - margin,
        y: topSpacing,
        widthPx: baseTodoWidth, // Pass unscaled width
        heightPx: baseTodoHeight, // Pass unscaled height
        scale: scale, // Pass scale factor
      },
      {
        id: "now-listening-widget",
        name: "Now Listening",
        icon: "",
        type: "widget",
        widgetType: "now-listening",
        // BOTTOM-LEFT CORNER
        x: margin,
        y: height - (160 * scale),
        widthPx: baseSmallWidth,
        heightPx: baseSmallHeight,
        scale: scale,
      },
      {
        id: "date-now-widget",
        name: "Date Now",
        icon: "",
        type: "widget",
        widgetType: "date-now",
        // BOTTOM-RIGHT - Position below todo widget with consistent gap
        x: width - scaledSmallWidth - margin,
        y: topSpacing + scaledTodoHeight + 10,
        widthPx: baseSmallWidth,
        heightPx: baseSmallHeight,
        scale: scale,
      },
    ];
  }, [width, height, responsiveConfig]);

  // Widget renderer - direct widgets
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case "todo":
        return <TodoWidget />;
      case "now-listening":
        return <NowListeningWidget />;
      case "date-now":
        return <DateNowWidget />;
      default:
        return null;
    }
  };


  // Window descriptors to remove JSX duplication
  const WINDOW_CONFIG: Record<WindowAppType, { title: string; render: () => React.JSX.Element }> = {
    about: { title: "About", render: () => <AboutHome onOpen={(app) => openWindow(app as WindowAppType)} /> },
    projects: { title: "Projects", render: () => <ProjectsWindow /> },
    skills: { title: "Skills", render: () => <SkillsWindow /> },
    contact: { title: "Contact / Socials", render: () => <ContactWindow /> },
    tetris: { title: "Tetris Game", render: () => <TetrisGameWindow /> },
    algorithms: { title: "Algorithms", render: () => <AlgorithmWindow /> },
  } as const;

  const zBase = 100; // base z-index for windows

  return (
    <div>
      {/* Mobile message (SSR-safe, CSS-hidden on md and up) */}
      <div className="lg:hidden flex items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <div className="space-y-3 max-w-md">
          <div className="text-2xl font-semibold">Not supported on Small Screens</div>
          <div className="text-zinc-300">Please use a desktop device</div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-200"
            >
              ← Go to Boot Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Actual desktop UI hidden on small screens */}
      <div
        className="hidden lg:block relative w-full h-screen bg-black overflow-hidden select-none"
        role="application"
        aria-label="Desktop environment"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            clearSelection();
            setFocusedWindow(null);
          }
        }}
      >
        {/* Desktop Background */}
        <DesktopBackground backgroundImage="/bg3.png" overlay={false} />

        {/* Menu Bar */}
        <MenuBar title={focusedWindow ? WINDOW_CONFIG[focusedWindow]?.title : "Desktop"} showSystemMenu={true} terminalHref="/portfolio/terminal" shutdownHref="/" />

        {/* Hero Text - Using Responsive System */}
        <div
          className="absolute z-10"
          style={{
            left: `${responsiveConfig.heroLeft}px`,
            top: `${responsiveConfig.heroTop - 40}px`
          }}
        >
          <div className="space-y-2">
            <div className="text-white space-y-4 lg:space-y-6">
              {/* Main Name - Responsive Size */}
              <h1
                className="font-black uppercase tracking-tight"
                style={{
                  fontSize: responsiveConfig.heroNameSize,
                  lineHeight: '0.9'
                }}
              >
                <span className="text-red-500">S</span>ourish <span className="text-red-500">G</span>HOSH
              </h1>

              {/* Tagline - Responsive */}
              <div
                className="font-light leading-relaxed"
                style={{
                  fontSize: responsiveConfig.heroTaglineSize
                }}
              >
                <span className="text-gray-300">I build </span>
                <span className="text-gray-200 mx-2">digital experiences </span>
                <span className="text-gray-300">with</span>
                <br />
                <span className="text-gray-400">passion, precision and</span>
                <AnimatedRoleText />
              </div>
            </div>
          </div>
        </div>

        {/* TechStackStrip - Using Responsive System */}
        <div
          className="absolute z-0 origin-center"
          style={{
            bottom: `${responsiveConfig.techStripBottom}px`,
            right: `${responsiveConfig.techStripRight}px`,
            transform: 'rotate(-35deg)',
            width: `${responsiveConfig.techStripWidth}px`
          }}
        >
          <TechStackStrip
            items={[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "Express.js",
              "Vercel",
              "Supabase",
              "PostgreSQL",
              "Framer Motion",
              "JWT",
              "Redis"
            ]}
            duration={25}
            pauseOnHover={false}
            className="bg-black/30 backdrop-blur-sm text-white min-h-[50px] flex items-center"
          />
        </div>

        {/* Desktop Widgets */}
        {desktopItems.map((item) => {
          if (item.type !== "widget" || !item.widgetType) return null;
          return (
            <motion.div
              key={item.id}
              className="absolute pointer-events-auto border border-gray-700/50 rounded-xl bg-black/20 backdrop-blur-sm"
              style={{
                left: item.x,
                top: item.y,
                width: item.widthPx,
                height: item.heightPx,
                transformOrigin: "top left",
                scale: item.scale || 1
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: item.scale || 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {renderWidget(item.widgetType)}
            </motion.div>
          );
        })}


        {/* Custom Dock - Using Responsive System */}
        <DesktopDock
          openWindows={openWindows}
          responsiveConfig={responsiveConfig}
          width={width}
          onAppClick={handleDockAppClick}
        />

        {/* Windows */}
        <AnimatePresence>
          {(Object.keys(WINDOW_CONFIG) as WindowAppType[]).map((appType) => {
            if (!openWindows[appType]) return null;
            const orderIndex = Math.max(0, windowStack.indexOf(appType));
            const { title, render } = WINDOW_CONFIG[appType];
            const isMinimized = minimizedWindows[appType];
            return (
              <AppWindow
                key={appType}
                title={title}
                onClose={() => closeWindow(appType)}
                onMinimize={() => minimizeWindow(appType)}
                onToggleFullscreen={appType === 'tetris' ? undefined : () => toggleFullscreen(appType)}
                fullscreen={fullscreenWindows[appType]}
                minimized={isMinimized}
                zIndex={zBase + orderIndex}
                customSize={appType === 'tetris' ? { width: 300, height: 600 } : undefined}
              >
                {render()}
              </AppWindow>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
