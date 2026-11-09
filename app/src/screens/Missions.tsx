import { useState } from 'react'
import { Checkbox, Chips, ScreenHeader } from '../components/ui'
import { MISSIONS } from '../data'
import { sfx } from '../sfx'
import { isClaimed, missionProgress, todayKey, useApp } from '../store'
import './screens.css'

export default function Missions() {
  const s = useApp()
  const [tab, setTab] = useState<'Daily' | 'Weekly' | 'Cases'>('Daily')
  const list = MISSIONS.filter((m) => m.scope === tab)
  const allDaily = MISSIONS.filter((m) => m.scope === 'Daily').every((m) => isClaimed(s, m))
  const chestDone = s.chestDay === todayKey()
  return (
    <div className="screen">
      <ScreenHeader title="MISSIONS" back scene="notice" />
      <Chips items={['Daily', 'Weekly', 'Cases']} active={tab} onChange={(t) => setTab(t as typeof tab)} />
      <div className="card" style={{ margin: '0 14px' }}>
        {list.map((m) => {
          const [cur, max] = missionProgress(s, m)
          const claimed = isClaimed(s, m), ready = cur >= max && !claimed
          return (
            <button key={m.id} className={`mission ${ready ? 'glow' : ''}`} disabled={!ready}
              aria-label={`${m.label}. ${claimed ? 'Claimed' : ready ? 'Ready, tap to claim' : `${cur} of ${max}`}`}
              onClick={() => s.claimMission(m.id) && sfx.coin()}>
              <Checkbox on={claimed} />
              <span>{m.label}{!claimed && max > 1 ? ` (${cur.toLocaleString()}/${max.toLocaleString()})` : ''}</span>
              <span className="mission__reward">{ready ? 'CLAIM ' : ''}+{m.reward} 👑</span>
            </button>
          )
        })}
        <div className="card__sub" style={{ marginTop: 6 }}>Finish workouts to fill these. Tap CLAIM when one glows.</div>
      </div>
      {tab === 'Daily' && (
        <div className="chest" style={{ margin: 14 }}>
          <span style={{ fontSize: 40 }} aria-hidden>🧰</span>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: 'var(--gold)', fontSize: 17 }}>Case Reward</div>
            <div style={{ fontSize: 12 }}>Claim all daily missions</div>
          </div>
          <button className={`btn btn--secondary ${allDaily && !chestDone ? 'glow' : ''}`} style={{ width: 'auto', minWidth: 88 }}
            disabled={!allDaily || chestDone} onClick={() => s.claimChest() && sfx.unlock()}>
            {chestDone ? 'Claimed' : '+50 👑'}
          </button>
        </div>
      )}
      <div className="display" style={{ textAlign: 'center', marginTop: 'auto', padding: 12 }}>👑 {s.crowns} crowns</div>
    </div>
  )
}
