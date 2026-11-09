import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chips, NavBar, ScreenHeader } from '../components/ui'
import { PROGRAMS } from '../data'
import './screens.css'

export default function Programs() {
  const nav = useNavigate()
  const [tab, setTab] = useState('All')
  const list = PROGRAMS.filter((p) => tab === 'All' || p.tag === tab)
  return (
    <>
      <div className="screen">
        <ScreenHeader title="PROGRAMS" scene="trainhall" />
        <Chips items={['All', 'HIIT', 'Strength', 'Core']} active={tab} onChange={setTab} />
        <div className="pad">
          {list.map((p) => (
            <button key={p.id} className="card prog-card" onClick={() => nav('/workout/court-training')}>
              <span className="prog-card__icon" aria-hidden>{p.icon}</span>
              <span style={{ flex: 1 }}><div className="card__title">{p.title}</div><div className="card__sub">{p.meta}</div></span>
              <span aria-hidden>›</span>
            </button>
          ))}
        </div>
      </div>
      <NavBar />
    </>
  )
}
