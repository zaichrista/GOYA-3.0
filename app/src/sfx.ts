import { useApp } from './store'

/* All sounds are synthesized (Web Audio) so there are no audio files to ship.
   Shouts ("OBJECTION!") use the browser's speech synthesis on top of a chiptune stinger. */

let ctx: AudioContext | null = null
const audio = () => {
  if (useApp.getState().muted) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch { return null }
}

function tone(freq: number, dur: number, delay = 0, type: OscillatorType = 'square', vol = 0.05, slideTo?: number) {
  const c = audio(); if (!c) return
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + delay
  o.type = type; o.frequency.setValueAtTime(freq, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.02)
}
function noise(dur: number, delay = 0, vol = 0.12) {
  const c = audio(); if (!c) return
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = c.createBufferSource(), g = c.createGain(), t = c.currentTime + delay
  src.buffer = buf; g.gain.value = vol
  src.connect(g).connect(c.destination); src.start(t)
}
const run = (notes: number[], step = 0.1, dur = 0.16, type: OscillatorType = 'square', vol = 0.05) =>
  notes.forEach((f, i) => tone(f, dur, i * step, type, vol))

export const buzz = (ms = 30) => { if (!useApp.getState().muted) navigator.vibrate?.(ms) }

/** Shouted voice line via speech synthesis (e.g. "Objection!"). */
export function shout(text: string) {
  if (useApp.getState().muted || !('speechSynthesis' in window)) return
  try {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1.1; u.pitch = 1.5; u.volume = 1
    const voices = synth.getVoices().filter((v) => /^en/i.test(v.lang))
    u.voice = voices.find((v) => /samantha|zira|female|aria|google uk english female/i.test(v.name)) ?? voices[0] ?? null
    synth.speak(u)
  } catch { /* speech unavailable: the stinger still plays */ }
}

export const sfx = {
  tap: () => tone(880, 0.04, 0, 'square', 0.03),
  nav: () => { tone(520, 0.05, 0, 'triangle', 0.06); tone(780, 0.07, 0.04, 'triangle', 0.06) },
  /** Ace-Attorney-style text blip; pitch varies slightly per letter. */
  blip: (i = 0) => tone(i % 2 ? 330 : 360, 0.03, 0, 'square', 0.018),
  tick: () => tone(740, 0.07, 0, 'square', 0.05),
  go: () => run([392, 587, 784], 0.06, 0.1),
  rest: () => tone(520, 0.3, 0, 'triangle', 0.07, 260),
  good: () => { run([523, 784], 0.09, 0.12); buzz(40) },
  coin: () => { run([988, 1319], 0.07, 0.16); buzz(20) },
  star: (n: number) => { tone(523 * 2 ** (n / 6), 0.18, 0, 'square', 0.06); buzz(25) },
  /** The big "!" hit used by objection / break / case closed. */
  impact: () => { noise(0.25, 0, 0.16); tone(110, 0.3, 0, 'sawtooth', 0.12, 45); tone(880, 0.12, 0.02, 'square', 0.05); buzz(80) },
  objection: () => { sfx.impact(); run([784, 988, 1175], 0.07, 0.1); shout('Objection!') },
  holdIt: () => { sfx.impact(); shout('Hold it!') },
  takeThat: () => { sfx.impact(); run([659, 784, 1047], 0.07, 0.1); shout('Take that!') },
  caseClosed: () => { sfx.impact(); run([523, 659, 784, 1047, 784, 1047, 1319], 0.1, 0.18); shout('Case closed!') },
  win: () => { run([523, 659, 784, 1047, 1319], 0.11); buzz(120) },
  level: () => run([392, 523, 659, 784, 1047, 1319, 1568], 0.08, 0.14, 'square', 0.055),
  unlock: () => { run([392, 523, 659, 784, 1047, 1319], 0.09); buzz(200) },
  nope: () => { run([196, 147], 0.1, 0.14); buzz(60) },
}
