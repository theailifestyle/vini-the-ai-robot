/**
 * Gemini Multimodal Live API Service
 * 
 * Handles the WebSocket connection to Google's Gemini API for real-time
 * voice and video interaction.
 * 
 * @module GeminiService
 */

import { GoogleGenAI, FunctionDeclaration, Type, Modality, LiveServerMessage } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");
  return new GoogleGenAI({ apiKey });
};

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const eatTool: FunctionDeclaration = {
  name: 'eat',
  description: 'Call this when the user asks Vini to eat something.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      food: { type: Type.STRING },
    },
    required: ['food'],
  },
};

const drinkTool: FunctionDeclaration = {
  name: 'drink',
  description: 'Call this when the user asks Vini to drink something.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      beverage: { type: Type.STRING },
    },
    required: ['beverage'],
  },
};

const lookTool: FunctionDeclaration = {
  name: 'look',
  description: 'Call this when the user asks Vini to see, look at, read, or analyze something using the camera. IMPORTANT: After calling this tool, wait a moment before describing what you see. The image will appear in your visual context shortly after the tool completes.',
};

// ============================================================================
// CLIENT CLASS
// ============================================================================

/**
 * Manages the "Live" session with Gemini.
 * Handles audio I/O streaming and tool execution.
 */
export class ViniLiveClient {
  private session: any = null;
  private ai = getClient();

  constructor(
    private onAudioData: (base64: string) => void,
    private onToolCall: (name: string, args: any) => Promise<any>
  ) { }

  /**
   * Connects to the Gemini Live API.
   * @param systemInstructionText - The system prompt for the persona.
   * @param voiceName - The voice configuration name.
   */
  async connect(systemInstructionText: string, voiceName: string) {
    // gemini-2.5-flash-native-audio-preview-09-2025 supports low latency voice
    this.session = await this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => console.log('Vini connected'),
        onmessage: async (msg: LiveServerMessage) => this.handleMessage(msg),
        onclose: () => console.log('Vini disconnected'),
        onerror: (e) => console.error('Vini error:', e),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
        },
        systemInstruction: {
          parts: [{
            text: systemInstructionText
          }]
        },
        tools: [{ functionDeclarations: [eatTool, drinkTool, lookTool] }],
      },
    });
  }

  /**
   * Sends audio chunks (PCM16) to the model.
   * @param base64PCM - Base64 encoded PCM16 audio data.
   */
  async sendAudioChunk(base64PCM: string) {
    if (!this.session) return;
    await this.session.sendRealtimeInput({
      media: {
        mimeType: 'audio/pcm;rate=16000',
        data: base64PCM
      }
    });
  }

  async sendImage(base64Image: string) {
    if (!this.session) return;
    await this.session.sendRealtimeInput({
      media: {
        mimeType: 'image/jpeg',
        data: base64Image
      }
    });
  }

  /**
   * Handles incoming messages from the server (Audio or Tool Calls).
   */
  private async handleMessage(msg: LiveServerMessage) {
    // Handle Audio
    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      this.onAudioData(audioData);
    }

    // Handle Tools
    const toolCall = msg.toolCall;
    if (toolCall) {
      for (const call of toolCall.functionCalls) {
        // Execute the tool locally (trigger animation)
        const result = await this.onToolCall(call.name, call.args);

        // Send response back to model
        await this.session.sendToolResponse({
          functionResponses: {
            id: call.id,
            name: call.name,
            response: { result: JSON.stringify(result) }
          }
        });
      }
    }
  }

  disconnect() {
    this.session = null;
  }
}