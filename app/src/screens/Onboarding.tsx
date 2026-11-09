import { useNavigate } from 'react-router-dom'
import { Button, DialogueBox, Portrait } from '../components/ui'

export default function Onboarding() {
  const nav = useNavigate()
  return (
    <div className="screen" style={{ background: "linear-gradient(180deg, rgba(26,13,32,0) 45%, rgba(26,13,32,.9) 100%), url('/scenes/onboarding.png') center / cover", imageRendering: 'pixelated' }}>
      <button className="display" style={{ position: 'absolute', right: 16, top: 54, zIndex: 3, background: 'rgba(14,6,20,.75)', padding: '4px 14px', border: '2px solid #000' }} onClick={() => nav('/goal')}>Skip</button>
      <Portrait src="/sprites/goya-point.png" style={{ flex: 1, background: 'transparent' }} />
      <DialogueBox text="So... you're here to actually get off your ass?" />
      <div style={{ padding: 18, display: 'grid', gap: 12 }}>
        <Button onClick={() => nav('/goal')} icon="▶️">Yes, Queen.</Button>
        <Button variant="secondary" onClick={() => nav('/goal')}>Tell me more.</Button>
        <Button variant="secondary" onClick={() => nav('/goal')}>I need motivation.</Button>
      </div>
    </div>
  )
}
