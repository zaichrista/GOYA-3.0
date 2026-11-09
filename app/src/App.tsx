import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Goal from './screens/Goal'
import Home from './screens/Home'
import MapScreen from './screens/MapScreen'
import Library from './screens/Library'
import WorkoutPreview from './screens/WorkoutPreview'
import WorkoutSession from './screens/WorkoutSession'
import Complete from './screens/Complete'
import Results from './screens/Results'
import Programs from './screens/Programs'
import Progress from './screens/Progress'
import Missions from './screens/Missions'
import Profile from './screens/Profile'
import Appearance from './screens/Appearance'
import Settings from './screens/Settings'
import { sfx } from './sfx'
import { useApp } from './store'

export default function App() {
  useEffect(() => {
    useApp.getState().rollover()
    // one tap sound for every button; nav tabs get their own
    const onTap = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest('button, a')
      if (!el || (el as HTMLButtonElement).disabled) return
      el.classList.contains('nav__item') ? sfx.nav() : sfx.tap()
    }
    document.addEventListener('pointerdown', onTap)
    return () => document.removeEventListener('pointerdown', onTap)
  }, [])
  return (
    <BrowserRouter>
      <div className="phone">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/library" element={<Library />} />
          <Route path="/workout" element={<Navigate to="/library" replace />} />
          <Route path="/workout/complete" element={<Complete />} />
          <Route path="/workout/results" element={<Results />} />
          <Route path="/workout/:id" element={<WorkoutPreview />} />
          <Route path="/workout/:id/active" element={<WorkoutSession />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
