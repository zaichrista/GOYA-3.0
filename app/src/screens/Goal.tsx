import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ScreenHeader } from '../components/ui'

const GOALS = [
  { id: 'fit', icon: '⚡', title: 'Get Fitter', sub: 'Build stamina & burn fat' },
  { id: 'strong', icon: '🏋️', title: 'Build Strength', sub: 'Get stronger & leaner' },
  { id: 'consistent', icon: '❤️', title: 'Be Consistent', sub: 'Create a real routine' },
  { id: 'custom', icon: '🎯', title: 'Custom Case', sub: 'Set your own goal' },
]

export default function Goal() {
  const nav = useNavigate()
  const [sel, setSel] = useState('fit')
  return (
    <div className="screen">
      <ScreenHeader title="WHAT'S YOUR CASE?" back scene="goal" />
      <div style={{ padding: '8px 14px', flex: 1 }}>
        {GOALS.map((g) => (
          <button key={g.id} className={`card card--option ${sel === g.id ? 'is-selected' : ''}`} onClick={() => setSel(g.id)}>
            <span style={{ fontSize: 28 }}>{g.icon}</span>
            <span><div className="card__title">{g.title}</div><div className="card__sub">{g.sub}</div></span>
          </button>
        ))}
      </div>
      <div style={{ padding: 18 }}><Button onClick={() => nav('/home')}>Take the case</Button></div>
    </div>
  )
}
