import { useNavigate } from 'react-router-dom'
import { Button, DialogueBox, Hud, NavBar, Portrait } from '../components/ui'
import { LIBRARY, minutesOf } from '../data'
import { nextNode, useApp } from '../store'

export default function Home() {
  const nav = useNavigate()
  const { completed, workouts } = useApp()
  const today = nextNode(completed, workouts) ?? LIBRARY[0]
  const tiles = [['🗺️', 'World Map', '/map'], ['📚', 'Library', '/library'], ['🎯', 'Missions', '/missions'], ['📋', 'Programs', '/programs']]
  return (
    <>
      <div className="screen">
        <div style={{ height: 270, background: "url('/scenes/courthouse.png') center / cover", imageRendering: 'pixelated', display: 'grid' }}>
          <Portrait src="/sprites/goya-home.png" style={{ background: 'transparent' }} />
        </div>
        <div style={{ marginTop: -26 }}><DialogueBox text="Back in court. Just ONE round today. Ready?" /></div>
        <div style={{ margin: '14px 0 0' }}><Hud inline /></div>
        <div style={{ padding: '14px 14px', display: 'grid', gap: 12 }}>
          <Button icon="▶️" onClick={() => nav(`/workout/${today.id}`)}>Today's Workout · {minutesOf(today)} min</Button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {tiles.map(([i, l, to]) => (
              <button key={l} className="card" style={{ textAlign: 'center' }} onClick={() => nav(to)}>
                <div style={{ fontSize: 26 }} aria-hidden>{i}</div>
                <div className="card__title" style={{ fontSize: 13 }}>{l}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </>
  )
}
