import { Button, ScreenHeader } from '../components/ui'
import { useApp } from '../store'
import './screens.css'

export default function Settings() {
  const { reset, muted, setMuted } = useApp()
  return (
    <div className="screen">
      <ScreenHeader title="SETTINGS" back scene="clerk" />
      <div className="card stack" style={{ margin: 14 }}>
        <div className="card__title">Prototype tools</div>
        <div className="card__sub">Settings, notifications and privacy aren't built yet. These help you test the flow.</div>
        <Button variant="secondary" onClick={() => setMuted(!muted)}>{muted ? '🔇 Sound off' : '🔊 Sound on'}</Button>
        <Button variant="secondary" onClick={() => useApp.setState({ workouts: 14 })}>Set workouts to 14 (1 from World 2)</Button>
        <Button variant="secondary" onClick={() => useApp.setState({ streak: 7 })}>Set streak to 7</Button>
        <Button variant="secondary" onClick={() => useApp.setState({ level: 6 })}>Jump to level 6</Button>
        <Button onClick={reset}>Reset demo data</Button>
      </div>
    </div>
  )
}
