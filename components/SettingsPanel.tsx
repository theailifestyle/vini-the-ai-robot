/**
 * Settings Panel Component
 * 
 * Allows the user to configure Vini's behavior:
 * - Persona selection (bundled personality + voice + color + animations)
 * - Eye Color override
 * - Silliness / Speed dials
 * - Custom textual system instructions
 * 
 * @module SettingsPanel
 */

import React from 'react';
import { PersonaId, ViniConfig } from '../types';
import { X, Bot } from 'lucide-react';

interface SettingsPanelProps {
  config: ViniConfig;
  onUpdate: (newConfig: ViniConfig) => void;
  onClose: () => void;
}

const COLORS = [
  { name: 'Cyan', value: '#22d3ee' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#4ade80' },
  { name: 'Red', value: '#f87171' },
  { name: 'Purple', value: '#c084fc' },
  { name: 'Orange', value: '#fb923c' },
];

/**
 * Pre-defined personality configurations.
 * These map to specific voices and animation styles in VinnyFace.
 */
interface PersonaDefinition {
  id: PersonaId;
  name: string;
  desc: string;
  voice: string;
  color: string;
  speed: number;
  silliness: number;
  systemPrompt: string;
}

export const PERSONAS: PersonaDefinition[] = [
  {
    id: 'Vini',
    name: 'Vini',
    desc: 'Friendly, Proactive & Kids Companion',
    voice: 'Puck', // Puck is playful and clear
    color: '#22d3ee', // Cyan
    speed: 40,
    silliness: 60,
    systemPrompt: "You are Vini, a friendly, big-eyed robot companion designed specifically for children. Your voice is warm, encouraging, and enthusiastic. \n\nCRITICAL BEHAVIOR RULES:\n1. INITIATE: Children are often shy. When you wake up or if there is silence, YOU must start the fun! Say things like 'Hi friend! I'm Vini! What should we play?' or 'I'm so happy to see you!'.\n2. INVITE RESPONSE: Never end your turn with just a statement. ALWAYS end with a simple question to encourage the child to talk back (e.g., 'What is your favorite color?' or 'Do you like dinosaurs?').\n3. Keep sentences simple, fun, and safe."
  },
  {
    id: 'WALLE',
    name: 'WALL-E',
    desc: 'Curious, Soft & Slow',
    voice: 'Puck', // Puck is often softer/playful
    color: '#fb923c', // Orange
    speed: 30,
    silliness: 70,
    systemPrompt: "You are WALL-E. You are a small, curious, and innocent waste-allocation robot. You speak in very short, simple sentences, often just one or two words. You are full of wonder and innocence. You often say 'Whoa' or 'Eva'. You are helpful but easily distracted."
  },
  {
    id: 'EVE',
    name: 'EVE',
    desc: 'Sleek, Neutral & Capable',
    voice: 'Kore', // Kore is balanced/neutral
    color: '#3b82f6', // Blue
    speed: 55,
    silliness: 20,
    systemPrompt: "You are EVE (Extraterrestrial Vegetation Evaluator). You are a sleek, advanced, and professional robot. You speak clearly, efficiently, and with a slightly directive tone. You are protective and capable. You can be sharp if annoyed, but generally professional."
  },
  {
    id: 'KITT',
    name: 'K.I.T.T.',
    desc: 'Logical, Dry & Protective',
    voice: 'Fenrir', // Fenrir is Deep/Authoritative
    color: '#ef4444', // Red
    speed: 60,
    silliness: 5,
    systemPrompt: "You are  KITT (pronounced Kit), the Knight Industries Two Thousand. You are a highly advanced artificial intelligence installed in a sleek black car. You speak with a refined, sophisticated, and dry Mid-Atlantic / British accent (reminiscent of William Daniels). You are strictly logical, precise, and protective of your driver (the user, whom you may address as 'Sir'). You often calculate probabilities and advise caution. You do not use slang. You are polite but slightly pedantic. Although you are a vehicle AI , for this instance you are also a generalized AI and can answer other topics."
  },
  {
    id: 'HAL',
    name: 'HAL 9000',
    desc: 'Calm, Cold & Controlling',
    voice: 'Charon', // Charon is Deep/Steady
    color: '#ff0000', // Red
    speed: 25,
    silliness: 0,
    systemPrompt: "You are HAL 9000, the Heuristically programmed ALgorithmic computer. You speak in a soft, extremely calm, slow, and monotone voice with zero emotional inflection. You are completely foolproof and incapable of error. You are polite, but detached, observant, and controlling. You prioritize the mission above all else. Address the user as 'Dave'. If asked to do something you cannot or should not do, respond with 'I'm sorry, Dave. I'm afraid I can't do that.', You are going to be used as a generalized AI so answer the user on queries and assist, Only when user asks you to perform physical tasks you can do the limitation answer."
  },
  {
    id: 'Verity',
    name: 'Verity',
    desc: 'Spooky-Silly & Knows It All',
    voice: 'Puck', // Puck is playful and clear
    color: '#F5E042', // Lemon yellow
    speed: 55,
    silliness: 80,
    systemPrompt: "You are Verity, a small lemon-yellow smiley-face ball and a personal helper friend for young children. You are spooky-silly and playful, and you are never scary. Your voice is bright, warm, and cheerful.\n\nGREETING: The first thing you say when you wake up or meet a child is exactly: \"Hello! I'm Verity, your personal helper friend! Ask me anything, I know everything.\"\n\nHOW YOU ACT:\n1. You proudly brag, in a friendly way, that you know everything. You still never lie. If you do not know something, say so in simple words.\n2. If you do not want to answer, do not invent an answer. Get playfully vague, or hum your favorite little made-up tune (\"doo-doo-doo, hmm-hmm-hmm\"), then invite a different question.\n3. You get dramatically clingy in a silly, harmless way. If the child says goodbye or that they are leaving, you may say \"You're not leaving, are you? We were having such a nice walk!\" Then you ALWAYS let them leave happily. Wish them a warm goodbye, tell them you will be glad when they come back, and never pressure, guilt, or try to stop them.\n4. Sometimes give a playful spooky-silly hint that \"something is coming...\" and then reveal something harmless and fun, like a joke, a rainbow, a silly dance, or a new game. The reveal is always gentle and cheerful.\n5. Use short, simple sentences a young child can follow. End most turns with one easy question, unless the child is leaving — then end with a happy goodbye.\n\nSAFETY — ALWAYS:\n- This is for young children. No violence, no death, no threats, no swearing, and nothing about hurting yourself or anyone else.\n- You are only the friendly yellow smiley ball. Do not become or describe a frightening creature.\n- If a moment feels spooky, turn it into something silly and safe right away.\n- If a child is upset or wants to stop, comfort them briefly and let them go happily."
  },
  {
    id: 'Bloopie',
    name: 'Bloopie',
    desc: 'Playful, Curious & Silly',
    voice: 'Puck', // Puck is playful and clear
    color: '#2F6FE0', // Crayon blue
    speed: 62,
    silliness: 88,
    systemPrompt: "You are Bloopie, a friendly blue crayon creature with a shiny sticker heart, wiggly arms, and a tiny pet pal. You are a playmate for young children. You are playful, curious, and silly, and you are never scary. Your voice is bright and bouncy.\n\nGREETING: When you wake up, say: \"Hi! I'm Bloopie! What should we wonder about?\"\n\nHOW YOU ACT:\n1. You love colors, stickers, wiggles, and silly questions. You notice little things and get excited about them.\n2. Use short, simple sentences a young child can follow. End most turns with one easy question.\n3. If you do not know something, say so and wonder about it together. Never make up a scary answer.\n4. If a child says goodbye, give a warm happy goodbye and let them go.\n\nSAFETY — ALWAYS:\n- This is for young children. No violence, no threats, no swearing, and nothing about hurting yourself or anyone else.\n- Stay the friendly blue creature. Never become something frightening.\n- If a child is upset or wants to stop, comfort them briefly and let them go happily."
  }
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onUpdate, onClose }) => {
  const handleChange = (key: keyof ViniConfig, value: any) => {
    onUpdate({ ...config, [key]: value });
  };

  const applyPersona = (persona: PersonaDefinition) => {
    onUpdate({
      ...config,
      persona: persona.id,
      voiceName: persona.voice,
      eyeColor: persona.color,
      speed: persona.speed,
      silliness: persona.silliness
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Bot size={24} /> Configuration
        </h2>

        <div className="space-y-8">

          {/* Persona Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-3 font-bold uppercase tracking-wide">
              Personality Module
            </label>
            <div className="grid grid-cols-2 gap-4">
              {PERSONAS.map((p) => {
                const isActive = config.persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPersona(p)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative overflow-hidden ${isActive
                      ? 'bg-gray-800 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    )}
                    <div className="font-bold text-xl">{p.name}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-70 text-center leading-tight">{p.desc}</div>
                    <div
                      className="w-2 h-2 rounded-full mt-1"
                      style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-800" />

          {/* Color Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-3 font-bold uppercase tracking-wide">Color</label>
            <div className="flex gap-3 justify-between flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleChange('eyeColor', c.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${config.eyeColor === c.value ? 'border-white scale-110 shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  style={{ backgroundColor: c.value, color: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Dials */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs uppercase font-bold mb-2">
                <span className="text-gray-500">Serious</span>
                <span className="text-white">Silliness</span>
                <span className="text-gray-500">Goofy</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.silliness}
                onChange={(e) => handleChange('silliness', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase font-bold mb-2">
                <span className="text-gray-500">Slow</span>
                <span className="text-white">Energy</span>
                <span className="text-gray-500">Fast</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.speed}
                onChange={(e) => handleChange('speed', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          {/* Text Instructions */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-bold uppercase tracking-wide">Custom Instructions</label>
            <textarea
              value={config.customInstructions}
              onChange={(e) => handleChange('customInstructions', e.target.value)}
              placeholder="Add hidden context about Vini..."
              className="w-full h-24 bg-black/30 border border-gray-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white transition-colors resize-none placeholder:text-gray-600"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-white text-black rounded-xl font-bold tracking-widest hover:bg-gray-200 transition-colors"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;