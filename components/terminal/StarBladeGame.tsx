"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

type GameState = "playing" | "gameover";
type EnemyType = "normal" | "yellow" | "purple" | "blue";

type Enemy = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: EnemyType;
};

export default function StarBladeGame({ onExit }: { onExit?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [mounted, setMounted] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const shootingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExit = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    onExit?.();
  }, [onExit]);

  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let width = 0, height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Star = { x: number; y: number; s: number; a: number; };
    type Ship = { x: number; y: number; vx: number; vy: number; };
    type Laser = { x: number; y: number; vx: number; vy: number; spawnX: number; maxDistance: number; };

    const stars: Star[] = [];
    const player: Ship = { x: 80, y: height / 2, vx: 0, vy: 0 };
    const enemies: Enemy[] = [];
    const lasers: Laser[] = [];
    let currentScore = 0;
    let currentLives = 5;
    let currentGameState: GameState = "playing";
    let invulnerable = false;
    let invulnerableUntil = 0;
    
    // Power-ups with limits
    let fireRateBoost = 0; // Number of fire rate boosts (yellow enemies killed) - MAX 5
    let blasterCount = 1; // Number of blasters (purple enemies killed) - MAX 4
    const MAX_FIRE_RATE_BOOST = 5;
    const MAX_BLASTERS = 4;
    
    // Power mode (blue enemy)
    let powerModeActive = false;
    let powerModeUntil = 0;
    const POWER_MODE_DURATION = 15000; // 15 seconds

    for (let i = 0; i < 150; i++) {
      stars.push({ 
        x: Math.random() * width, 
        y: Math.random() * height, 
        s: Math.random() * 1.5 + 0.4, 
        a: Math.random() * 0.6 + 0.3 
      });
    }

    let lastSpawn = 0;
    let t0 = performance.now();
    let nextShotAt = 0;
    
    // Bullet distance - randomized per bullet between 40-70% of screen width
    const getRandomBulletDistance = () => {
      const minPercent = 0.4;
      const maxPercent = 0.7;
      return width * (minPercent + Math.random() * (maxPercent - minPercent));
    };

    // SVG-style spaceship drawing function (normal size)
    const drawSpaceship = (x: number, y: number, flashing = false) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Main body (fuselage)
      ctx.fillStyle = flashing ? "#ffffff" : "#4ade80"; // green or white when flashing
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-15, -8);
      ctx.lineTo(-15, 8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit window
      ctx.fillStyle = "#60a5fa"; // blue
      ctx.beginPath();
      ctx.arc(5, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings
      ctx.fillStyle = flashing ? "#e0e0e0" : "#22c55e"; // darker green or light gray when flashing
      ctx.beginPath();
      ctx.moveTo(-5, -8);
      ctx.lineTo(-8, -15);
      ctx.lineTo(-12, -12);
      ctx.lineTo(-10, -8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-5, 8);
      ctx.lineTo(-8, 15);
      ctx.lineTo(-12, 12);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      
      // Engine glow
      ctx.fillStyle = "#fbbf24"; // yellow
      ctx.beginPath();
      ctx.arc(-15, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // SVG-style enemy ship drawing function with type colors
    const drawEnemy = (x: number, y: number, type: EnemyType) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Color based on type
      let bodyColor = "#ef4444"; // red (normal)
      let cockpitColor = "#7c3aed"; // purple
      let wingColor = "#dc2626"; // darker red
      
      if (type === "yellow") {
        bodyColor = "#eab308"; // yellow
        cockpitColor = "#f59e0b"; // orange
        wingColor = "#ca8a04"; // darker yellow
      } else if (type === "purple") {
        bodyColor = "#a855f7"; // purple
        cockpitColor = "#ec4899"; // pink
        wingColor = "#9333ea"; // darker purple
      } else if (type === "blue") {
        bodyColor = "#3b82f6"; // blue
        cockpitColor = "#06b6d4"; // cyan
        wingColor = "#2563eb"; // darker blue
      }
      
      // Main body (pointing left)
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(8, -7);
      ctx.lineTo(12, -7);
      ctx.lineTo(12, 7);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit
      ctx.fillStyle = cockpitColor;
      ctx.beginPath();
      ctx.arc(-3, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings
      ctx.fillStyle = wingColor;
      ctx.beginPath();
      ctx.moveTo(3, -7);
      ctx.lineTo(6, -13);
      ctx.lineTo(10, -10);
      ctx.lineTo(8, -7);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(3, 7);
      ctx.lineTo(6, 13);
      ctx.lineTo(10, 10);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Prevent ALL default behaviors during game
      e.preventDefault();
      e.stopPropagation();
      
      // Q to exit
      if (key === "q") {
        handleExit();
        return;
      }

      // R to restart when game over
      if (key === "r" && currentGameState === "gameover") {
        currentGameState = "playing";
        currentScore = 0;
        currentLives = 5;
        fireRateBoost = 0;
        blasterCount = 1;
        powerModeActive = false;
        powerModeUntil = 0;
        setGameState("playing");
        setScore(0);
        setLives(5);
        player.x = 80;
        player.y = height / 2;
        enemies.length = 0;
        lasers.length = 0;
        invulnerable = false;
        return;
      }

      // Track shooting state
      if (key === "enter" || key === "d") {
        shootingRef.current = true;
      }

      keysRef.current.add(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const key = e.key.toLowerCase();
      
      if (key === "enter" || key === "d") {
        shootingRef.current = false;
      }
      
      keysRef.current.delete(key);
    };

    // Capture events at the window level with high priority
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    const draw = (now: number) => {
      const dt = Math.min(32, now - t0);
      t0 = now;

      // Background
      ctx.fillStyle = "rgba(0, 0, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Starfield
      for (const st of stars) {
        st.x -= st.s * 1.2;
        if (st.x < 0) { st.x = width; st.y = Math.random() * height; }
        ctx.globalAlpha = st.a;
        ctx.fillStyle = "#a3d9ff";
        ctx.fillRect(st.x, st.y, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;

      if (currentGameState === "playing") {
        // Player movement (only vertical)
        const speed = 4.5;
        const keys = keysRef.current;
        
        if (keys.has("arrowup") || keys.has("w")) player.y -= speed;
        if (keys.has("arrowdown") || keys.has("s")) player.y += speed;

        // Constrain player
        const margin = 20;
        player.y = Math.max(margin, Math.min(height - margin, player.y));
        
        // Check power mode timer
        if (powerModeActive && now > powerModeUntil) {
          powerModeActive = false;
        }

        // Shooting with fire rate boost (capped at MAX_FIRE_RATE_BOOST)
        // In power mode: use max fire rate
        const baseFireRate = 150;
        const effectiveFireRateBoost = powerModeActive ? MAX_FIRE_RATE_BOOST : Math.min(fireRateBoost, MAX_FIRE_RATE_BOOST);
        const fireRate = Math.max(50, baseFireRate - (effectiveFireRateBoost * 20));
        
        // In power mode: use max blasters
        const effectiveBlasterCount = powerModeActive ? MAX_BLASTERS : blasterCount;
        
        if (shootingRef.current && now >= nextShotAt) {
          // Calculate blaster positions based on count
          const blasterOffsets: number[] = [];
          
          if (effectiveBlasterCount === 1) {
            blasterOffsets.push(0); // Center
          } else if (effectiveBlasterCount === 2) {
            blasterOffsets.push(-6, 6); // Top and bottom
          } else if (effectiveBlasterCount === 3) {
            blasterOffsets.push(-8, 0, 8); // Top, center, bottom
          } else if (effectiveBlasterCount >= 4) {
            blasterOffsets.push(-10, -3, 3, 10); // Four blasters
          }
          
          // Fire from each blaster position
          for (const offset of blasterOffsets) {
            lasers.push({ 
              x: player.x + 15, 
              y: player.y + offset, 
              vx: 8, 
              vy: 0,
              spawnX: player.x + 15,
              maxDistance: powerModeActive ? width * 0.9 : getRandomBulletDistance()
            });
          }
          
          nextShotAt = now + fireRate;
        }

        // Spawn enemies with rare special types
        if (now - lastSpawn > 700) {
          const rand = Math.random();
          let enemyType: EnemyType = "normal";
          
          // 5% chance for yellow (fire rate boost)
          if (rand < 0.05) {
            enemyType = "yellow";
          }
          // 3% chance for purple (dual blasters)
          else if (rand < 0.08) {
            enemyType = "purple";
          }
          // 2% chance for blue (power mode)
          else if (rand < 0.02) {
            enemyType = "blue";
          }
          
          enemies.push({ 
            x: width + 20, 
            y: Math.random() * (height - 40) + 20, 
            vx: -(2 + Math.random() * 1.5), 
            vy: (Math.random() - 0.5) * 1.2,
            type: enemyType
          });
          lastSpawn = now;
        }

        // Update lasers with distance limit
        for (let i = lasers.length - 1; i >= 0; i--) {
          const L = lasers[i];
          L.x += L.vx;
          
          // Remove if out of bounds or exceeded max distance (per bullet)
          const distanceTraveled = L.x - L.spawnX;
          if (L.x > width + 30 || distanceTraveled > L.maxDistance) {
            lasers.splice(i, 1);
          }
        }

        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const E = enemies[i];
          E.x += E.vx;
          E.y += E.vy;
          
          // Bounce enemies off top/bottom
          if (E.y < 20 || E.y > height - 20) {
            E.vy *= -1;
          }
          
          if (E.x < -40) enemies.splice(i, 1);
        }

        // Collisions - laser hits enemy
        for (let i = enemies.length - 1; i >= 0; i--) {
          const E = enemies[i];
          for (let j = lasers.length - 1; j >= 0; j--) {
            const L = lasers[j];
            if (Math.abs(L.x - E.x) < 18 && Math.abs(L.y - E.y) < 15) {
              const enemyType = E.type;
              enemies.splice(i, 1);
              lasers.splice(j, 1);
              currentScore += enemyType === "normal" ? 10 : 25;
              setScore(currentScore);
              
              // Apply power-ups with limits
              if (enemyType === "yellow" && fireRateBoost < MAX_FIRE_RATE_BOOST) {
                fireRateBoost++;
              } else if (enemyType === "purple" && blasterCount < MAX_BLASTERS) {
                blasterCount++;
              } else if (enemyType === "blue") {
                // Activate power mode for 15 seconds
                powerModeActive = true;
                powerModeUntil = now + POWER_MODE_DURATION;
              }
              
              break;
            }
          }
        }

        // Check invulnerability timer
        if (invulnerable && now > invulnerableUntil) {
          invulnerable = false;
        }

        // Collisions - enemy hits player (LOSE 1 LIFE)
        if (!invulnerable) {
          for (let i = enemies.length - 1; i >= 0; i--) {
            const E = enemies[i];
            if (Math.abs(player.x - E.x) < 20 && Math.abs(player.y - E.y) < 18) {
              enemies.splice(i, 1);
              currentLives--;
              setLives(currentLives);
              invulnerable = true;
              invulnerableUntil = now + 2000; // 2 seconds invulnerability
              
              if (currentLives <= 0) {
                currentGameState = "gameover";
                setGameState("gameover");
              }
              break;
            }
          }
        }
      }

      // Draw player (with invulnerability flashing)
      if (currentGameState !== "gameover") {
        const isFlashing = invulnerable && Math.floor(now / 100) % 2 === 0;
        drawSpaceship(player.x, player.y, isFlashing);
      }

      // Draw enemies
      for (const E of enemies) {
        drawEnemy(E.x, E.y, E.type);
      }

      // Draw lasers (glowing projectiles)
      ctx.save();
      for (const L of lasers) {
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#4ade80";
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.arc(L.x, L.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#86efac";
        ctx.beginPath();
        ctx.arc(L.x, L.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw UI overlay
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`SCORE: ${currentScore}`, 15, 30);
      
      // Draw lives as hearts
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 20px monospace";
      const hearts = "♥".repeat(currentLives) + "♡".repeat(Math.max(0, 5 - currentLives));
      ctx.fillText(`LIVES: ${hearts}`, 15, 55);
      
      // Power-up indicators
      ctx.font = "12px monospace";
      let powerUpY = 80;
      
      // Power mode indicator (most important, show first)
      if (powerModeActive) {
        const timeLeft = Math.ceil((powerModeUntil - now) / 1000);
        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 14px monospace";
        ctx.fillText(`🔥 POWER MODE: ${timeLeft}s`, 15, powerUpY);
        powerUpY += 22;
        ctx.font = "12px monospace";
      }
      
      if (fireRateBoost > 0) {
        ctx.fillStyle = "#eab308";
        const boostText = fireRateBoost >= MAX_FIRE_RATE_BOOST ? "MAX" : `+${fireRateBoost}`;
        ctx.fillText(`⚡ Fire Rate: ${boostText}`, 15, powerUpY);
        powerUpY += 20;
      }
      
      if (blasterCount > 1) {
        ctx.fillStyle = "#a855f7";
        const blasterText = blasterCount >= MAX_BLASTERS ? "MAX" : `x${blasterCount}`;
        ctx.fillText(`⚔ Blasters: ${blasterText}`, 15, powerUpY);
        powerUpY += 20;
      }
      
      // Controls hint
      ctx.font = "12px monospace";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("W/S: Move | Enter/D: Shoot | Q: Quit | R: Restart", 15, height - 15);
      
      // Invulnerability indicator
      if (invulnerable) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 14px monospace";
        ctx.fillText("INVULNERABLE!", 15, powerUpY);
      }
      
      if (currentGameState === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 48px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 30);
        
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 24px monospace";
        ctx.fillText(`FINAL SCORE: ${currentScore}`, width / 2, height / 2 + 20);
        
        ctx.font = "16px monospace";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("Press R to restart or Q to quit", width / 2, height / 2 + 60);
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("resize", resize);
    };
  }, [handleExit, mounted]);

  if (!mounted) return null;

  const gameContent = (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );

  return createPortal(gameContent, document.body);
}
