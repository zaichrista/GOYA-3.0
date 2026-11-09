import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, ExIcon, ScreenHeader } from '../components/ui'
import { EXERCISES, getWorkout, kcalOf, minutesOf, restAfter } from '../data'
import { useApp } from '../store'
import './screens.css'

export default function WorkoutPreview() {
  const { id } = useParams()
  const nav = useNavigate()
  const done = useApp((s) => (id ? s.completed[id] : undefined))
  const w = getWorkout(id)
  if (!w) return <Navigate to="/library" replace />
  return (
    <div className="screen">
      <ScreenHeader title={w.boss ? 'BOSS FIGHT' : 'READY?'} back scene="courtroom" />
      <div style={{ textAlign: 'center', padding: '4px 14px' }}>
        <div aria-hidden><ExIcon id={w.steps[0].ex} size={84} /></div>
        <h1 className="display" style={{ fontSize: 24 }}>{w.title}</h1>
        {done && <div className="display" style={{ color: 'var(--gold)' }}>{'⭐'.repeat(done.stars)} best · beat it for 3★!</div>}
      </div>
      <div className="pad stack" style={{ marginTop: 10, flex: 1 }}>
        <div className="card row" style={{ font: '600 14px var(--font-ui)' }}>
          <span>⏱ {minutesOf(w)} min</span><span>🔥 ~{kcalOf(w)} kcal</span><span>{w.equipment === 'None' ? '🙌 No gear' : w.equipment}</span>
        </div>
        <div className="card">
          <div className="card__title">{w.rounds ? `${w.rounds} ROUNDS · ${w.steps.length} MOVES` : `${w.steps.length} MOVES`}</div>
          {w.steps.map((st, i) => (
            <div key={i}>
              {w.rounds && i % w.groupSize === 0 && <div className="card__sub" style={{ marginTop: 6, fontWeight: 700 }}>ROUND {i / w.groupSize + 1}</div>}
              <div className="stat-line">
                <ExIcon id={st.ex} size={30} />
                <span>{EXERCISES[st.ex].name}</span>
                <span className="stat-line__val">{st.secs}s</span>
              </div>
              {restAfter(w, i) > 0 && <div className="card__sub" style={{ textAlign: 'center', padding: '2px 0' }}>😮‍💨 Rest {restAfter(w, i)}s</div>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 18 }}><Button icon="▶️" onClick={() => nav(`/workout/${w.id}/active`)}>Start Workout</Button></div>
    </div>
  )
}
