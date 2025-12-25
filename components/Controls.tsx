/**
 * Controls Component
 * 
 * Floating UI controls for user interaction:
 * - Power Button (Start/Stop Session)
 * - Settings Toggle
 * 
 * @module Controls
 */

import React from 'react';
import { Power, Settings } from 'lucide-react';
import { ViniState } from '../types';

interface ControlsProps {
  onStartListening: () => void;
  onStopListening: () => void;
  onOpenSettings: () => void;
  viniState: ViniState;
  color: string;
}

const Controls: React.FC<ControlsProps> = ({
  onStartListening,
  onStopListening,
  onOpenSettings,
  viniState,
  color
}) => {
  const isConnected = viniState !== ViniState.IDLE;

  const toggleConnection = () => {
    if (isConnected) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-center gap-3 md:gap-4">

      {/* Power Button */}
      <button
        onClick={toggleConnection}
        className={`p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${isConnected
          ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-green-400'
          : 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-500'
          }`}
        title={isConnected ? "Turn Off" : "Turn On"}
      >
        <Power className={`w-5 h-5 md:w-6 md:h-6 ${isConnected ? "animate-pulse" : ""}`} />
      </button>

      {/* Settings Button */}
      <button
        onClick={onOpenSettings}
        className="p-2 md:p-2.5 rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 backdrop-blur-sm transition-colors border border-white/10 shadow-md"
        title="Settings"
      >
        <Settings className="w-4 h-4 md:w-5 md:h-5" />
      </button>

    </div>
  );
};

export default Controls;