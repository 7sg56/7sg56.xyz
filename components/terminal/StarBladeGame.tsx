"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

type GameState = "playing" | "gameover";
type EnemyType = "normal" | "yellow" | "purple" | "blue" | "boss";

type Enemy = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: EnemyType;
  hp?: number; // For boss enemies
};

type BossLaser = {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
    const bossLasers: BossLaser[] = [];
    let currentScore = 0;
    let currentLives = 5;
    let currentGameState: GameState = "playing";
    let invulnerable = false;
    let invulnerableUntil = 0;
    let lastBossScore = 0; // Track when last boss was spawned
    let bossShootTimer = 0; // Track boss shooting waves
    
    // Power-ups with limits
    let fireRateBoost = 0; // Number of fire rate boosts (blue enemies killed) - MAX 5
    let blasterCount = 1; // Number of blasters (purple enemies killed) - MAX 3
    const MAX_FIRE_RATE_BOOST = 5;
    const MAX_BLASTERS = 3;
    
    // Power mode (yellow/golden enemy - rarest)
    let powerModeActive = false;
    let powerModeUntil = 0;
    const POWER_MODE_DURATION = 10000; // 10 seconds

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

    // Millennium Falcon-style boss drawing function
    const drawBoss = (x: number, y: number, hp: number, maxHp: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      const scale = 2.5; // Boss is bigger
      ctx.scale(scale, scale);
      
      // Main circular body (golden/yellow)
      ctx.fillStyle = "#fbbf24"; // golden yellow
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Darker golden outline
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Cockpit offset (like Millennium Falcon)
      ctx.fillStyle = "#60a5fa"; // blue cockpit
      ctx.beginPath();
      ctx.arc(8, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Side mandibles/prongs (Falcon-style)
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.moveTo(-15, -5);
      ctx.lineTo(-25, -8);
      ctx.lineTo(-22, -3);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-15, 5);
      ctx.lineTo(-25, 8);
      ctx.lineTo(-22, 3);
      ctx.closePath();
      ctx.fill();
      
      // Engine glow
      ctx.fillStyle = "#3b82f6"; // blue engine glow
      ctx.beginPath();
      ctx.arc(15, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Detail lines
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
      
      ctx.restore();
      
      // HP bar above boss
      const barWidth = 60;
      const barHeight = 6;
      const hpPercent = hp / maxHp;
      
      ctx.fillStyle = "#1f2937"; // dark background
      ctx.fillRect(x - barWidth / 2, y - 50, barWidth, barHeight);
      
      // HP bar color (green to red based on health)
      const hpColor = hpPercent > 0.5 ? "#4ade80" : hpPercent > 0.25 ? "#fbbf24" : "#ef4444";
      ctx.fillStyle = hpColor;
      ctx.fillRect(x - barWidth / 2, y - 50, barWidth * hpPercent, barHeight);
      
      // HP bar border
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - barWidth / 2, y - 50, barWidth, barHeight);
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
        lastBossScore = 0;
        bossShootTimer = 0;
        setGameState("playing");
        setScore(0);
        setLives(5);
        player.x = 80;
        player.y = height / 2;
        enemies.length = 0;
        lasers.length = 0;
        bossLasers.length = 0;
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
        
        // In power mode: use 4 blasters (special bonus!)
        const POWER_MODE_BLASTERS = 4;
        const effectiveBlasterCount = powerModeActive ? POWER_MODE_BLASTERS : blasterCount;
        
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

        // Spawn mini-boss every 500 points
        if (currentScore >= lastBossScore + 500 && currentScore > 0) {
          enemies.push({
            x: width + 50,
            y: height / 2,
            vx: -1.5,
            vy: 0,
            type: "boss",
            hp: 35 // Boss has 35 HP - tanky!
          });
          lastBossScore = currentScore;
        }

        // Progressive difficulty: spawn rate and speed increase with score
        const difficultyMultiplier = 1 + Math.floor(currentScore / 100) * 0.1; // Increases every 100 points
        const spawnRate = Math.max(300, 700 - Math.floor(currentScore / 50) * 20); // Faster spawning as score increases
        const baseSpeed = 2 + Math.floor(currentScore / 100) * 0.3; // Faster enemies as score increases
        
        // Spawn enemies with rare special types
        if (now - lastSpawn > spawnRate) {
          const rand = Math.random();
          let enemyType: EnemyType = "normal";
          
          // 1% chance for yellow/golden (speed boost - RAREST)
          if (rand < 0.01) {
            enemyType = "yellow";
          }
          // 2% chance for purple (extra blasters - RARE)
          else if (rand < 0.03) {
            enemyType = "purple";
          }
          // 4% chance for blue (fire rate boost - UNCOMMON)
          else if (rand < 0.07) {
            enemyType = "blue";
          }
          
          // Special enemies move faster (50% speed boost)
          const speedMultiplier = enemyType !== "normal" ? 1.5 : 1;
          
          enemies.push({ 
            x: width + 20, 
            y: Math.random() * (height - 40) + 20, 
            vx: -(baseSpeed + Math.random() * 1.5) * speedMultiplier, 
            vy: (Math.random() - 0.5) * 1.2 * speedMultiplier,
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
          
          // Boss behavior: move in a wave pattern and shoot
          if (E.type === "boss") {
            // Wave movement - more aggressive
            E.vy = Math.sin(now / 400) * 3;
            
            // Boss shooting in waves (every 1 second - faster!)
            if (now - bossShootTimer > 1000) {
              // Shoot 5 lasers in a spread pattern (more dangerous!)
              const angles = [-0.5, -0.25, 0, 0.25, 0.5]; // Wider spread with more lasers
              for (const angle of angles) {
                bossLasers.push({
                  x: E.x - 30,
                  y: E.y,
                  vx: -7 * Math.cos(angle), // Faster projectiles
                  vy: -7 * Math.sin(angle)
                });
              }
              bossShootTimer = now;
            }
          } else {
            // Bounce normal enemies off top/bottom
            if (E.y < 20 || E.y > height - 20) {
              E.vy *= -1;
            }
          }
          
          if (E.x < -40) enemies.splice(i, 1);
        }

        // Update boss lasers
        for (let i = bossLasers.length - 1; i >= 0; i--) {
          const BL = bossLasers[i];
          BL.x += BL.vx;
          BL.y += BL.vy;
          
          // Remove if out of bounds
          if (BL.x < -30 || BL.y < -30 || BL.y > height + 30) {
            bossLasers.splice(i, 1);
          }
        }

        // Collisions - laser hits enemy
        for (let i = enemies.length - 1; i >= 0; i--) {
          const E = enemies[i];
          for (let j = lasers.length - 1; j >= 0; j--) {
            const L = lasers[j];
            const hitRadius = E.type === "boss" ? 35 : 18;
            const hitRadiusY = E.type === "boss" ? 30 : 15;
            
            if (Math.abs(L.x - E.x) < hitRadius && Math.abs(L.y - E.y) < hitRadiusY) {
              const enemyType = E.type;
              lasers.splice(j, 1);
              
              // Boss takes damage instead of dying immediately
              if (enemyType === "boss") {
                E.hp = (E.hp || 35) - 1;
                if (E.hp <= 0) {
                  enemies.splice(i, 1);
                  currentScore += 150; // Big score for killing boss
                  setScore(currentScore);
                }
              } else {
                enemies.splice(i, 1);
                currentScore += enemyType === "normal" ? 10 : 25;
                setScore(currentScore);
                
                // Apply power-ups with limits
                if (enemyType === "blue" && fireRateBoost < MAX_FIRE_RATE_BOOST) {
                  // Blue = fire rate boost
                  fireRateBoost++;
                } else if (enemyType === "purple" && blasterCount < MAX_BLASTERS) {
                  // Purple = extra blasters (up to 3)
                  blasterCount++;
                } else if (enemyType === "yellow") {
                  // Yellow/Golden = Power mode (10 seconds, 4 boosters, max fire rate)
                  powerModeActive = true;
                  powerModeUntil = now + POWER_MODE_DURATION;
                }
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
            const hitRadius = E.type === "boss" ? 40 : 20;
            const hitRadiusY = E.type === "boss" ? 35 : 18;
            
            if (Math.abs(player.x - E.x) < hitRadius && Math.abs(player.y - E.y) < hitRadiusY) {
              // Don't remove boss on collision, just damage player
              if (E.type !== "boss") {
                enemies.splice(i, 1);
              }
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
          
          // Boss laser hits player
          for (let i = bossLasers.length - 1; i >= 0; i--) {
            const BL = bossLasers[i];
            if (Math.abs(player.x - BL.x) < 15 && Math.abs(player.y - BL.y) < 15) {
              bossLasers.splice(i, 1);
              currentLives--;
              setLives(currentLives);
              invulnerable = true;
              invulnerableUntil = now + 2000;
              
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

      // Draw enemies and bosses
      for (const E of enemies) {
        if (E.type === "boss") {
          drawBoss(E.x, E.y, E.hp || 20, 20);
        } else {
          drawEnemy(E.x, E.y, E.type);
        }
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

      // Draw boss lasers (red glowing projectiles)
      ctx.save();
      for (const BL of bossLasers) {
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ef4444";
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(BL.x, BL.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath();
        ctx.arc(BL.x, BL.y, 2.5, 0, Math.PI * 2);
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
