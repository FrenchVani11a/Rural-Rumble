"use client";

import { useRef, useCallback } from "react";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

// ─── EAGLE: Crowd goes wild + triumphant fanfare ─────────
function playEagle(ctx: AudioContext) {
  // Crowd noise (white noise burst)
  const bufLen = ctx.sampleRate * 0.8;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.15;
  const crowd = ctx.createBufferSource();
  crowd.buffer = buf;
  const cg = ctx.createGain();
  cg.gain.setValueAtTime(0.2, ctx.currentTime);
  cg.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.3);
  cg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2000;
  bandpass.Q.value = 0.5;
  crowd.connect(bandpass).connect(cg).connect(ctx.destination);
  crowd.start();

  // Ascending fanfare over the top
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.35);
  });
}

// ─── BIRDIE: Slide whistle going up ─────────
function playBirdie(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
}

// ─── PAR: Quick "boing" spring sound ─────────
function playPar(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// ─── BOGEY: Short fart ─────────
function playBogey(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  // Low rumbling frequency with wobble
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.2);
  osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

  // Add some noise for texture
  const bufLen = ctx.sampleRate * 0.35;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.08;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.1, ctx.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 300;

  osc.connect(gain).connect(ctx.destination);
  noise.connect(lp).connect(ng).connect(ctx.destination);
  osc.start();
  noise.start();
  osc.stop(ctx.currentTime + 0.35);
}

// ─── DOUBLE BOGEY: Long wet fart + sad trombone ─────────
function playDouble(ctx: AudioContext) {
  // The fart
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(90, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.15);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
  osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
  gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.35);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);

  const bufLen = ctx.sampleRate * 0.55;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.12;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.12, ctx.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 250;

  osc.connect(gain).connect(ctx.destination);
  noise.connect(lp).connect(ng).connect(ctx.destination);
  osc.start();
  noise.start();
  osc.stop(ctx.currentTime + 0.55);

  // Sad trombone after
  const trom = ctx.createOscillator();
  const tg = ctx.createGain();
  trom.type = "sawtooth";
  trom.frequency.setValueAtTime(250, ctx.currentTime + 0.5);
  trom.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.9);
  tg.gain.setValueAtTime(0.1, ctx.currentTime + 0.5);
  tg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.95);
  trom.connect(tg).connect(ctx.destination);
  trom.start(ctx.currentTime + 0.5);
  trom.stop(ctx.currentTime + 0.95);
}

// ─── DISASTER: Explosive fart + comedy crash + toilet flush ─────────
function playDisaster(ctx: AudioContext) {
  // Big fart blast
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.2);
  osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
  osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.6);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

  // Heavy noise
  const bufLen = ctx.sampleRate * 0.6;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.2;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.15, ctx.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 200;

  osc.connect(gain).connect(ctx.destination);
  noise.connect(lp).connect(ng).connect(ctx.destination);
  osc.start();
  noise.start();
  osc.stop(ctx.currentTime + 0.6);

  // Slide whistle going down (comedy fail)
  const slide = ctx.createOscillator();
  const sg = ctx.createGain();
  slide.type = "sine";
  slide.frequency.setValueAtTime(900, ctx.currentTime + 0.5);
  slide.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.0);
  sg.gain.setValueAtTime(0.15, ctx.currentTime + 0.5);
  sg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
  slide.connect(sg).connect(ctx.destination);
  slide.start(ctx.currentTime + 0.5);
  slide.stop(ctx.currentTime + 1.0);

  // Splat at the end
  const splatLen = ctx.sampleRate * 0.15;
  const splatBuf = ctx.createBuffer(1, splatLen, ctx.sampleRate);
  const sd = splatBuf.getChannelData(0);
  for (let i = 0; i < splatLen; i++) sd[i] = (Math.random() * 2 - 1) * 0.3;
  const splat = ctx.createBufferSource();
  splat.buffer = splatBuf;
  const spg = ctx.createGain();
  spg.gain.setValueAtTime(0.2, ctx.currentTime + 0.95);
  spg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);
  splat.connect(spg).connect(ctx.destination);
  splat.start(ctx.currentTime + 0.95);
}

// ─── Random picker for variety ─────────

const bogeyVariants = [playBogey];
const doubleVariants = [playDouble];
const disasterVariants = [playDisaster];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playForScore = useCallback((gross: number, par: number) => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = getAudioContext();
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const play = () => {
      const diff = gross - par;
      if (diff <= -2) playEagle(ctx);
      else if (diff === -1) playBirdie(ctx);
      else if (diff === 0) playPar(ctx);
      else if (diff === 1) pickRandom(bogeyVariants)(ctx);
      else if (diff === 2) pickRandom(doubleVariants)(ctx);
      else pickRandom(disasterVariants)(ctx);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(play);
    } else {
      play();
    }
  }, []);

  return { playSoundForScore: playForScore };
}
