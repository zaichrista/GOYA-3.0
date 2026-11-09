import { useNavigate } from 'react-router-dom'
import { NavBar, Portrait, ProgressBar, ScreenHeader } from '../components/ui'
import { useApp, XP_MAX } from '../store'
import './screens.css'

export default function Profile() {
  const nav = useNavigate()
  const s = useApp()
  const rows = [['🎨', 'Appearance', '/appearance'], ['⚙️', 'Settings', '/settings'], ['🔔', 'Notifications', '/settings'], ['🔒', 'Data & Privacy', '/settings']]
  return (
    <>
      <div className="screen">
        <ScreenHeader title="PROFILE" scene="office" />
        <div className="card" style={{ margin: '0 14px' }}>
          <div className="row" style={{ justifyContent: 'flex-start', gap: 12 }}>
            <Portrait src="/sprites/goya-avatar.png" style={{ width: 64, height: 64, border: '3px solid var(--gold)' }} />
            <div style={{ flex: 1 }}>
              <div className="card__title" style={{ fontSize: 18 }}>{s.name} <span className="card__sub">Lv. {s.level}</span></div>
              <ProgressBar value={s.xp / XP_MAX} />
              <div className="card__sub" style={{ textAlign: 'right' }}>{s.xp} / {XP_MAX} XP</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 10, textAlign: 'center' }}>
            {[['Streak', `${s.streak} days`], ['Workouts', s.workouts], ['Calories', s.calories.toLocaleString()]].map(([l, v]) => (
              <div key={l} style={{ background: 'var(--primary)', color: 'var(--surface)', border: '2px solid #000', padding: 6 }}>
                <div style={{ fontSize: 11 }}>{l}</div><div className="display" style={{ fontSize: 15 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ margin: 14 }}>
          {rows.map(([i, l, to]) => (
            <button key={l} className="menu-row" onClick={() => nav(to)}><span aria-hidden>{i}</span><span>{l}</span><span aria-hidden>›</span></button>
          ))}
        </div>
      </div>
      <NavBar />
    </>
  )
}
