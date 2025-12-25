/**
 * Audio Service
 * 
 * Provides utilities for:
 * 1. AudioStreamer: Queues and plays PCM16 audio chunks from the API.
 * 2. AudioRecorder: Captures microphone input and converts it to PCM16.
 * 
 * @module AudioService
 */

/**
 * Handles playing back the raw PCM16 audio stream from the model.
 * Uses the Web Audio API to schedule chunks precisely for smooth playback.
 */
export class AudioStreamer {
  public audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private nextStartTime = 0;
  private isPlaying = false;

  constructor() {
    // Let browser pick the best sample rate (usually 44.1k or 48k)
    // Forcing 24k in constructor can break on some hardware/browsers
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();

    // Add a gain node for volume control if needed
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1.0;
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * Decodes Base64 PCM16 audio and schedules it for playback.
   */
  async playPCM16(base64Audio: string, onEnded?: () => void) {
    if (!this.audioContext || !this.gainNode) return;

    // Ensure context is running (needed for Chrome autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // 1. Decode Base64 to binary
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;

    // Ensure even length for Int16
    const padding = len % 2;
    const bytes = new Uint8Array(len + padding);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Convert PCM16 (Int16) to Float32
    // Gemini output is Little Endian 16-bit PCM
    const dataInt16 = new Int16Array(bytes.buffer);

    // Gemini 2.5 Flash Native Audio is 24kHz
    const sourceSampleRate = 24000;

    // Create buffer at the SOURCE sample rate. 
    // Web Audio API handles resampling to the context's rate automatically.
    const buffer = this.audioContext.createBuffer(1, dataInt16.length, sourceSampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < dataInt16.length; i++) {
      // Normalize Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i] / 32768.0;
    }

    // 3. Schedule Playback
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);

    const currentTime = this.audioContext.currentTime;

    // If nextStartTime is in the past (underrun), reset to now + small buffer
    // This prevents silence if the stream lags
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime + 0.05; // 50ms buffer for smooth start
    }

    source.start(this.nextStartTime);

    // Advance time cursor
    this.nextStartTime += buffer.duration;
    this.isPlaying = true;

    source.onended = () => {
      // Check if we have caught up
      if (this.audioContext && this.audioContext.currentTime >= this.nextStartTime - 0.1) {
        this.isPlaying = false;
        if (onEnded) onEnded();
      }
    };
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * Captures microphone input for the API.
 * Converts Web Audio Float32 to PCM16 Base64.
 */
export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onData: (base64PCM: string) => void) { }

  async start() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass({ sampleRate: 16000 });

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    // Lower buffer size for lower latency (2048 @ 16k ~= 128ms)
    // 4096 was ~256ms which is a bit sluggish for "real-time"
    this.processor = this.audioContext.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const b64 = this.float32ToPCM16Base64(inputData);
      this.onData(b64);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  stop() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.processor) this.processor.disconnect();
    if (this.source) this.source.disconnect();
    if (this.audioContext) this.audioContext.close();
  }

  private float32ToPCM16Base64(float32: Float32Array): string {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}