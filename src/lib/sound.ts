"use client";

import { useEffect, useRef } from 'react';

class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private backgroundMusic: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private musicSource: MediaElementAudioSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private isPlaying = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Create AudioContext
      const audioContextCtor =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      this.audioContext = audioContextCtor
        ? new audioContextCtor()
        : null;

      // Initialize sounds
      this.sounds = {
        hover: new Audio('/garden/hover.wav'),
        click: new Audio('/garden/click.wav'),
        transition: new Audio('/garden/transition.wav'),
      };

      // Initialize background music
      this.backgroundMusic = new Audio('/garden/ambient.wav');
      if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
      }

      // Set all sound volumes
      Object.values(this.sounds).forEach(sound => {
        sound.volume = 0.2;
      });

      // Create audio nodes
      if (this.audioContext && this.backgroundMusic) {
        this.musicSource = this.audioContext.createMediaElementSource(this.backgroundMusic);
        this.filterNode = this.audioContext.createBiquadFilter();
        this.gainNode = this.audioContext.createGain();

        // Configure filter
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 20000; // Default to no filtering
        
        // Set up audio graph
        this.musicSource
          .connect(this.filterNode)
          .connect(this.gainNode)
          .connect(this.audioContext.destination);

        // Set initial volume
        this.gainNode.gain.value = 0.3;
      }

      // Resume audio context on user interaction
      const resumeAudioContext = () => {
        if (this.audioContext?.state === 'suspended') {
          this.audioContext.resume();
        }
      };

      window.addEventListener('click', resumeAudioContext);
      window.addEventListener('touchstart', resumeAudioContext);
      window.addEventListener('keydown', resumeAudioContext);
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Resume audio context if suspended
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Preload all sounds
      await Promise.all([
        ...Object.values(this.sounds).map(sound => sound.load()),
        this.backgroundMusic?.load(),
      ]);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize sounds:', error);
    }
  }

  private async ensureAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public async playHover() {
    await this.ensureAudioContext();
    this.sounds.hover?.play().catch(() => {});
  }

  public async playClick() {
    await this.ensureAudioContext();
    this.sounds.click?.play().catch(() => {});
  }

  public async playTransition() {
    await this.ensureAudioContext();
    this.sounds.transition?.play().catch(() => {});
  }

  public async applyHighCutFilter() {
    if (this.filterNode) {
      this.filterNode.frequency.setTargetAtTime(800, this.audioContext!.currentTime, 0.3);
    }
  }

  public async removeHighCutFilter() {
    if (this.filterNode) {
      this.filterNode.frequency.setTargetAtTime(20000, this.audioContext!.currentTime, 0.3);
    }
  }

  public async toggleBackgroundMusic() {
    if (this.backgroundMusic) {
      try {
        await this.ensureAudioContext();
        if (this.isPlaying) {
          this.backgroundMusic.pause();
        } else {
          await this.backgroundMusic.play();
        }
        this.isPlaying = !this.isPlaying;
      } catch (error) {
        console.error('Failed to toggle background music:', error);
      }
    }
  }

  public async startBackgroundMusic() {
    if (this.backgroundMusic) {
      try {
        await this.ensureAudioContext();
        await this.backgroundMusic.play();
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to play background music:', error);
      }
    }
  }

  public async stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isPlaying = false;
    }
  }

  public isBackgroundMusicPlaying(): boolean {
    return this.isPlaying;
  }

  public cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.isPlaying = false;
    this.isInitialized = false;
  }
}

// React hook for using sound manager
export const useSoundManager = (): SoundManager => {
  const soundManager = useRef<SoundManager>(SoundManager.getInstance());

  useEffect(() => {
    soundManager.current.initialize();
    
    // Store reference to current sound manager for cleanup
    const currentSoundManager = soundManager.current;
    
    return () => {
      currentSoundManager.cleanup();
    };
  }, []);

  return soundManager.current;
}

export default SoundManager.getInstance(); 