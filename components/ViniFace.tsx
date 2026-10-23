/**
 * VinnyFace Component
 * 
 * The main visualizer for the AI.
 * Handles rendering the different "Persona" faces (Vini, WALLE, EVE, KITT, HAL, Verity, Bloopie).
 * Uses Framer Motion for animations.
 * 
 * @module ViniFace
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViniState, Emotion, FoodItem, PersonaId } from '../types';

interface ViniFaceProps {
  state: ViniState;
  emotion: Emotion;
  speakingIntensity?: number;
  consumable?: FoodItem | null;
  color: string;
  persona: PersonaId;
}

interface EyeProps {
  side: 'left' | 'right';
  state: ViniState;
  emotion: Emotion;
  color: string;
  speakingIntensity: number;
  isSleeping: boolean;
  blink: boolean;
}

// ----------------------------------------------------------------------
// HAL 9000 STYLE
// ----------------------------------------------------------------------
const HalInterface: React.FC<{
  state: ViniState;
  speakingIntensity: number;
}> = ({ state, speakingIntensity }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      {/* The Eye Container */}
      <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-[#111] shadow-2xl flex items-center justify-center">

        {/* Brushed Metal Bezel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 via-gray-200 to-gray-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.8)] border-4 border-[#0a0a0a]" />

        {/* Inner Black Housing */}
        <div className="absolute inset-4 md:inset-6 rounded-full bg-black shadow-[inset_0_10px_20px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">

          {/* The Lens / Glow */}
          <motion.div
            className="relative w-2/3 h-2/3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #ffeb3b 0%, #ff0000 40%, #300000 70%, #000000 100%)',
              boxShadow: '0 0 50px rgba(255, 0, 0, 0.4)'
            }}
            animate={{
              opacity: state === ViniState.SPEAKING ? 0.9 + (speakingIntensity * 0.2) : 0.8,
              scale: state === ViniState.SPEAKING ? 1 + (speakingIntensity * 0.05) : 1
            }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          >
            {/* Core Hotspot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-100 rounded-full blur-[4px] opacity-90" />
          </motion.div>

          {/* Glass Reflection (Static) */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-12 right-20 w-16 h-8 bg-white/10 rotate-45 blur-md rounded-full" />

          {/* Subtle Grid overlay for 'Lens' feel */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// KITT STYLE: Dashboard, Buttons, Voice Box Equalizer
// ----------------------------------------------------------------------
const KittInterface: React.FC<{
  state: ViniState;
  speakingIntensity: number;
  consumable?: FoodItem | null;
}> = ({ state, speakingIntensity, consumable }) => {
  const isListening = state === ViniState.LISTENING;
  const isSpeaking = state === ViniState.SPEAKING;

  // Dashboard Button Component - Retro Plastic Style
  const DashButton = ({ label, type = "red" }: { label: string, type?: "red" | "yellow" }) => {
    // Colors based on the show's dashboard (dimmed/unlit state)
    const baseColor = type === "yellow" ? "bg-[#8B8000]" : "bg-[#8B0000]";
    const textColor = type === "yellow" ? "text-[#D4C860]" : "text-[#D46060]";

    return (
      <div className={`w-20 h-10 md:w-24 md:h-12 ${baseColor} rounded-md border-b-4 border-r-4 border-black/50 border-t border-l border-white/10 flex items-center justify-center mb-3 shadow-lg relative overflow-hidden`}>
        {/* Plastic sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none" />
        <span className={`text-[10px] md:text-xs font-bold ${textColor} uppercase tracking-widest opacity-80 shadow-black drop-shadow-sm`}>{label}</span>
      </div>
    );
  };

  // Center Console Mode Button
  const ModeButton = ({ label, active = false }: { label: string, active?: boolean }) => (
    <div className="flex items-center gap-2 w-full">
      {/* Indicator Light */}
      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${active ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-green-900'} border border-black`} />

      {/* Button */}
      <div className="flex-1 h-8 md:h-10 bg-[#333] rounded border-b-2 border-r-2 border-black border-t border-l border-white/10 flex items-center justify-center relative overflow-hidden">
        <span className={`text-[8px] md:text-[10px] font-bold ${active ? 'text-white' : 'text-neutral-500'} uppercase tracking-wider text-center leading-none`}>
          {label.split(' ').map((line, i) => <div key={i}>{line}</div>)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="flex items-center gap-4 md:gap-8 p-4 md:p-10 rounded-3xl bg-[#151515] border border-neutral-800 shadow-[inset_0_0_80px_rgba(0,0,0,1)]">

        {/* Left Panel */}
        <div className="flex flex-col">
          <DashButton label="ALT" type="yellow" />
          <DashButton label="OIL PRESS" type="yellow" />
          <DashButton label="OIL TEMP" type="red" />
          <DashButton label="EGT" type="red" />
          <DashButton label="FUEL" type="red" />
        </div>

        {/* Center Section: Voice Box + Mode Buttons */}
        <div className="flex flex-col gap-4 md:gap-6 items-center">

          {/* Voice Box (The Equalizer) */}
          <div className="relative w-32 h-48 md:w-40 md:h-64 bg-black border-x-8 border-y-4 border-[#111] rounded-sm flex gap-2 px-3 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden">
            {/* 3 Columns */}
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="flex-1 flex flex-col justify-center gap-[2px]">
                {/* 16 Segments per column */}
                {Array.from({ length: 16 }).map((_, i) => {
                  // Center-out logic
                  // Total 16 segments. Center is between index 7 and 8.
                  const distFromCenter = Math.abs(i - 7.5);

                  let active = false;
                  let colorClass = 'bg-[#1a0505]'; // Dim red background for off state

                  if (isSpeaking) {
                    // RED EQUALIZER
                    // Column 1 is center (Tallest). Columns 0 and 2 are sides (Shorter).
                    const scaleFactor = colIndex === 1 ? 1.0 : 0.85;

                    // speakingIntensity is 0-1. 
                    const noise = Math.sin(Date.now() / 80 + colIndex) * 0.5;
                    const height = ((speakingIntensity * 9) + noise) * scaleFactor;

                    active = distFromCenter < height;
                    if (active) colorClass = 'bg-[#ff0000] shadow-[0_0_8px_#ff0000,0_0_15px_rgba(255,0,0,0.6)]';

                  } else if (isListening) {
                    // YELLOW EQUALIZER
                    // Slower animation
                    const time = Date.now();
                    // Much slower sine wave for "breathing" scan
                    const noise = Math.sin(time * 0.002 + (colIndex * 130)) * 1.5 + Math.cos(time * 0.003) * 1.5;
                    const baseHeight = 1.5;

                    // Random spikes are rarer
                    const spike = Math.random() > 0.95 ? 3 : 0;

                    // Apply side scaling for listening too
                    const scaleFactor = colIndex === 1 ? 1.0 : 0.8;
                    const height = (baseHeight + Math.abs(noise) + spike) * scaleFactor;

                    active = distFromCenter < height;
                    if (active) colorClass = 'bg-[#ffcc00] shadow-[0_0_8px_#ffcc00]';
                  } else if (state === ViniState.THINKING) {
                    // Single center beat
                    active = distFromCenter < 1;
                    if (active) {
                      const pulse = (Math.sin(Date.now() / 300) + 1) / 2;
                      colorClass = `bg-red-500 opacity-${0.3 + (pulse * 0.7)}`;
                    }
                  }

                  return (
                    <div
                      key={i}
                      className={`w-full h-full rounded-[1px] transition-colors duration-100 ${colorClass}`}
                    />
                  );
                })}
              </div>
            ))}

            {/* Glass/Plastic Overlay on the voicebox */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Center Console Buttons */}
          <div className="w-full flex flex-col gap-2">
            <ModeButton label="NORMAL CRUISE" active={!isSpeaking && !isListening} />
            <ModeButton label="AUTO CRUISE" active={isListening} />
            <ModeButton label="PURSUIT" active={isSpeaking} />
          </div>

        </div>

        {/* Right Panel */}
        <div className="flex flex-col">
          <DashButton label="AUX" type="yellow" />
          <DashButton label="SAT COMM" type="yellow" />
          <DashButton label="ACC" type="red" />
          <DashButton label="RADAR" type="red" />
          <DashButton label="MPI" type="red" />
        </div>
      </div>

      {/* Floating Food */}
      {state === ViniState.EATING && consumable && (
        <div className="absolute bottom-10 animate-float-up text-9xl z-50 drop-shadow-2xl">
          {consumable.emoji}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// WALL-E STYLE
// ----------------------------------------------------------------------
const WalleEye: React.FC<EyeProps> = ({ side, state, emotion, color, speakingIntensity, isSleeping, blink }) => {
  // Rotation (The Tilt)
  const getRotation = () => {
    let baseRotation = side === 'left' ? -15 : 15; // Natural binocular slant
    if (isSleeping) return side === 'left' ? -25 : 25; // Droop outwards when sleeping
    if (emotion === Emotion.HAPPY) return side === 'left' ? -5 : 5; // Perkup (straighter)
    if (emotion === Emotion.CONFUSED) return side === 'left' ? 0 : 0; // Level
    if (state === ViniState.SPEAKING) {
      return baseRotation + (Math.sin(Date.now() / 200) * 2 * (side === 'left' ? 1 : -1));
    }
    return baseRotation;
  };

  // Eyelid Position (0% = Open, 100% = Closed)
  const getEyelidClosure = () => {
    if (isSleeping) return 60; // Half-asleep look
    if (blink) return 100;
    if (emotion === Emotion.CONFUSED) return side === 'left' ? 40 : 0;
    if (emotion === Emotion.HAPPY) return 0;
    return 10;
  };

  const getIrisScale = () => {
    if (isSleeping) return 0.5;
    let base = 1;
    if (state === ViniState.SPEAKING) base += speakingIntensity * 0.1;
    if (emotion === Emotion.HAPPY) base *= 1.1;
    return base;
  };

  const getPupilScale = () => {
    if (isSleeping) return 0.9;
    if (state === ViniState.LOOKING) return 1.3;
    if (emotion === Emotion.HAPPY) return 1.4;
    if (emotion === Emotion.CONFUSED) return 0.7;
    if (state === ViniState.SPEAKING) return 1 + (speakingIntensity * 0.2);
    return 1;
  };

  const isLooking = state === ViniState.LOOKING;

  return (
    <motion.div
      animate={{
        rotate: getRotation(),
        y: isSleeping ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative w-36 h-36 md:w-56 md:h-56 mx-2 md:mx-4"
    >
      <div
        className="w-full h-full relative rounded-t-[45%] rounded-b-[25%] overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)',
          border: '4px solid #334155',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.5)'
        }}
      >
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner opacity-50" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner opacity-50" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-slate-500/30" />

        <div className="absolute inset-3 md:inset-5 bg-black rounded-t-[42%] rounded-b-[22%] shadow-[inset_0_5px_15px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none z-20" />
          <div className="absolute top-6 left-6 w-8 h-4 bg-white/30 blur-sm rounded-full rotate-45 z-20" />

          <motion.div
            animate={{ scale: getIrisScale() }}
            className="relative w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center z-10"
          >
            <div
              className="absolute inset-0 rounded-full opacity-60 blur-xl"
              style={{ backgroundColor: isLooking ? '#ff0000' : color }}
            />
            <div
              className="relative w-full h-full rounded-full overflow-hidden border-2 transition-colors duration-500"
              style={{
                borderColor: isLooking ? '#ff000044' : `${color}44`,
                background: `radial-gradient(circle, ${isLooking ? '#ff0000' : color} 0%, #000 80%)`,
                boxShadow: `0 0 15px ${isLooking ? '#ff0000' : color}, inset 0 0 10px #000`
              }}
            >
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute inset-2 border border-white/20 rounded-full opacity-50" />
              <div className="absolute inset-5 border border-white/10 rounded-full opacity-30" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/30" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/30" />
              {isLooking && (
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-white/80 shadow-[0_0_10px_white]"
                />
              )}
            </div>

            <motion.div
              className="absolute w-[40%] h-[40%] rounded-full bg-black shadow-[inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center"
              animate={{ scale: getPupilScale() }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{ background: `radial-gradient(circle at 30% 30%, ${isLooking ? '#ff0000' : color}, transparent 60%)` }}
              />
              {isLooking ? (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_red]"
                />
              ) : (
                <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] opacity-90" />
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ height: `${getEyelidClosure()}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-400 to-slate-600 border-b-4 border-slate-700 shadow-lg"
        >
          <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
        </motion.div>

        {emotion === Emotion.HAPPY && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '20%' }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-400 to-slate-600 border-t-4 border-slate-700"
          />
        )}
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// EVE STYLE
// ----------------------------------------------------------------------
const EveEye: React.FC<EyeProps> = ({ side, state, emotion, color, speakingIntensity, isSleeping, blink }) => {
  const isLooking = state === ViniState.LOOKING;

  // Determine Shape via Border Radius & Scale
  const getShape = () => {
    // Default Oval
    let borderRadius = "50%";
    let scaleY = 1;
    let scaleX = 1;
    let rotate = side === 'left' ? -5 : 5; // Slight natural tilt

    if (isSleeping) {
      // Thin line when sleeping (but not fully gone)
      scaleY = 0.05;
      scaleX = 0.8;
      rotate = 0;
    } else if (blink) {
      scaleY = 0.02;
    } else if (emotion === Emotion.HAPPY) {
      // Inverted U / Moon shape effect via border radius
      // Top-Left, Top-Right, Bottom-Right, Bottom-Left
      borderRadius = "50% 50% 40% 40%";
      scaleY = 0.8;
      rotate = side === 'left' ? -15 : 15;
    } else if (emotion === Emotion.CONFUSED) {
      if (side === 'left') {
        scaleY = 0.6;
        borderRadius = "50%";
      } else {
        scaleY = 1.1;
      }
    } else if (state === ViniState.SPEAKING) {
      // Pulse vertical size
      scaleY = 1 + (speakingIntensity * 0.3);
    }

    return { borderRadius, scaleY, scaleX, rotate };
  };

  const shape = getShape();

  return (
    <div className="relative w-40 h-28 md:w-64 md:h-44 mx-2 md:mx-6 flex items-center justify-center">
      {/* Glow Effect Layer */}
      <motion.div
        animate={{
          scaleX: shape.scaleX,
          scaleY: shape.scaleY,
          rotate: shape.rotate,
          borderRadius: shape.borderRadius,
          opacity: isSleeping ? 0.3 : 1
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="absolute inset-0 blur-2xl opacity-60"
        style={{ backgroundColor: isLooking ? '#ff0000' : color }}
      />

      {/* Main Eye Shape */}
      <motion.div
        animate={{
          scaleX: shape.scaleX,
          scaleY: shape.scaleY,
          rotate: shape.rotate,
          borderRadius: shape.borderRadius,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative w-full h-full overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/10"
        style={{
          backgroundColor: isLooking ? '#ff0000' : color,
          boxShadow: `0 0 30px ${isLooking ? '#ff0000' : color}, inset 0 0 10px rgba(255,255,255,0.5)`
        }}
      >
        {/* Digital Scanlines */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)'
          }}
        />

        {/* Slight Highlight Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-80" />

        {/* Scanning Animation for Vision */}
        {isLooking && (
          <motion.div
            animate={{ left: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute top-0 bottom-0 w-10 bg-white/50 blur-md skew-x-12"
          />
        )}

        {/* Core Brightness */}
        <div className="absolute inset-4 blur-md bg-white/30 rounded-[inherit]" />
      </motion.div>
    </div>
  );
};


// ----------------------------------------------------------------------
// VERITY: flat lemon-yellow smiley ball
// ----------------------------------------------------------------------
type VerityExpression = 'grin' | 'slight' | 'poker' | 'sad';

const VERITY_MOUTHS: Record<VerityExpression, string> = {
  slight: 'M 64 130 Q 100 150 136 130',
  grin: 'M 46 116 Q 100 176 154 116',
  poker: 'M 66 140 Q 100 140 134 140',
  sad: 'M 56 160 Q 100 108 144 160',
};

const VerityFace: React.FC<{
  state: ViniState;
  emotion: Emotion;
  speakingIntensity: number;
  consumable?: FoodItem | null;
  color: string;
}> = ({ state, emotion, speakingIntensity, consumable, color }) => {
  const [blink, setBlink] = useState(false);
  const [cycle, setCycle] = useState(0);
  const isSpeaking = state === ViniState.SPEAKING;
  const isAsleep = state === ViniState.IDLE;
  const isResting = state === ViniState.LISTENING;

  useEffect(() => {
    if (isAsleep || state === ViniState.EATING || state === ViniState.LOOKING) return;
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.65) {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
      }
    }, 2800);
    return () => clearInterval(blinkInterval);
  }, [state, isAsleep]);

  // While listening, stroll through grin, poker face, sad, and slight smile.
  useEffect(() => {
    if (!isResting || emotion !== Emotion.NEUTRAL) return;
    const interval = setInterval(() => setCycle((n) => n + 1), 2800);
    return () => clearInterval(interval);
  }, [isResting, emotion]);

  const expression: VerityExpression = (() => {
    if (state === ViniState.THINKING) return 'poker';
    if (isSpeaking || state === ViniState.EATING || emotion === Emotion.HAPPY) return 'grin';
    if (emotion === Emotion.CONFUSED) return 'sad';
    if (state === ViniState.LOOKING) return 'slight';
    return (['slight', 'grin', 'poker', 'sad'] as const)[cycle % 4];
  })();

  const mouth = isAsleep
    ? 'M 90 144 Q 100 152 110 144'
    : isSpeaking
      ? `M 46 116 Q 100 ${168 + speakingIntensity * 14} 154 116`
      : VERITY_MOUTHS[expression];
  const eyeRy = blink ? 2.5 : expression === 'sad' ? 20 : 17;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: isSpeaking ? 1 + speakingIntensity * 0.045 : isAsleep ? [1, 1.035, 1] : 1,
          y: isSpeaking ? [0, -10, 0] : isAsleep ? [0, 16, 0] : 0,
        }}
        transition={
          isSpeaking
            ? { duration: 0.28, repeat: Infinity, repeatType: 'mirror' }
            : isAsleep
              ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 120, damping: 16 }
        }
        className="w-64 h-64 md:w-96 md:h-96"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label={isAsleep ? 'Verity sleeping' : 'Verity'}>
          <circle cx="100" cy="100" r="90" fill={color} />
          <motion.g animate={{ opacity: isAsleep ? 0 : 1 }} transition={{ duration: 0.45, ease: 'easeInOut' }}>
            <motion.ellipse
              cx="70"
              cy="84"
              rx="14"
              ry={eyeRy}
              fill="#111111"
              animate={{ ry: eyeRy }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            />
            <motion.ellipse
              cx="130"
              cy="84"
              rx="14"
              ry={eyeRy}
              fill="#111111"
              animate={{ ry: eyeRy }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            />
          </motion.g>
          <motion.g animate={{ opacity: isAsleep ? 1 : 0 }} transition={{ duration: 0.45, ease: 'easeInOut' }}>
            <path d="M 48 82 Q 70 104 92 82" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
            <path d="M 108 82 Q 130 104 152 82" fill="none" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
          </motion.g>
          <motion.path
            d={mouth}
            fill="none"
            stroke="#111111"
            strokeWidth="9"
            strokeLinecap="round"
            animate={{ d: mouth }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          />
        </svg>
      </motion.div>

      <AnimatePresence>
        {isAsleep && (
          <motion.div
            key="verity-zzz"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <div className="relative h-64 w-64 text-[1.65rem] md:h-96 md:w-96 md:text-[2.2rem]">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute font-bold leading-none"
                  style={{
                    left: `${58 + i * 13}%`,
                    top: `${-8 - i * 10}%`,
                    color,
                    fontSize: `${1 + i * 0.28}em`,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [8, 0, -10, -34],
                  }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    delay: i * 0.85,
                    ease: 'easeInOut',
                    times: [0, 0.12, 0.72, 1],
                  }}
                >
                  z
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state === ViniState.EATING && consumable && (
        <div className="absolute bottom-10 animate-float-up text-9xl z-50 drop-shadow-2xl">
          {consumable.emoji}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// BLOOPIE: flat blue crayon sun-creature with a sticker heart
// ----------------------------------------------------------------------
const BLOOPIE_BLUE = '#2F6FE0';
const BLOOPIE_CX = 168;
const BLOOPIE_CY = 206;
const BLOOPIE_BODY_R = 78;
const BLOOPIE_PAD_DIST = 156;
const BLOOPIE_PAD_RX = 42;
const BLOOPIE_PAD_RY = 26;

function bloopiePolar(deg: number, r: number, ox = BLOOPIE_CX, oy = BLOOPIE_CY) {
  const a = (deg * Math.PI) / 180;
  return { x: ox + Math.cos(a) * r, y: oy + Math.sin(a) * r };
}

function bloopieArm(deg: number, inner: number, outer: number, gap = 4.6) {
  const a = (deg * Math.PI) / 180;
  const px = -Math.sin(a) * gap;
  const py = Math.cos(a) * gap;
  const start = bloopiePolar(deg, inner);
  const end = bloopiePolar(deg, outer);
  const line = (sign: number) =>
    `M ${(start.x + px * sign).toFixed(1)} ${(start.y + py * sign).toFixed(1)} L ${(end.x + px * sign).toFixed(1)} ${(end.y + py * sign).toFixed(1)}`;
  return { a: line(1), b: line(-1) };
}

const BLOOPIE_LIMBS: { deg: number; buttons: 1 | 3 }[] = [
  { deg: 225, buttons: 3 }, // up-left
  { deg: -45, buttons: 1 }, // up-right
  { deg: 135, buttons: 3 }, // down-left
  { deg: 45, buttons: 1 }, // down-right
];

const BLOOPIE_RAYS = Array.from({ length: 44 }, (_, i) => {
  const deg = (i / 44) * 360;
  const inner = 46 + (i % 3);
  const outer = 68 + (i % 5) * 1.6;
  const start = bloopiePolar(deg, inner);
  const end = bloopiePolar(deg, outer);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
});

function bloopieButtons(deg: number, count: number) {
  const center = bloopiePolar(deg, BLOOPIE_PAD_DIST);
  const a = ((deg + 90) * Math.PI) / 180;
  const offsets = count === 3 ? [-17, 0, 17] : [0];
  return offsets.map((o) => ({
    x: center.x + Math.cos(a) * o,
    y: center.y + Math.sin(a) * o,
  }));
}

const BLOOPIE_PET = bloopiePolar(-14, 188);
const BLOOPIE_PET_ARM = bloopieArm(-14, BLOOPIE_BODY_R - 10, 166, 4.4);

const BloopieButton: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <circle cx={x} cy={y} r="7" fill="#FFFEF8" stroke={color} strokeWidth="2.2" />
    <path
      d={`M ${x - 3.5} ${y} H ${x + 3.5} M ${x} ${y - 3.5} V ${y + 3.5}`}
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </g>
);

const BloopieFace: React.FC<{
  state: ViniState;
  emotion: Emotion;
  speakingIntensity: number;
  consumable?: FoodItem | null;
  color?: string;
}> = ({ state, emotion, speakingIntensity, consumable, color = BLOOPIE_BLUE }) => {
  const [blink, setBlink] = useState(false);
  const isSpeaking = state === ViniState.SPEAKING;
  const isAsleep = state === ViniState.IDLE;
  const isListening = state === ViniState.LISTENING;
  const eyeRy = blink && !isAsleep ? 1.1 : 6.4;
  const pupilDy = state === ViniState.THINKING ? -2.4 : state === ViniState.LOOKING ? 0.4 : 0;
  const smile = emotion === Emotion.HAPPY || state === ViniState.EATING
    ? `M ${BLOOPIE_CX - 12} ${BLOOPIE_CY + 8} Q ${BLOOPIE_CX} ${BLOOPIE_CY + 20} ${BLOOPIE_CX + 12} ${BLOOPIE_CY + 8}`
    : emotion === Emotion.CONFUSED
      ? `M ${BLOOPIE_CX - 10} ${BLOOPIE_CY + 12} Q ${BLOOPIE_CX} ${BLOOPIE_CY + 8} ${BLOOPIE_CX + 10} ${BLOOPIE_CY + 13}`
      : `M ${BLOOPIE_CX - 13} ${BLOOPIE_CY + 10} Q ${BLOOPIE_CX} ${BLOOPIE_CY + 19} ${BLOOPIE_CX + 13} ${BLOOPIE_CY + 10}`;
  const mouthOpen = 5 + speakingIntensity * 7;
  const px = BLOOPIE_PET.x;
  const py = BLOOPIE_PET.y;

  useEffect(() => {
    if (isAsleep || state === ViniState.EATING || state === ViniState.LOOKING) return;
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.62) {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
      }
    }, 2600);
    return () => clearInterval(blinkInterval);
  }, [state, isAsleep]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: isSpeaking ? 1 + speakingIntensity * 0.04 : isAsleep ? [1, 1.03, 1] : 1,
          y: isSpeaking ? [0, -8, 0] : isAsleep ? [0, 12, 0] : 0,
          rotate: isListening ? [-1.6, 1.6, -1.6] : 0,
        }}
        transition={
          isSpeaking
            ? { duration: 0.28, repeat: Infinity, repeatType: 'mirror' }
            : isAsleep
              ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              : isListening
                ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 120, damping: 16 }
        }
        className="w-80 h-80 md:w-[30rem] md:h-[30rem]"
      >
        <svg viewBox="0 0 420 420" className="w-full h-full" role="img" aria-label={isAsleep ? 'Bloopie sleeping' : 'Bloopie'}>
          <rect x="8" y="8" width="404" height="404" rx="26" fill="#FFFEF8" />

          {BLOOPIE_LIMBS.map((limb) => {
            const arm = bloopieArm(limb.deg, BLOOPIE_BODY_R - 8, BLOOPIE_PAD_DIST - BLOOPIE_PAD_RY + 1);
            return (
              <g key={`arm-${limb.deg}`}>
                <path d={arm.a} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
                <path d={arm.b} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
              </g>
            );
          })}
          <path d={BLOOPIE_PET_ARM.a} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
          <path d={BLOOPIE_PET_ARM.b} fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />

          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r={BLOOPIE_BODY_R} fill="#FFFEF8" />
          {BLOOPIE_RAYS.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke={color}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          ))}
          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r={BLOOPIE_BODY_R} fill="none" stroke={color} strokeWidth="5" />

          <defs>
            <linearGradient id="bloopie-rainbow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2EC4B6" />
              <stop offset="0.22" stopColor="#3B82F6" />
              <stop offset="0.42" stopColor="#A855F7" />
              <stop offset="0.62" stopColor="#F43F5E" />
              <stop offset="0.8" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
          </defs>
          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r="40" fill="none" stroke="url(#bloopie-rainbow)" strokeWidth="9" />
          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r="34" fill="#14B8A6" />
          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r="29" fill="#FFFFFF" />
          <circle cx={BLOOPIE_CX} cy={BLOOPIE_CY} r="25" fill="#EF4444" />
          <ellipse cx={BLOOPIE_CX - 8} cy={BLOOPIE_CY - 14} rx="8" ry="4" fill="#FFFFFF" opacity="0.9" transform={`rotate(-28 ${BLOOPIE_CX - 8} ${BLOOPIE_CY - 14})`} />

          <motion.g initial={{ opacity: isAsleep ? 0 : 1 }} animate={{ opacity: isAsleep ? 0 : 1 }} transition={{ duration: 0.4 }}>
            <motion.ellipse
              cx={BLOOPIE_CX - 10}
              cy={BLOOPIE_CY - 2}
              rx="6.4"
              ry={eyeRy}
              fill="#FFFFFF"
              animate={{ ry: eyeRy }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            />
            <motion.ellipse
              cx={BLOOPIE_CX + 10}
              cy={BLOOPIE_CY - 2}
              rx="6.4"
              ry={eyeRy}
              fill="#FFFFFF"
              animate={{ ry: eyeRy }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            />
            <motion.circle cx={BLOOPIE_CX - 10} cy={BLOOPIE_CY - 2 + pupilDy} r="3" fill="#1E3A5F" animate={{ cy: BLOOPIE_CY - 2 + pupilDy, opacity: blink ? 0 : 1 }} />
            <motion.circle cx={BLOOPIE_CX + 10} cy={BLOOPIE_CY - 2 + pupilDy} r="3" fill="#1E3A5F" animate={{ cy: BLOOPIE_CY - 2 + pupilDy, opacity: blink ? 0 : 1 }} />
            <circle cx={BLOOPIE_CX - 11.6} cy={BLOOPIE_CY - 3.8} r="1.15" fill="#FFFFFF" opacity={blink ? 0 : 1} />
            <circle cx={BLOOPIE_CX + 8.4} cy={BLOOPIE_CY - 3.8} r="1.15" fill="#FFFFFF" opacity={blink ? 0 : 1} />
            <motion.path
              d={smile}
              fill="none"
              stroke="#1E3A5F"
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{ d: smile, opacity: isSpeaking ? 0 : 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            />
            <motion.ellipse
              cx={BLOOPIE_CX}
              cy={BLOOPIE_CY + 10}
              rx="7"
              ry={mouthOpen}
              fill="#1E3A5F"
              animate={{ ry: mouthOpen, opacity: isSpeaking ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            />
          </motion.g>
          <motion.g initial={{ opacity: isAsleep ? 1 : 0 }} animate={{ opacity: isAsleep ? 1 : 0 }} transition={{ duration: 0.4 }}>
            <path d={`M ${BLOOPIE_CX - 16} ${BLOOPIE_CY - 3} Q ${BLOOPIE_CX - 10} ${BLOOPIE_CY + 4} ${BLOOPIE_CX - 4} ${BLOOPIE_CY - 3}`} fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${BLOOPIE_CX + 4} ${BLOOPIE_CY - 3} Q ${BLOOPIE_CX + 10} ${BLOOPIE_CY + 4} ${BLOOPIE_CX + 16} ${BLOOPIE_CY - 3}`} fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d={`M ${BLOOPIE_CX - 7} ${BLOOPIE_CY + 12} Q ${BLOOPIE_CX} ${BLOOPIE_CY + 16} ${BLOOPIE_CX + 7} ${BLOOPIE_CY + 12}`} fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
          </motion.g>

          {BLOOPIE_LIMBS.map((limb) => {
            const center = bloopiePolar(limb.deg, BLOOPIE_PAD_DIST);
            return (
              <g key={`pad-${limb.deg}`}>
                <ellipse
                  cx={center.x}
                  cy={center.y}
                  rx={BLOOPIE_PAD_RX}
                  ry={BLOOPIE_PAD_RY}
                  fill="#FFFEF8"
                  stroke={color}
                  strokeWidth="3.4"
                  transform={`rotate(${limb.deg + 90} ${center.x} ${center.y})`}
                />
                {bloopieButtons(limb.deg, limb.buttons).map((button, i) => (
                  <BloopieButton key={i} x={button.x} y={button.y} color={color} />
                ))}
              </g>
            );
          })}

          <polygon points={`${px - 16},${py - 8} ${px - 24},${py - 32} ${px - 4},${py - 16}`} fill="#FFFEF8" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points={`${px + 8},${py - 12} ${px + 22},${py - 34} ${px + 18},${py - 8}`} fill="#FFFEF8" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx={px} cy={py} r="22" fill="#FFFEF8" stroke={color} strokeWidth="3.2" />
          <motion.g initial={{ opacity: isAsleep ? 0 : 1 }} animate={{ opacity: isAsleep ? 0 : 1 }}>
            <circle cx={px - 1} cy={py - 1} r="7" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            <circle cx={px - 1} cy={py - 1} r="3.3" fill={color} />
            <circle cx={px - 2.4} cy={py - 2.4} r="1.15" fill="#FFFFFF" />
            <path d={`M ${px - 8} ${py + 8} Q ${px} ${py + 14} ${px + 8} ${py + 8}`} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          </motion.g>
          <motion.g initial={{ opacity: isAsleep ? 1 : 0 }} animate={{ opacity: isAsleep ? 1 : 0 }}>
            <path d={`M ${px - 8} ${py - 1} Q ${px - 1} ${py + 4} ${px + 6} ${py - 1}`} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
            <path d={`M ${px - 6} ${py + 9} Q ${px} ${py + 12} ${px + 6} ${py + 9}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {isAsleep && [0, 1, 2].map((i) => (
            <motion.text
              key={i}
              x={228 + i * 22}
              y={78 - i * 16}
              fill={color}
              fontSize={22 + i * 6}
              fontWeight="700"
              fontFamily="ui-rounded, 'Trebuchet MS', sans-serif"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: [1, 1, 0], y: [0, -6, -20] }}
              transition={{ duration: 3.8, repeat: Infinity, delay: i * 0.75, ease: 'easeInOut', times: [0, 0.72, 1] }}
            >
              z
            </motion.text>
          ))}
        </svg>
      </motion.div>

      {state === ViniState.EATING && consumable && (
        <div className="absolute bottom-10 animate-float-up text-9xl z-50 drop-shadow-2xl">
          {consumable.emoji}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN CONTAINER
// ----------------------------------------------------------------------
const ViniFace: React.FC<ViniFaceProps> = ({ state, emotion, speakingIntensity = 0, consumable, color, persona }) => {
  const [blink, setBlink] = useState(false);
  // Force speaking intensity animation update for KITT visualization
  const [tick, setTick] = useState(0);

  const isSleeping = state === ViniState.IDLE;

  // Random blink logic
  useEffect(() => {
    if (isSleeping || persona === 'KITT' || persona === 'HAL' || persona === 'Verity' || persona === 'Bloopie') return;

    const blinkInterval = setInterval(() => {
      // Random blink every few seconds
      if (Math.random() > 0.7 && state !== ViniState.EATING && state !== ViniState.LOOKING) {
        setBlink(true);
        setTimeout(() => setBlink(false), 200); // Fast blink
      }
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, [state, isSleeping, persona]);

  // High frequency tick for equalizer smoothness
  useEffect(() => {
    if (persona !== 'KITT') return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [persona]);

  // Special Interfaces
  if (persona === 'HAL') {
    return <HalInterface state={state} speakingIntensity={speakingIntensity} />;
  }
  if (persona === 'KITT') {
    return <KittInterface state={state} speakingIntensity={speakingIntensity} consumable={consumable} />;
  }
  if (persona === 'Verity') {
    return (
      <VerityFace
        state={state}
        emotion={emotion}
        speakingIntensity={speakingIntensity}
        consumable={consumable}
        color={color}
      />
    );
  }
  if (persona === 'Bloopie') {
    return (
      <BloopieFace
        state={state}
        emotion={emotion}
        speakingIntensity={speakingIntensity}
        consumable={consumable}
        color={color}
      />
    );
  }

  // Standard Two-Eye Interface
  const EyeComponent = persona === 'EVE' ? EveEye : WalleEye;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">

      {/* Eye Container */}
      <div className="flex items-center justify-center gap-4 md:gap-8 perspective-1000">
        <EyeComponent
          side="left"
          state={state}
          emotion={emotion}
          color={color}
          speakingIntensity={speakingIntensity}
          isSleeping={isSleeping}
          blink={blink}
        />
        <EyeComponent
          side="right"
          state={state}
          emotion={emotion}
          color={color}
          speakingIntensity={speakingIntensity}
          isSleeping={isSleeping}
          blink={blink}
        />
      </div>

      {/* Zzzz Animation (Only when Sleeping) */}
      <AnimatePresence>
        {isSleeping && (
          <div className="absolute top-1/3 right-1/4 -mt-20">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: 40 + (i * 30),
                  y: -60 - (i * 50),
                  scale: [0.5, 1.5, 1.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeOut"
                }}
                className="absolute font-bold text-slate-400 text-6xl md:text-8xl font-serif z-40"
                style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
              >
                Z
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Mouth/Consumable (Only Visible when Eating) */}
      <AnimatePresence>
        {state === ViniState.EATING && (
          <div className="absolute top-2/3 flex flex-col items-center">
            {/* Mechanical Mouth (WALL-E Style) - Only show if not EVE or if we want a mouth */}
            {persona === 'WALLE' && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className="w-48 h-12 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center overflow-hidden"
              >
                <div className="w-full h-1 bg-black/50" />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Floating Food Animation */}
      {state === ViniState.EATING && consumable && (
        <div className="absolute bottom-0 animate-float-up text-9xl z-50 drop-shadow-2xl">
          {consumable.emoji}
        </div>
      )}
    </div>
  );
};

export default ViniFace;