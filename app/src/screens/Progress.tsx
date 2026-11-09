import { useState } from 'react'
import { Checkbox, Chips, NavBar, ScreenHeader } from '../components/ui'
import { useApp } from '../store'
import './screens.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Progress() {
  const s = useApp()
  const [tab, setTab] = useState('Overview')
  const mins = s.weekMinutes
  return (
    <>
      <div className="screen">
        <ScreenHeader title="PROGRESS" scene="records" />
        <Chips items={['Overview', 'Streak', 'Stats']} active={tab} onChange={setTab} />
        <div className="card" style={{ margin: '0 14px' }}>
          {tab === 'Overview' && (<>
            <div className="card__title" style={{ textAlign: 'center' }}>This Week</div>
            <div className="week" style={{ margin: '8px 0' }}>
              {DAYS.map((d, i) => (
                <div key={d}>{d}<div style={{ display: 'grid', placeItems: 'center', marginTop: 4 }}><Checkbox on={s.weekDone[i]} /></div>
                  <span className="sr-only">{s.weekDone[i] ? 'done' : 'not done'}</span></div>
              ))}
            </div>
            <div className="stat-line"><span>💪 Workouts</span><span className="stat-line__val">{s.weekDone.filter(Boolean).length} / 7</span></div>
            <div className="stat-line"><span>⏱️ Total Time</span><span className="stat-line__val">{Math.floor(mins / 60)}h {mins % 60}m</span></div>
            <div className="stat-line"><span>🔥 Total Calories</span><span className="stat-line__val">{s.weekKcal.toLocaleString()} kcal</span></div>
            <div className="stat-line"><span>🔥 Current Streak</span><span className="stat-line__val">{s.streak} days</span></div>
          </>)}
          {tab === 'Streak' && (<>
            <div className="card__title" style={{ textAlign: 'center' }}>Current Streak</div>
            <div className="timer" style={{ color: 'var(--primary)', textShadow: 'none' }}>{s.streak}</div>
            <div className="card__sub" style={{ textAlign: 'center' }}>days in a row. Reach 7 for the weekly streak mission.</div>
          </>)}
          {tab === 'Stats' && (<>
            <div className="card__title" style={{ textAlign: 'center' }}>All Time</div>
            <div className="stat-line"><span>Workouts</span><span className="stat-line__val">{s.workouts}</span></div>
            <div className="stat-line"><span>Calories</span><span className="stat-line__val">{s.calories.toLocaleString()}</span></div>
            <div className="stat-line"><span>Level</span><span className="stat-line__val">{s.level}</span></div>
          </>)}
        </div>
      </div>
      <NavBar />
    </>
  )
}
