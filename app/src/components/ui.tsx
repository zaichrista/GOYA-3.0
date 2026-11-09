import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { EXERCISES } from '../data'
import { outfitArt } from '../goya'
import { sfx } from '../sfx'
import { useApp, XP_MAX } from '../store'
import './ui.css'

/** Typewriter effect for dialogue text. */
export function useTypewriter(text: string, speed = 28) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reduce) { setN(text.length); return }
    setN(0)
    const id = setInterval(() => setN((v) => {
      if (v >= text.length) { clearInterval(id); return v }
      if (text[v] !== ' ' && v % 2 === 0) sfx.blip(v)
      return v + 1
    }), speed)
    return () => clearInterval(id)
  }, [text, speed, reduce])
  return { shown: text.slice(0, n), done: n >= text.length }
}

export function DialogueBox({ name = 'GOYA', text, compact }: { name?: string; text: string; compact?: boolean }) {
  const { shown, done } = useTypewriter(text)
  return (
    <div className={`dialogue ${compact ? 'dialogue--compact' : ''}`} role="group" aria-label={`${name} says: ${text}`}>
      <div className="dialogue__plate" aria-hidden>{name}</div>
      <div className="dialogue__box" aria-hidden>
        {shown}
        {done && <span className="dialogue__caret">▼</span>}
      </div>
    </div>
  )
}

export function Button({ variant = 'primary', icon, children, onClick }: {
  variant?: 'primary' | 'secondary'; icon?: ReactNode; children: ReactNode; onClick?: () => void
}) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick}>
      {icon}{children}
    </button>
  )
}

export function ScreenHeader({ title, back, scene }: { title: string; back?: boolean; scene?: string }) {
  const nav = useNavigate()
  return (
    <div className={`header ${scene ? 'header--scene' : ''}`} style={scene ? { backgroundImage: `url(/scenes/${scene}.png)` } : undefined}>
      {back && <button className="icon-btn" aria-label="Back" style={{ position: 'absolute', left: 12, top: scene ? 50 : 8, zIndex: 2, background: 'rgba(14,6,20,.55)' }} onClick={() => nav(-1)}>⬅️</button>}
      <span className="header__title">{title}</span>
    </div>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}><div className="bar__fill" style={{ width: `${Math.round(value * 100)}%` }} /></div>
}

export function Checkbox({ on }: { on: boolean }) {
  return <span className={`check ${on ? 'is-on' : ''}`} aria-hidden>{on ? '✓' : ''}</span>
}

export function Chips({ items, active, onChange }: { items: string[]; active: string; onChange: (s: string) => void }) {
  return (
    <div className="chips">
      {items.map((i) => (
        <button key={i} aria-pressed={i === active} className={`chip ${i === active ? 'is-on' : ''}`} onClick={() => onChange(i)}>{i}</button>
      ))}
    </div>
  )
}

/** Small GOYA pose icon for an exercise (replaces the old emoji). */
export function ExIcon({ id, size = 28 }: { id: string; size?: number }) {
  const ex = EXERCISES[id]
  if (ex) return <span aria-hidden className="ex-icon" style={{ fontSize: size * 0.8, width: size, height: size, lineHeight: `${size}px`, display: 'inline-block', textAlign: 'center' }}>{ex.emoji}</span>
  return <img src={`/sprites/ex/${id}-icon.png`} alt="" aria-hidden width={size} height={size} className="ex-icon" style={{ width: size, height: size }} />
}

/** Pass a goya-avatar / goya-full / goya-home / goya-splash / goya-victory src and it swaps to the equipped outfit's art (see goya.ts). `outfit` previews a different one. */
export function Portrait({ src, style, outfit, fit }: { src?: string; style?: React.CSSProperties; outfit?: string; fit?: boolean }) {
  const equipped = useApp((s) => s.equipped.Outfits)
  const art = outfitArt(outfit ?? equipped)
  const kind = !src ? null : /goya-avatar\./.test(src) ? 'face' : /goya-(full|home|splash|victory)\./.test(src) ? 'body' : null
  const shown = kind ? art[kind] : src
  const [failed, setFailed] = useState<string>()
  const broken = !shown || failed === shown
  return (
    <div className={`portrait ${kind === 'body' ? 'portrait--body' : ''} ${fit ? 'portrait--fit' : ''}`} style={style}>
      {!broken && <img src={shown} alt="Goya" onError={() => setFailed(shown)} />}
      {broken && <><span className="portrait__ph">G</span><span className="portrait__tag">sprite placeholder</span></>}
    </div>
  )
}

const TABS = [
  { to: '/home', icon: '🏠', label: 'Home' },
  { to: '/map', icon: '🗺️', label: 'Map' },
  { to: '/library', icon: '📚', label: 'Library' },
  { to: '/progress', icon: '📊', label: 'Progress' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]
export function NavBar() {
  return (
    <nav className="nav" aria-label="Main">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `nav__item ${isActive ? 'is-on' : ''}`}>
          <span className="nav__icon" aria-hidden>{t.icon}</span><span className="nav__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function Burst({ text, sound }: { text: string; sound?: 'impact' | 'caseClosed' }) {
  useEffect(() => { if (sound) sfx[sound]() }, [sound])
  return (
    <div className="burst" style={{ width: 280, height: 150 }}>
      <div className="burst__shape" />
      <div className="burst__text">{text}</div>
    </div>
  )
}

/** Streak / level / crowns strip: the always-visible reward readout. */
export function Hud({ inline }: { inline?: boolean }) {
  const { streak, level, xp, crowns } = useApp()
  return (
    <div className={`hud ${inline ? 'hud--inline' : ''}`}>
      <span aria-label={`${streak} day streak`}>🔥 {streak}</span>
      <span className="hud__lv" aria-label={`Level ${level}`}><b>Lv {level}</b><ProgressBar value={xp / XP_MAX} /></span>
      <span aria-label={`${crowns} crowns`}>👑 {crowns}</span>
    </div>
  )
}

export function useCountUp(target: number, ms = 900, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0, start = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setV(target); return }
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, Math.max(0, (t - start - delay) / ms))
      setV(Math.round(target * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, delay])
  return v
}

const COLORS = ['#ff3f8e', '#ffc63d', '#d6b4e0', '#fde8d9', '#ffffff']
export function Confetti({ count = 40 }: { count?: number }) {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{
          left: `${(i * 37) % 100}%`, background: COLORS[i % COLORS.length],
          animationDelay: `${(i % 10) * 0.12}s`, animationDuration: `${1.8 + (i % 7) * 0.25}s`,
          ['--drift' as string]: `${((i * 53) % 80) - 40}px`,
        }} />
      ))}
    </div>
  )
}

export function Stars({ n, size = 44 }: { n: number; size?: number }) {
  useEffect(() => {
    const ts = Array.from({ length: n }, (_, i) => setTimeout(() => sfx.star(i), 400 + (i + 1) * 350))
    return () => ts.forEach(clearTimeout)
  }, [n])
  return (
    <div className="stars" role="img" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'star star--on' : 'star'} style={{ fontSize: size, animationDelay: `${0.4 + i * 0.35}s` }} aria-hidden>⭐</span>
      ))}
    </div>
  )
}

/** Full-screen "OBJECTION!"-style flash. Parent controls when it mounts (give it a changing `key`). */
export function Callout({ text }: { text: string }) {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 1100); return () => clearTimeout(t) }, [])
  if (!show) return null
  return (
    <div className="callout" aria-hidden>
      <div className="callout__flash" />
      <div className="callout__text">{text}</div>
    </div>
  )
}
