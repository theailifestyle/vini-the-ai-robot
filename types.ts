export enum ViniState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  EATING = 'EATING',
  LOOKING = 'LOOKING',
}

export enum Emotion {
  NEUTRAL = 'NEUTRAL',
  HAPPY = 'HAPPY',
  CONFUSED = 'CONFUSED',
  BLINK = 'BLINK',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FoodItem {
  emoji: string;
  name: string;
}

export interface ViniConfig {
  eyeColor: string;
  silliness: number; // 0-100
  speed: number; // 0-100
  customInstructions: string;
  voiceName: string;
  language: string;
  persona: 'Vini' | 'WALLE' | 'EVE' | 'KITT' | 'HAL';
}