import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Burst, Button, Confetti, Portrait, Stars, useCountUp } from '../components/ui'
import { sfx } from '../sfx'
import { useApp } from '../store'
import './screens.css'

export default function Complete() {
  const nav = useNavigate()
  const r = useApp((s) => s.lastResult)
  const xp = useCountUp(r?.xp ?? 0, 900, 1000)
  const crowns = useCountUp(r?.crowns ?? 0, 900, 1300)
  useEffect(() => {
    if (!r) return
    const ts = [setTimeout(sfx.coin, 2300)]
    if (r.leveledUp) ts.push(setTimeout(sfx.level, 2000))
    if (r.unlockedWorld) ts.push(setTimeout(sfx.unlock, r.leveledUp ? 3000 : 2000))
    return () => ts.forEach(clearTimeout)
  }, [r])
  if (!r) return <Navigate to="/home" replace />
  return (
    <div className="screen" style={{ background: "linear-gradient(180deg, rgba(26,13,32,0) 25%, rgba(26,13,32,.88) 100%), url('/scenes/victory.png') top center / cover", imageRendering: 'pixelated' }}>
      <Confetti />
      <div style={{ display: 'grid', placeItems: 'center', marginTop: 4 }}><Burst text="CASE CLOSED!" sound="caseClosed" /></div>
      <Stars n={r.stars} />
      <Portrait src="/sprites/goya-victory.png" style={{ flex: 1, background: 'transparent', minHeight: 90 }} />
      {r.leveledUp && <div className="banner">🆙 LEVEL UP! You're Lv {r.newLevel}</div>}
      {r.unlockedWorld && <div className="banner banner--pink">🗺️ NEW WORLD: {r.unlockedWorld}</div>}
      {r.first && <div className="banner banner--pink">🎉 FIRST CLEAR BONUS +30 XP</div>}
      <div className="card" style={{ margin: '0 14px' }}>
        <div className="reward"><span aria-hidden>⭐</span>XP earned<b>+{xp}</b></div>
        <div className="reward"><span aria-hidden>👑</span>Crowns<b>+{crowns}</b></div>
        <div className="reward"><span aria-hidden>🔥</span>{r.kcal} kcal · {r.exercises} moves · {r.minutes} min<b /></div>
      </div>
      <div style={{ padding: 18 }}><Button onClick={() => nav('/workout/results', { replace: true })}>Claim rewards</Button></div>
    </div>
  )
}
