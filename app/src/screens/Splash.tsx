import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Portrait, ProgressBar } from '../components/ui'

export default function Splash() {
  const nav = useNavigate()
  const [p, setP] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setP((v) => Math.min(1, v + 0.04)), 80)
    return () => clearInterval(id)
  }, [])
  useEffect(() => { if (p >= 1) nav('/onboarding') }, [p, nav])
  return (
    <div className="screen" style={{ background: "url('/scenes/splash.png') center / cover", imageRendering: 'pixelated' }}>
      <Portrait src="/sprites/goya-splash.png" style={{ flex: 1, background: 'transparent' }} />
      <div style={{ textAlign: 'center', marginTop: -90, position: 'relative' }}>
        <h1 className="display" style={{ fontSize: 76, color: 'var(--accent)', WebkitTextStroke: '3px #2a0a1c', transform: 'rotate(-4deg)', textShadow: '4px 4px 0 var(--gold)' }}>GOYA</h1>
        <div className="display" style={{ background: 'var(--accent-strong)', display: 'inline-block', padding: '2px 12px', border: '2px solid #000', fontSize: 14 }}>GET OFF YOUR ASS</div>
      </div>
      <div style={{ padding: '60px 60px 28px', textAlign: 'center' }}>
        <ProgressBar value={p} />
        <div className="display" style={{ fontSize: 12, marginTop: 6 }}>LOADING...</div>
      </div>
    </div>
  )
}
