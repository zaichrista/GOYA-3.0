import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Hud, NavBar, ProgressBar } from '../components/ui'
import { ALL_STAGES, NODES_PER_WORLD, WORLDS, kcalOf, minutesOf, partsDone, stageCleared, stageStars, type Stage } from '../data'
import map from '../mapNodes.json'
import { useApp } from '../store'
import './screens.css'


/** Segmented wheel around a stage node: one arc per workout in the stage. */
function Ring({ total, done, active }: { total: number; done: number; active: boolean }) {
  const R = 46, C = 2 * Math.PI * R, seg = C / total, gap = total === 1 ? 0 : 12
  const arc = (k: number, w: number, color: string) => (
    <circle key={`${k}-${w}`} cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth={w}
      strokeDasharray={`${Math.max(seg - gap, 1)} ${C}`} strokeDashoffset={-(k * seg + gap / 2)} transform="rotate(-90 50 50)" />
  )
  return (
    <svg className="node__ring" viewBox="0 0 100 100" aria-hidden>
      {Array.from({ length: total }, (_, k) => arc(k, 9, 'rgba(14,6,20,.75)'))}
      {Array.from({ length: total }, (_, k) => arc(k, 6, k < done ? '#ffc63d' : active && k === done ? '#ff3f8e' : '#8d7a98'))}
    </svg>
  )
}

/** Heroic overworld: /scenes/map-v2.png is drawn by art/map.py, which also exports map.nodes (0..1 coords). */
export default function MapScreen() {
  const s = useApp()
  const goRef = useRef<HTMLButtonElement>(null)
  const [sel, setSel] = useState<{ wi: number; i: number } | null>(null)

  useEffect(() => { goRef.current?.scrollIntoView({ block: 'center' }) }, [])
  let firstGo = true

  return (
    <>
      <div className="screen">
        <Hud />
        <div className="overworld" style={{ aspectRatio: `1 / ${map.aspect}` }}>
          <img className="overworld__img pixelated" src="/scenes/map-v2.png" alt="" />

          {WORLDS.map((wd, wi) => {
            const open = s.workouts >= wd.unlockAt
            const reg = map.regions[wi]
            const nodes = ALL_STAGES[wi]
            const cleared = nodes.filter((n) => stageCleared(n, s.completed)).length
            const cur = nodes.findIndex((n) => !stageCleared(n, s.completed))
            return (
              <div key={wd.id}>
                {!open && <div className="region-tint" style={{ top: `${reg.top * 100}%`, height: `${(reg.bottom - reg.top) * 100}%` }} />}
                <div className="region-label" style={{ top: `${(wi === 4 ? reg.top + 0.004 : reg.top - 0.002) * 100}%` }}>
                  <div className="display region-label__name">{open ? wd.emoji : '🔒'} World {wi + 1} · {wd.name}</div>
                  {open ? (
                    <div className="region-label__sub">⭐ {cleared}/{NODES_PER_WORLD} cleared</div>
                  ) : (
                    <>
                      <div className="region-label__sub">Unlocks at {wd.unlockAt} workouts · {s.workouts}/{wd.unlockAt}</div>
                      <ProgressBar value={Math.min(1, s.workouts / wd.unlockAt)} />
                    </>
                  )}
                </div>

                {nodes.map((n, i) => {
                  const done = stageCleared(n, s.completed)
                  const got = partsDone(n, s.completed)
                  const go = open && i === cur
                  const state = done ? 'done' : go ? 'go' : 'locked'
                  const isFirstGo = go && firstGo
                  if (go) firstGo = false
                  const pos = map.nodes[wi][i]
                  const stars = done ? stageStars(n, s.completed) : 0
                  return (
                    <button
                      key={n.id}
                      ref={isFirstGo ? goRef : undefined}
                      className={`node node--${state} ${n.boss ? 'node--boss' : ''}`}
                      style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
                      aria-label={`${n.title}, ${state === 'locked' ? 'locked' : state === 'done' ? `cleared, ${stars} stars` : `${got} of ${n.parts.length} workouts done`}`}
                      onClick={() => { setSel({ wi, i }) }}
                    >
                      <Ring total={n.parts.length} done={got} active={go} />
                      <span aria-hidden>{n.emoji}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      {sel && <StageSheet stage={ALL_STAGES[sel.wi][sel.i]} wi={sel.wi} onClose={() => setSel(null)} />}
      <NavBar />
    </>
  )
}

function StageSheet({ stage, wi, onClose }: { stage: Stage; wi: number; onClose: () => void }) {
  const nav = useNavigate()
  const completed = useApp((s) => s.completed)
  const workouts = useApp((s) => s.workouts)
  const wd = WORLDS[wi]
  const idx = ALL_STAGES[wi].indexOf(stage)
  const open = workouts >= wd.unlockAt
  const prevCleared = idx === 0 || stageCleared(ALL_STAGES[wi][idx - 1], completed)
  const unlocked = open && prevCleared
  const got = partsDone(stage, completed)
  const cleared = got === stage.parts.length
  const nextIdx = stage.parts.findIndex((p) => !completed[p.id])
  const lockMsg = !open ? `Reach ${wd.unlockAt} workouts to unlock World ${wi + 1}.` : 'Clear the earlier stage first.'
  return (
    <div className="sheet" onClick={onClose}>
      <div className="sheet__panel" role="dialog" aria-label={stage.title} onClick={(e) => e.stopPropagation()}>
        <button className="sheet__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="sheet__head">
          <div className="sheet__emoji" aria-hidden>{unlocked ? stage.emoji : '🔒'}</div>
          <div>
            <div className="card__sub">World {wi + 1} · {wd.name}</div>
            <h2 className="display sheet__title">{stage.title}</h2>
            <div className="card__sub">{stage.boss ? 'Boss stage · ' : ''}{cleared ? `Cleared ${'⭐'.repeat(stageStars(stage, completed))}` : `${got}/${stage.parts.length} workouts done`}</div>
          </div>
        </div>
        <div className="sheet__list">
          {stage.parts.map((p, k) => {
            const c = completed[p.id]
            const playable = unlocked && (!!c || k === nextIdx)
            return (
              <button key={p.id} className={`sheet__row ${c ? 'is-done' : ''} ${k === nextIdx && unlocked ? 'is-next' : ''}`}
                disabled={!playable} onClick={() => nav(`/workout/${p.id}`)}>
                <span className="sheet__num">{c ? '✓' : k + 1}</span>
                <span className="sheet__name">Workout {k + 1}{p.boss ? ' · Final' : ''}
                  <small>{p.rounds} rounds · {minutesOf(p)} min · ~{kcalOf(p)} kcal</small></span>
                <span>{c ? '⭐'.repeat(c.stars) : playable ? '▶' : '🔒'}</span>
              </button>
            )
          })}
        </div>
        {unlocked
          ? <Button icon="▶️" onClick={() => nav(`/workout/${stage.parts[nextIdx === -1 ? 0 : nextIdx].id}`)}>{cleared ? 'Replay first workout' : got ? 'Continue stage' : 'Start stage'}</Button>
          : <div className="sheet__lock">{lockMsg}</div>}
      </div>
    </div>
  )
}
