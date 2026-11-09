import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Burst, Callout, DialogueBox, ExIcon, Portrait, ProgressBar } from '../components/ui'
import { EXERCISES, LINES, fmt, getWorkout, pick, restAfter, spriteFrames, type Workout } from '../data'
import { ANIM_SEQUENCE, animFrames, animMs } from '../exerciseAnim'
import { sfx } from '../sfx'
import { useApp } from '../store'
import './screens.css'

export default function WorkoutSessionGate() {
  const { id } = useParams()
  const w = getWorkout(id)
  return w ? <Session w={w} /> : <Navigate to="/library" replace />
}

/** Active set (screen 07) + rest (screen 08). Add ?speed=5 to the URL to test quickly. */
function Session({ w }: { w: Workout }) {
  const nav = useNavigate()
  const finish = useApp((s) => s.finishWorkout)
  const speed = Number(new URLSearchParams(location.search).get('speed')) || 1
  const n = w.steps.length, last = n - 1
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'work' | 'rest'>('work')
  const [left, setLeft] = useState(w.steps[0].secs)
  const [paused, setPaused] = useState(false)
  const [xp, setXp] = useState(0)
  const [pop, setPop] = useState<{ key: number; word: string } | null>(null)
  const [callout, setCallout] = useState<{ key: number; text: string } | null>(null)
  const [frame, setFrame] = useState(0)
  const [step, setStep] = useState(0)
  const skips = useRef(0)

  const startWork = (i: number) => { setIdx(i); setPhase('work'); setLeft(w.steps[i].secs) }
  const end = () => { finish(w, skips.current); nav('/workout/complete', { replace: true }) }
  const cheer = (i: number) => { setXp((x) => x + 10); setPop({ key: Date.now(), word: pick(LINES.nice, i) }); sfx.good() }

  // Voice + flash moments: start, halfway, last move. Sounds for each move/rest start.
  useEffect(() => {
    if (phase !== 'work') return
    const flash = (text: string, play: () => void) => { setCallout({ key: Date.now(), text }); play() }
    if (idx === 0) flash('OBJECTION!', sfx.objection)
    else if (idx === last) flash('TAKE THAT!', sfx.takeThat)
    else if (n >= 4 && idx === Math.floor(n / 2)) flash('HOLD IT!', sfx.holdIt)
    else sfx.go()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, phase])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setLeft((l) => l - 1), 1000 / speed)
    return () => clearInterval(t)
  }, [paused, speed])

  // Alternate the two pose frames of the current move (a little faster on high-intensity speed-ups).
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setFrame((f) => 1 - f), 500 / speed)
    return () => clearInterval(t)
  }, [paused, speed])

  // Dataset SVG animation: frames play in the order [0,1,2,1] at the exercise's own frame time.
  const curId = w.steps[idx].ex
  useEffect(() => {
    if (paused || !animFrames(curId)) return
    setStep(0)
    const t = setInterval(() => setStep((i) => (i + 1) % ANIM_SEQUENCE.length), animMs(curId) / speed)
    return () => clearInterval(t)
  }, [paused, speed, curId])

  useEffect(() => {
    if (left > 0) { if (phase === 'work' && left <= 3) sfx.tick(); return }
    if (phase === 'work') {
      cheer(idx)
      if (idx === last) end()
      else if (restAfter(w, idx) > 0) { setPhase('rest'); setLeft(restAfter(w, idx)) }
      else startWork(idx + 1)
    } else startWork(idx + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const ex = EXERCISES[w.steps[idx].ex]
  const nextEx = idx < last ? EXERCISES[w.steps[idx + 1].ex] : null
  const resting = phase === 'rest'
  const total = resting ? restAfter(w, idx) : w.steps[idx].secs
  const round = w.rounds ? Math.floor(idx / w.groupSize) + 1 : 0
  const line = resting ? pick(LINES.rest, idx)
    : idx === last && n > 1 ? pick(LINES.last, idx)
    : idx === Math.floor(n / 2) && n >= 4 ? pick(LINES.mid, idx)
    : pick(LINES.work, idx + n)

  const skip = () => { if (resting) startWork(idx + 1); else { skips.current++; sfx.nope(); if (idx === last) end(); else startWork(idx + 1) } }

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      {callout && <Callout key={callout.key} text={callout.text} />}
      <div className="row" style={{ padding: '2px 14px' }}>
        <button className="icon-btn" aria-label="Quit workout" onClick={() => nav(-1)}>⬅️</button>
        <div className="display" style={{ fontSize: 15, textAlign: 'center', lineHeight: 1.1 }}>{w.title}{round > 0 && <><br /><span style={{ color: 'var(--secondary)', fontSize: 13 }}>Round {round} / {w.rounds}</span></>}</div>
        <div className="display" style={{ color: 'var(--gold)', fontSize: 16, minWidth: 44, textAlign: 'right' }} aria-label={`${xp} XP`}>⭐ {xp}</div>
      </div>
      <div className="segs" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={idx} aria-label="Workout progress">
        {w.steps.map((_, i) => <span key={i} className={`seg ${i < idx || (i === idx && resting) ? 'seg--done' : i === idx ? 'seg--now' : ''}`} />)}
      </div>

      {resting ? (
        <div className="stage stage--rest">
          <div style={{ display: 'grid', placeItems: 'center' }}><Burst text="BREAK!" sound="impact" /></div>
          {nextEx && <div className="stage__cue">Up next: <ExIcon id={w.steps[idx + 1].ex} size={22} /> {nextEx.name}</div>}
        </div>
      ) : (
        <div className="stage stage--work">
          {animFrames(curId) ? (
            <div className="stage__anim" key={idx} role="img" aria-label={`${ex.name} demonstration`}>
              {animFrames(curId)!.map((src, i) => <img key={src} src={src} alt="" style={{ display: ANIM_SEQUENCE[step] === i ? 'block' : 'none' }} />)}
            </div>
          ) : (
            <div className={`stage__emoji ${ex.sprite ? 'stage__emoji--pose' : ''}`} key={idx} aria-hidden>
              {ex.sprite ? spriteFrames(ex).map((src, i) => <img key={src} src={src} alt="" className="pixelated" style={{ display: frame === i ? 'block' : 'none' }} />) : ex.emoji}
            </div>
          )}
          <div className="stage__cue">{ex.cue}</div>
          {pop && <div className="nice-pop" key={pop.key} aria-hidden>{pop.word}</div>}
        </div>
      )}

      <div className="goya-row">
        <Portrait src="/sprites/goya-avatar.png" />
        <DialogueBox compact text={line} />
      </div>

      <div style={{ padding: '10px 18px 0' }}>
        {!resting && <div className="pill" style={{ marginBottom: 2 }}>{ex.name}</div>}
        <div className={`timer ${!resting && left <= 3 ? 'timer--hot' : ''}`} style={{ fontSize: 56 }} role="timer" aria-label={`${resting ? 'Rest' : 'Work'}, ${Math.max(left, 0)} seconds left`}>
          {resting && <span style={{ fontSize: 20 }}>Rest </span>}{fmt(Math.max(left, 0))}
        </div>
        <ProgressBar value={1 - left / total} />
      </div>

      <div className="ctrl" style={{ paddingTop: 10, paddingBottom: 16 }}>
        <button className="btn btn--primary" aria-label={paused ? 'Resume' : 'Pause'} onClick={() => setPaused((p) => !p)}>{paused ? '▶️' : '⏸️'}</button>
        <button className="btn btn--secondary" style={{ width: 130 }} onClick={skip}>{resting ? 'Skip rest ⏭️' : 'Skip ⏭️'}</button>
      </div>
    </div>
  )
}
