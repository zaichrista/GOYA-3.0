import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ALL_NODES, MISSIONS, WORLDS, kcalOf, minutesOf, type MissionDef, type Workout } from './data'

const XP_PER_LEVEL = 400
const pad = (n: number) => String(n).padStart(2, '0')
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayKey = () => keyOf(new Date())
export const weekKey = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return keyOf(d) }
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return keyOf(d) }
const todayIdx = () => (new Date().getDay() + 6) % 7 // Mon = 0

export type Cat = 'Outfits' | 'Frames' | 'Titles'
export type Result = {
  workoutId: string; title: string; emoji: string; minutes: number; kcal: number; exercises: number
  stars: number; xp: number; crowns: number; first: boolean
  leveledUp: boolean; newLevel: number; unlockedWorld?: string; nextId?: string
}
type Today = { day: string; workouts: number; hiit: boolean; core: boolean }

type State = {
  name: string; level: number; xp: number; crowns: number
  streak: number; workouts: number; calories: number
  weekDone: boolean[]; weekMinutes: number; weekKcal: number; weekKey: string; lastWorkoutDay: string
  completed: Record<string, { stars: number; count: number }>
  today: Today
  claimed: Record<string, string>; chestDay: string
  equipped: Record<Cat, string>
  muted: boolean
  lastResult: Result | null
  finishWorkout: (w: Workout, skips: number) => void
  claimMission: (id: string) => boolean
  claimChest: () => boolean
  equip: (cat: Cat, id: string) => void
  setMuted: (m: boolean) => void
  rollover: () => void
  reset: () => void
}

/** First not-yet-cleared level in any unlocked world: what "Today's Workout" and "Next level" point to. */
export function nextNode(completed: State['completed'], workouts: number): Workout | undefined {
  return ALL_NODES.find((n) => {
    const wd = WORLDS.find((x) => n.id.startsWith(x.id + '-'))!
    return workouts >= wd.unlockAt && !completed[n.id]
  })
}

// Seeded to match the design sheet so the prototype opens in a lived-in state.
const makeInitial = () => ({
  name: 'Zaira', level: 3, xp: 240, crowns: 120, streak: 4, workouts: 12, calories: 3219,
  weekDone: [true, true, true, true, false, false, false], weekMinutes: 84, weekKcal: 1108,
  weekKey: weekKey(), lastWorkoutDay: '',
  completed: {} as State['completed'], today: { day: '', workouts: 0, hiit: false, core: false } as Today,
  claimed: {} as Record<string, string>, chestDay: '',
  equipped: { Outfits: 'suit', Frames: 'plain', Titles: 'rookie' } as Record<Cat, string>,
  muted: false, lastResult: null as Result | null,
})

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      ...makeInitial(),
      rollover: () => {
        const s = get(); const patch: Partial<State> = {}
        if (s.weekKey !== weekKey()) Object.assign(patch, { weekKey: weekKey(), weekDone: Array(7).fill(false), weekMinutes: 0, weekKcal: 0 })
        if (s.lastWorkoutDay && s.lastWorkoutDay < yesterdayKey() && s.streak > 0) patch.streak = 0
        if (Object.keys(patch).length) set(patch)
      },
      finishWorkout: (w, skips) => {
        get().rollover()
        const s = get(); const day = todayKey()
        const stars = skips === 0 ? 3 : skips === 1 ? 2 : 1
        const first = !s.completed[w.id]
        const xpGain = w.steps.length * 10 + 20 + stars * 10 + (first ? 30 : 0)
        const crownGain = 5 + stars * 5 + (first ? 10 : 0) + (w.boss ? 25 : 0)
        let xp = s.xp + xpGain, level = s.level
        while (xp >= XP_PER_LEVEL) { xp -= XP_PER_LEVEL; level++ }
        const t = s.today.day === day ? s.today : { day, workouts: 0, hiit: false, core: false }
        const weekDone = [...s.weekDone]; weekDone[todayIdx()] = true
        const workouts = s.workouts + 1
        const prev = s.completed[w.id]
        const completed = { ...s.completed, [w.id]: { stars: Math.max(stars, prev?.stars ?? 0), count: (prev?.count ?? 0) + 1 } }
        const unlocked = WORLDS.find((x) => s.workouts < x.unlockAt && workouts >= x.unlockAt)
        set({
          xp, level, workouts, completed, weekDone, crowns: s.crowns + crownGain,
          calories: s.calories + kcalOf(w), weekMinutes: s.weekMinutes + minutesOf(w), weekKcal: s.weekKcal + kcalOf(w),
          streak: s.lastWorkoutDay === day ? s.streak : s.streak + 1, lastWorkoutDay: day,
          today: { day, workouts: t.workouts + 1, hiit: t.hiit || w.category === 'HIIT', core: t.core || w.category === 'Core' },
          lastResult: {
            workoutId: w.id, title: w.title, emoji: w.emoji, minutes: minutesOf(w), kcal: kcalOf(w), exercises: w.steps.length,
            stars, xp: xpGain, crowns: crownGain, first, leveledUp: level > s.level, newLevel: level,
            unlockedWorld: unlocked?.name, nextId: nextNode(completed, workouts)?.id,
          },
        })
      },
      claimMission: (id) => {
        const m = MISSIONS.find((x) => x.id === id); const s = get()
        if (!m || isClaimed(s, m)) return false
        const [cur, max] = missionProgress(s, m)
        if (cur < max) return false
        set({ claimed: { ...s.claimed, [id]: claimKey(m) }, crowns: s.crowns + m.reward })
        return true
      },
      claimChest: () => {
        const s = get()
        const allDaily = MISSIONS.filter((m) => m.scope === 'Daily').every((m) => isClaimed(s, m))
        if (!allDaily || s.chestDay === todayKey()) return false
        set({ chestDay: todayKey(), crowns: s.crowns + 50 })
        return true
      },
      equip: (cat, id) => set({ equipped: { ...get().equipped, [cat]: id } }),
      setMuted: (muted) => set({ muted }),
      reset: () => set({ ...makeInitial() }),
    }),
    { name: 'goya-app-v2' },
  ),
)

export const XP_MAX = XP_PER_LEVEL
export const claimKey = (m: MissionDef) => (m.scope === 'Daily' ? todayKey() : m.scope === 'Weekly' ? weekKey() : 'once')
export const isClaimed = (s: State, m: MissionDef) => s.claimed[m.id] === claimKey(m)

export const missionProgress = (s: State, m: MissionDef): [number, number] => {
  const t = s.today.day === todayKey() ? s.today : { workouts: 0, hiit: false, core: false }
  switch (m.cond) {
    case 'workout': return [Math.min(t.workouts, 1), 1]
    case 'hiit': return [t.hiit ? 1 : 0, 1]
    case 'core': return [t.core ? 1 : 0, 1]
    case 'streak7': return [Math.min(s.streak, 7), 7]
    case 'streak14': return [Math.min(s.streak, 14), 14]
    case 'week4': return [Math.min(s.weekDone.filter(Boolean).length, 4), 4]
    case 'kcal': return [Math.min(s.weekKcal, 1500), 1500]
    case 'boss': return [ALL_NODES.some((n) => n.boss && s.completed[n.id]) ? 1 : 0, 1]
  }
}
