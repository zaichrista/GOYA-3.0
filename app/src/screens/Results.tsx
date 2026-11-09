import { Navigate, useNavigate } from 'react-router-dom'
import { Button, DialogueBox, ExIcon, Hud, Portrait, ScreenHeader } from '../components/ui'
import { getWorkout } from '../data'
import { useApp } from '../store'
import './screens.css'

export default function Results() {
  const nav = useNavigate()
  const r = useApp((s) => s.lastResult)
  const streak = useApp((s) => s.streak)
  if (!r) return <Navigate to="/home" replace />
  const next = getWorkout(r.nextId)
  const line = r.stars === 3 ? 'FLAWLESS. Not a single skip. Now do it again.' : 'Not bad. Beat it with no skips for 3 stars.'
  return (
    <div className="screen">
      <ScreenHeader title="REWARDS" scene="chambers" />
      <Hud inline />
      <div className="card" style={{ margin: '12px 14px 0', textAlign: 'center' }}>
        <div className="card__title"><ExIcon id={getWorkout(r.workoutId)?.steps[0].ex ?? 'jacks'} size={26} /> {r.title}</div>
        <div className="display" style={{ fontSize: 28, color: 'var(--primary)' }}>{'⭐'.repeat(r.stars)}</div>
        <div className="card__sub">🔥 {streak}-day streak. Come back tomorrow to keep it alive!</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto' }}>
        <Portrait src="/sprites/goya-home.png" style={{ width: 110, height: 140, background: 'transparent' }} />
        <div style={{ flex: 1, paddingBottom: 12, marginLeft: -10 }}><DialogueBox text={line} /></div>
      </div>
      <div style={{ padding: 18, display: 'grid', gap: 12 }}>
        {next
          ? <Button icon="▶️" onClick={() => nav(`/workout/${next.id}`, { replace: true })}>Next: {next.title}</Button>
          : <Button onClick={() => nav('/library', { replace: true })}>Pick another</Button>}
        <Button variant="secondary" onClick={() => nav('/map', { replace: true })}>Back to map</Button>
      </div>
    </div>
  )
}
