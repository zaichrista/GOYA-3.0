import { useState } from 'react'
import { Button, Chips, Portrait, ScreenHeader } from '../components/ui'
import { COSMETICS } from '../data'
import { useApp } from '../store'
import './screens.css'

type Cat = keyof typeof COSMETICS

export default function Appearance() {
  const s = useApp()
  const [cat, setCat] = useState<Cat>('Outfits')
  const [pick, setPick] = useState(s.equipped[cat])
  const item = COSMETICS[cat].find((c) => c.id === pick) ?? COSMETICS[cat][0]
  const locked = item.unlockLevel > s.level
  const changeCat = (c: string) => { setCat(c as Cat); setPick(s.equipped[c as Cat]) }
  return (
    <div className="screen">
      <ScreenHeader title="APPEARANCE" back scene="wardrobe" />
      <Chips items={['Outfits', 'Frames', 'Titles']} active={cat} onChange={changeCat} />
      <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Full-width stage with a fixed height: every outfit is fitted to the same box, so GOYA stays the same height. */}
        <div className="card" style={{ padding: 0, flex: 1, minHeight: 340, position: 'relative', overflow: 'hidden' }}>
          <Portrait fit src="/sprites/goya-full.png" outfit={cat === 'Outfits' ? item.id : undefined} style={{ position: 'absolute', inset: 0 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COSMETICS[cat].length}, 1fr)`, gap: 8 }}>
          {COSMETICS[cat].map((c) => (
            <button key={c.id} className={`tile ${pick === c.id ? 'is-sel' : ''}`} aria-pressed={pick === c.id} onClick={() => setPick(c.id)} style={{ aspectRatio: 'auto', minHeight: 64, fontSize: 11 }}>
              {c.name}
              {c.unlockLevel > s.level && <span className="lock">🔒 Lv.{c.unlockLevel}</span>}
              {s.equipped[cat] === c.id && <span className="lock" style={{ left: 4, right: 'auto' }}>✅ On</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <Button onClick={() => !locked && s.equip(cat, item.id)}>{locked ? `Unlocks at Lv. ${item.unlockLevel}` : s.equipped[cat] === item.id ? 'Equipped' : 'Equip'}</Button>
      </div>
    </div>
  )
}
