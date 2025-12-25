/**
 * Vinny - The AI Robot
 * 
 * Main Application Component
 * 
 * This component handles the core logic for Vini, including:
 * - State management (Idle, Listening, Speaking, etc.)
 * - Integration with Gemini Multimodal Live API
 * - Audio streaming and recording
 * - Camera tool handling ("look" functionality)
 * - User interactions (taps, settings)
 * 
 * @module App
 */

import React, { useState, useEffect, useRef } from 'react';
import ViniFace from './components/ViniFace';
import Controls from './components/Controls';
import SettingsPanel, { PERSONAS } from './components/SettingsPanel';
import { ViniState, Emotion, FoodItem, ViniConfig } from './types';
import { ViniLiveClient } from './services/geminiService';
import { AudioStreamer, AudioRecorder } from './services/audioService';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines the emoji icon for consumable items based on the tool call arguments.
 */
const getConsumableIcon = (toolName: string, args: any): string => {
  const item = (args.food || args.beverage || '').toLowerCase();

  if (toolName === 'drink') {
    if (item.includes('water')) return '💧';
    if (item.includes('coffee')) return '☕';
    if (item.includes('tea')) return '🍵';
    if (item.includes('milk')) return '🥛';
    if (item.includes('beer')) return '🍺';
    if (item.includes('wine')) return '🍷';
    if (item.includes('juice')) return '🧃';
    return '🥤'; // Generic Drink
  }

  // Eat
  if (item.includes('burger')) return '🍔';
  if (item.includes('pizza')) return '🍕';
  if (item.includes('taco')) return '🌮';
  if (item.includes('sushi')) return '🍣';
  if (item.includes('cookie')) return '🍪';
  if (item.includes('apple')) return '🍎';
  if (item.includes('banana')) return '🍌';
  if (item.includes('cake')) return '🍰';
  if (item.includes('ice cream')) return '🍦';
  if (item.includes('donut')) return '🍩';
  if (item.includes('fries')) return '🍟';
  return '🍕'; // Generic Eat (Changed from 🍴 to Pizza)
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: ViniConfig = {
  eyeColor: '#22d3ee', // Cyan default
  silliness: 60,
  speed: 40,
  customInstructions: '',
  voiceName: 'Puck', // Playful voice
  language: 'English',
  persona: 'Vini'
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const App: React.FC = () => {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  // Core VINI State (Activity)
  const [viniState, setViniState] = useState<ViniState>(ViniState.IDLE);
  const [emotion, setEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [consumable, setConsumable] = useState<FoodItem | null>(null);

  // Visualizer State
  const [speakingIntensity, setSpeakingIntensity] = useState(0);

  // Settings & Configuration
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [config, setConfig] = useState<ViniConfig>(DEFAULT_CONFIG);

  // --------------------------------------------------------------------------
  // REFS (Services & Hardware)
  // --------------------------------------------------------------------------

  // AI & Audio Services
  const liveClientRef = useRef<ViniLiveClient | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const speakingTimerRef = useRef<any>(null);

  // Camera Hardware
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction (Tap Detection)
  const lastTapRef = useRef<number>(0);
  const tapCountRef = useRef<number>(0);

  // --------------------------------------------------------------------------
  // SESSION LOGIC
  // --------------------------------------------------------------------------

  /**
   * Initializes the session, connects to Gemini, and manages local audio streams.
   */
  const startLiveSession = async () => {
    try {
      setViniState(ViniState.LISTENING);

      audioStreamerRef.current = new AudioStreamer();

      // Initialize Gemini Client
      liveClientRef.current = new ViniLiveClient(
        // AUDIO CALLBACK: Received audio chunk from Gemini
        (base64Audio) => {
          setViniState(ViniState.SPEAKING);
          setSpeakingIntensity(Math.random() * 0.5 + 0.5);

          audioStreamerRef.current?.playPCM16(base64Audio, () => {
            if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
            speakingTimerRef.current = setTimeout(() => {
              setViniState(ViniState.LISTENING);
              setSpeakingIntensity(0);
            }, 500);
          });

          if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        },
        async (name, args) => {
          // ------------------------------------------------------------------
          // TOOL: Camera ("look")
          // ------------------------------------------------------------------
          if (name === 'look') {
            setViniState(ViniState.LOOKING);
            try {
              // Open camera - FORCE FRONT FACING CAMERA ('user')
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
              });

              if (videoRef.current && canvasRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                // Wait for animation and auto-focus (800ms)
                await new Promise(r => setTimeout(r, 800));

                // Capture Frame
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                const ctx = canvasRef.current.getContext('2d');

                // Mirror the image horizontally so it feels like a mirror/selfie
                ctx?.translate(canvasRef.current.width, 0);
                ctx?.scale(-1, 1);

                ctx?.drawImage(videoRef.current, 0, 0);

                // Convert to Base64 and send
                const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
                liveClientRef.current?.sendImage(base64);

                // Clean up tracks immediately after use
                stream.getTracks().forEach(t => t.stop());
                videoRef.current.srcObject = null;
              }
            } catch (err) {
              console.error("Vision error:", err);
              // Fallback or error indication?
            }
            setViniState(ViniState.THINKING); // Processing
            return { status: 'image_sent' };
          }

          // Handle Food Tools
          const item = (args as any).food || (args as any).beverage || 'something';
          const icon = getConsumableIcon(name, args);

          setConsumable({ name: item, emoji: icon });
          setViniState(ViniState.EATING);
          setEmotion(Emotion.HAPPY);

          // Animation duration
          await new Promise(r => setTimeout(r, 3000));

          setConsumable(null);
          setViniState(ViniState.LISTENING);
          setEmotion(Emotion.NEUTRAL);
          return { status: 'ate_food' };
        }
      );

      // Lookup the active persona prompt
      const activePersona = PERSONAS.find(p => p.id === config.persona);
      const personaInstruction = activePersona?.systemPrompt || "";

      // Generate System Instructions
      const instructions = `
        ${personaInstruction}

        Configuration:
        - Silliness Level: ${config.silliness}/100 (0 is very serious/robotic, 100 is wacky/cartoonish).
        - Energy Level: ${config.speed}/100 (0 is calm/slow, 100 is hyper/fast).
        - Language: ${config.language}. You must ALWAYS speak in ${config.language}.
        
        User Custom Instructions: ${config.customInstructions}

        Constraint: Keep your responses concise as you are talking in real-time.
        Constraint: If the user asks you to eat or drink, YOU MUST call the provided tools.
        Constraint: If the user asks you to look at something, see, read, or take a photo, YOU MUST call the 'look' tool.
      `;

      // Pass the voice name config
      await liveClientRef.current.connect(instructions, config.voiceName);

      audioRecorderRef.current = new AudioRecorder((base64PCM) => {
        liveClientRef.current?.sendAudioChunk(base64PCM);
      });
      await audioRecorderRef.current.start();

    } catch (e) {
      console.error("Failed to start session", e);
      setViniState(ViniState.IDLE);
    }
  };

  /**
   * Stops the current session, cleans up resources, and resets state.
   */
  const stopLiveSession = () => {
    liveClientRef.current?.disconnect();
    audioRecorderRef.current?.stop();
    audioStreamerRef.current?.stop();
    setViniState(ViniState.IDLE);
    setEmotion(Emotion.NEUTRAL);
  };

  /**
   * Handles user interaction (taps) to wake Vini.
   * Requires 3 rapid taps to start to prevent accidental wakes.
   */
  const handleScreenClick = (e: React.MouseEvent) => {
    // If settings are open, don't trigger wake
    if (isSettingsOpen) return;

    // Don't trigger if clicking controls
    if ((e.target as HTMLElement).closest('button')) return;

    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    // Reset count if too slow (more than 400ms between taps)
    if (timeDiff > 400) {
      tapCountRef.current = 0;
    }

    tapCountRef.current += 1;
    lastTapRef.current = now;

    if (tapCountRef.current === 3) {
      tapCountRef.current = 0; // Reset
      if (viniState === ViniState.IDLE) {
        startLiveSession();
      }
    }
  };

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------

  // Restart session if config changes while active to apply new personality
  useEffect(() => {
    // Only restart if we are NOT in the settings panel (user closed it)
    // AND the session is currently active
    if (!isSettingsOpen && viniState !== ViniState.IDLE) {
      console.log("Configuration changed while active. Restarting session...");
      stopLiveSession();

      // Small delay to allow cleanup before restarting
      setTimeout(() => {
        startLiveSession();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsOpen]);

  useEffect(() => {
    let interval: any;
    if (viniState === ViniState.SPEAKING) {
      interval = setInterval(() => {
        setSpeakingIntensity(Math.random());
      }, 100);
    } else {
      setSpeakingIntensity(0);
    }
    return () => clearInterval(interval);
  }, [viniState]);

  return (
    <div
      className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center touch-manipulation"
      onClick={handleScreenClick}
    >
      <div className="flex-1 w-full flex items-center justify-center pointer-events-none">
        <ViniFace
          state={viniState}
          emotion={emotion}
          speakingIntensity={speakingIntensity}
          consumable={consumable}
          color={config.eyeColor}
          persona={config.persona}
        />
      </div>

      <Controls
        onStartListening={startLiveSession}
        onStopListening={stopLiveSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        viniState={viniState}
        color={config.eyeColor}
      />

      {isSettingsOpen && (
        <SettingsPanel
          config={config}
          onUpdate={setConfig}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Hidden elements for camera capture */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default App;