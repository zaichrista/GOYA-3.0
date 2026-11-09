import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Chips, ExIcon, NavBar, ScreenHeader } from '../components/ui'
import { LIBRARY, kcalOf, minutesOf } from '../data'
import './screens.css'

const CATS = ['All', 'Lower', 'Upper', 'Core', 'HIIT', 'Stretch']
const TIMES: Record<string, number> = { Any: 99, '≤5 min': 5, '≤7 min': 7, '≤10 min': 10 }

export default function Library() {
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const [time, setTime] = useState('Any')
  const list = LIBRARY.filter((w) => (cat === 'All' || w.category === cat) && minutesOf(w) <= TIMES[time])
  const surprise = () => nav(`/workout/${LIBRARY[Math.floor(Math.random() * LIBRARY.length)].id}`)
  return (
    <>
      <div className="screen">
        <ScreenHeader title="LIBRARY" scene="library" />
        <div className="pad" style={{ marginBottom: 10 }}><Button onClick={surprise} icon="🎲">Surprise me</Button></div>
        <Chips items={CATS} active={cat} onChange={setCat} />
        <Chips items={Object.keys(TIMES)} active={time} onChange={setTime} />
        <div className="pad">
          {list.length === 0 && <div className="card">Nothing here. Try a longer time limit.</div>}
          {list.map((w) => (
            <button key={w.id} className="card wk" onClick={() => nav(`/workout/${w.id}`)}>
              <span className="wk__icon" aria-hidden><ExIcon id={w.steps[0].ex} size={46} /></span>
              <span style={{ flex: 1 }}>
                <div className="card__title">{w.title}<span className={`badge badge--${w.level.toLowerCase()}`}>{w.level}</span></div>
                <div className="card__sub">⏱ {minutesOf(w)} min · 🔥 {kcalOf(w)} kcal · {w.category}</div>
                <div className="wk__strip" aria-hidden>{w.steps.slice(0, w.rounds ? w.groupSize : undefined).map((s, i) => <ExIcon key={i} id={s.ex} size={22} />)}{w.rounds ? ` ×${w.rounds} rounds` : ''}</div>
              </span>
              <span aria-hidden>›</span>
            </button>
          ))}
        </div>
      </div>
      <NavBar />
    </>
  )
}
