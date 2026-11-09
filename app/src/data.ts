/* ---------- Exercises (emoji for small icons; GOYA pose sprites for the active workout) ---------- */
export type Group = 'Lower' | 'Upper' | 'Core' | 'HIIT' | 'Stretch'
export type Exercise = { name: string; emoji: string; cue: string; groups: Group[]; sprite?: string }

/** [id, name, emoji, cue]. A move listed under several groups (e.g. Mountain Climbers) is defined once, with `also`. */
type Row = [string, string, string, string]
const build = (group: Group, rows: Row[], also: Record<string, Group[]> = {}) =>
  Object.fromEntries(rows.map(([id, name, emoji, cue]) => [id, { name, emoji, cue, groups: [group, ...(also[id] ?? [])] } as Exercise]))

const LOWER = build('Lower', [
  ['squats', 'Squats', '🍑', 'Hips back, chest up'],
  ['sumosquats', 'Sumo Squats', '🏋️', 'Toes out, sink between the knees'],
  ['squatpulses', 'Squat Pulses', '🥁', 'Stay low, tiny pulses'],
  ['jumpsquats', 'Jump Squats', '🚀', 'Explode up, land soft'],
  ['wallsit', 'Wall Sit', '🧱', 'Back flat, thighs parallel'],
  ['reverselunges', 'Reverse Lunges', '🚶', 'Step back, front knee steady'],
  ['lunges', 'Forward Lunges', '🦵', 'Big step, back knee low'],
  ['walkinglunges', 'Walking Lunges', '👣', 'Keep stepping, stay tall'],
  ['laterallunges', 'Lateral Lunges', '↔️', 'Sit back into one hip'],
  ['curtsylunges', 'Curtsy Lunges', '💃', 'Cross behind, hips square'],
  ['jumplunges', 'Jump Lunges', '⚡', 'Switch mid-air, land soft'],
  ['splitsquats', 'Split Squats', '🦿', 'Drop straight down'],
  ['bulgarians', 'Bulgarian Split Squats', '🪑', 'Back foot up, front heel heavy'],
  ['bridges', 'Glute Bridges', '🌉', 'Squeeze at the top'],
  ['slbridges', 'Single-Leg Glute Bridges', '🍒', 'Hips level, drive through the heel'],
  ['bridgepulses', 'Glute Bridge Pulses', '💓', 'Stay high, small pulses'],
  ['frogpumps', 'Frog Pumps', '🐸', 'Soles together, squeeze up'],
  ['donkeykicks', 'Donkey Kicks', '🫏', 'Heel to the ceiling'],
  ['hydrants', 'Fire Hydrants', '🚒', 'Knee out, hips still'],
  ['clamshells', 'Clamshells', '🐚', 'Open the knee, feet together'],
  ['sidelegraises', 'Side-Lying Leg Raises', '🛌', 'Lift from the hip, toes forward'],
  ['kickbacks', 'Standing Kickbacks', '🦶', 'Kick back, squeeze the glute'],
  ['calfraises', 'Calf Raises', '🩰', 'Rise high, lower slow'],
  ['slcalfraises', 'Single-Leg Calf Raises', '🦩', 'Full height, steady balance'],
  ['stepups', 'Step-Ups', '🪜', 'Drive through the heel'],
  ['slrdl', 'Single-Leg Romanian Deadlifts', '⚖️', 'Hinge, flat back, hips square'],
  ['goodmornings', 'Good Mornings', '🌅', 'Hinge back, flat spine'],
  ['hamwalkouts', 'Hamstring Walkouts', '🐛', 'Bridge up, walk the heels out'],
  ['lateralwalks', 'Lateral Squat Walks', '🦀', 'Stay low, step wide'],
  ['skaters', 'Skaters', '⛸️', 'Leap side to side'],
], { jumpsquats: ['HIIT'], jumplunges: ['HIIT'] })

const UPPER = build('Upper', [
  ['wallpushups', 'Wall Push-Ups', '🚪', 'Body straight, chest to the wall'],
  ['inclinepushups', 'Incline Push-Ups', '📐', 'Hands high, elbows in'],
  ['kneepushups', 'Knee Push-Ups', '🧎', 'Straight line, knees to head'],
  ['pushups', 'Standard Push-Ups', '💪', 'Chest to the floor'],
  ['widepushups', 'Wide Push-Ups', '🪽', 'Hands wide, chest lead'],
  ['diamondpushups', 'Diamond Push-Ups', '💎', 'Hands together, elbows tight'],
  ['declinepushups', 'Decline Push-Ups', '📉', 'Feet up, core tight'],
  ['pikepushups', 'Pike Push-Ups', '🔺', 'Hips high, head to the floor'],
  ['archerpushups', 'Archer Push-Ups', '🏹', 'Lean to one arm, other straight'],
  ['pushuptaps', 'Push-Up Shoulder Taps', '👋', 'Tap, hips don’t sway'],
  ['updowns', 'Plank Up-Downs', '⬆️', 'Forearm, hand, hand — switch'],
  ['dips', 'Tricep Dips (Chair)', '🛋️', 'Elbows back, shoulders down'],
  ['armcircles', 'Arm Circles', '🔄', 'Arms long, circle from the shoulder'],
  ['armpulses', 'Arm Pulses', '🔋', 'Small, fast, burn it out'],
  ['boxing', 'Shadow Boxing', '🥊', 'Punch fast, stay light'],
  ['superman', 'Superman Raises', '🦸', 'Lift arms and legs, squeeze'],
  ['snowangels', 'Reverse Snow Angels', '❄️', 'Sweep arms, pinch the back'],
  ['ytw', 'Prone Y-T-W Raises', '🔤', 'Thumbs up, squeeze shoulder blades'],
  ['scappushups', 'Scapular Push-Ups', '🦅', 'Arms straight, shoulder blades move'],
  ['bearshouldertaps', 'Bear Plank Shoulder Taps', '🐻', 'Knees hover, hips level'],
  ['wallangels', 'Wall Angels', '😇', 'Slide arms up, back on the wall'],
  ['inchwalk', 'Inchworm Walkouts', '🪱', 'Walk out, hold, walk back'],
], { boxing: ['HIIT'] })

const CORE = build('Core', [
  ['crunches', 'Crunches', '🌀', 'Curl up, lower slow'],
  ['reversecrunches', 'Reverse Crunches', '🔙', 'Knees to chest, hips off the floor'],
  ['bicycles', 'Bicycle Crunches', '🚲', 'Elbow to opposite knee'],
  ['crossbodycrunches', 'Cross-Body Crunches', '❌', 'Rotate through the ribs'],
  ['toetouches', 'Toe Touches', '🧦', 'Legs up, reach for the toes'],
  ['situps', 'Sit-Ups', '🌞', 'Roll all the way up'],
  ['vups', 'V-Ups', '✌️', 'Hands and feet meet in a V'],
  ['tuckups', 'Tuck-Ups', '📦', 'Knees in, chest up'],
  ['deadbugs', 'Dead Bugs', '🪲', 'Low back glued down'],
  ['birddogs', 'Bird Dogs', '🐕', 'Reach long, hips level'],
  ['twists', 'Russian Twists', '🌪️', 'Rotate from the ribs'],
  ['seatedtucks', 'Seated Knee Tucks', '💺', 'Lean back, knees in'],
  ['legraise', 'Leg Raises', '🛫', 'Low back stays down'],
  ['flutter', 'Flutter Kicks', '🦋', 'Small, fast, legs low'],
  ['scissors', 'Scissor Kicks', '✂️', 'Cross legs, keep them low'],
  ['hollowhold', 'Hollow Body Hold', '🌙', 'Ribs down, banana shape'],
  ['hollowrocks', 'Hollow Rocks', '🪨', 'Stay hollow, rock as one piece'],
  ['plank', 'Forearm Plank', '🪵', 'Straight line. Squeeze.'],
  ['highplank', 'High Plank', '🛹', 'Hands under shoulders, squeeze'],
  ['sideplank', 'Side Plank', '📏', 'Hips high, body in one line'],
  ['sideplankdips', 'Side Plank Hip Dips', '🌊', 'Dip and lift the hip'],
  ['plankshouldertaps', 'Plank Shoulder Taps', '🖐️', 'Feet wide, hips still'],
  ['plankjacks', 'Plank Jacks', '🤸', 'Jump feet wide, core tight'],
  ['plankkneedrives', 'Plank Knee Drives', '🚂', 'Knee to chest, back flat'],
  ['climbers', 'Mountain Climbers', '🧗', 'Knees to chest, fast!'],
  ['crossclimbers', 'Cross-Body Mountain Climbers', '✖️', 'Knee to opposite elbow'],
  ['bearcrawl', 'Bear Crawl', '🐼', 'Knees low, opposite hand and foot'],
  ['bearhold', 'Bear Hold', '🐾', 'Knees an inch off the floor'],
  ['heeltouches', 'Heel Touches', '👠', 'Reach side to side'],
  ['wipers', 'Windshield Wipers', '🚘', 'Legs sweep, shoulders down'],
  ['legcircles', 'Seated Leg Circles', '⭕', 'Lean back, draw big circles'],
], { plankjacks: ['HIIT'], climbers: ['HIIT'], bearcrawl: ['HIIT'] })

const HIIT = build('HIIT', [
  ['jacks', 'Jumping Jacks', '⭐', 'Arms up, feet wide!'],
  ['halfjacks', 'Half Jacks', '🦇', 'Quick feet, arms to shoulder height'],
  ['starjumps', 'Star Jumps', '🌟', 'Explode into a star'],
  ['highknees', 'High Knees', '🏃', 'Knees to hip height'],
  ['buttkicks', 'Butt Kicks', '🐎', 'Heels to glutes, stay light'],
  ['burpees', 'Burpees', '🔥', 'Down, up, JUMP!'],
  ['halfburpees', 'Half Burpees', '💥', 'Hands down, kick back, stand'],
  ['squatthrusts', 'Squat Thrusts', '🛸', 'Hands down, feet back, in, up'],
  ['tuckjumps', 'Tuck Jumps', '🎈', 'Knees to chest, land soft'],
  ['broadjumps', 'Broad Jumps', '🦘', 'Swing arms, jump far'],
  ['lateralhops', 'Lateral Hops', '🐇', 'Hop side to side, stay low'],
  ['skaterjumps', 'Skater Jumps', '🏂', 'Bound across, sweep the back leg'],
  ['speedskaters', 'Speed Skaters', '💨', 'Quick bounds, low and fast'],
  ['fastfeet', 'Fast Feet', '👟', 'Tiny quick steps, light on the toes'],
  ['runinplace', 'Running in Place', '🏅', 'Pump your arms, stay tall'],
  ['sprint', 'Sprint in Place', '🏎️', 'All out. Go go go!'],
  ['jumprope', 'Jump Rope (Imaginary)', '🪢', 'Small hops, wrists turning'],
  ['boxershuffle', 'Boxer Shuffle', '🥋', 'Bounce, hands up'],
  ['punchingjacks', 'Punching Jacks', '👊', 'Jack the feet, punch forward'],
  ['frogjumps', 'Frog Jumps', '🦎', 'Deep squat, leap, land soft'],
  ['inchworms', 'Inchworms', '🐌', 'Walk out to plank and back'],
  ['lateralshuffles', 'Lateral Shuffles', '🦞', 'Low and wide, quick feet'],
  ['heisman', 'Heisman Steps', '🏈', 'High knees, swing side to side'],
  ['powerknees', 'Power Knees', '🦾', 'Drive the knee up hard'],
  ['standingcross', 'Standing Cross Crunches', '🎽', 'Elbow to opposite knee'],
  ['walkouttoplank', 'Walkout to Plank', '🏁', 'Walk out, jump back, stand'],
  ['burpeebroad', 'Burpee Broad Jumps', '☄️', 'Burpee, then jump forward'],
])

const STRETCH = build('Stretch', [
  ['catcow', 'Cat-Cow', '🐈', 'Round, then arch. Breathe.'],
  ['childspose', 'Child’s Pose', '🧸', 'Hips to heels, melt down'],
  ['downdog', 'Downward Dog', '🐩', 'Hips high, press the floor away'],
  ['updog', 'Upward Dog', '🌤️', 'Chest open, thighs off the floor'],
  ['cobra', 'Cobra Stretch', '🐍', 'Lift the chest, relax the back'],
  ['sphinx', 'Sphinx Pose', '🦁', 'Forearms down, gentle lift'],
  ['wgs', 'World’s Greatest Stretch', '🌍', 'Lunge, twist, reach for the sky'],
  ['lowlunge', 'Low Lunge Stretch', '🌄', 'Sink hips forward, chest tall'],
  ['hipflexor', 'Hip Flexor Stretch', '🧘', 'Tuck the pelvis, lean forward'],
  ['butterfly', 'Butterfly Stretch', '🪷', 'Soles together, knees soft'],
  ['pigeon', 'Pigeon Pose', '🕊️', 'Fold over the front shin'],
  ['figurefour', 'Figure-Four Stretch', '4️⃣', 'Ankle on knee, pull in'],
  ['seatedfold', 'Seated Forward Fold', '🌿', 'Reach long, then fold'],
  ['standingfold', 'Standing Forward Fold', '🌱', 'Soft knees, hang heavy'],
  ['hamstring', 'Hamstring Stretch', '🥓', 'Heel out, hinge forward'],
  ['quad', 'Quad Stretch', '🍗', 'Heel to glute, knees together'],
  ['calf', 'Calf Stretch', '🥾', 'Heel down, lean in'],
  ['sidebend', 'Side Bend', '🌗', 'Reach up and over'],
  ['spinaltwist', 'Spinal Twist', '🍥', 'Sit tall, twist from the middle'],
  ['supinetwist', 'Supine Spinal Twist', '🥨', 'Knees over, shoulders down'],
  ['threadneedle', 'Thread the Needle', '🪡', 'Slide an arm under, melt the shoulder'],
  ['shoulderrolls', 'Shoulder Rolls', '🔁', 'Big slow circles'],
  ['neckrolls', 'Neck Rolls (Gentle)', '🦒', 'Slow and easy, no force'],
  ['wristcircles', 'Wrist Circles', '🔘', 'Circle both ways'],
  ['anklecircles', 'Ankle Circles', '🩴', 'Draw big slow circles'],
  ['hipcircles', 'Hip Circles', '🪩', 'Big circles, loosen up'],
  ['deepsquat', 'Deep Squat Hold', '🪴', 'Heels down, chest up, elbows in'],
  ['ninety', '90/90 Hip Switches', '🔀', 'Rotate knees side to side'],
  ['thoracic', 'Thoracic Rotations', '🧿', 'Hand behind head, open the chest'],
  ['glutestretch', 'Glute Stretch', '🍩', 'Pull the knee across'],
  ['chestopener', 'Chest Opener', '🦚', 'Hands clasped, squeeze the blades'],
  ['wallchest', 'Wall Chest Stretch', '🏠', 'Arm on the wall, turn away'],
  ['happybaby', 'Happy Baby', '👶', 'Hold the feet, knees wide'],
  ['kneestochest', 'Knees to Chest', '🤗', 'Hug in, rock gently'],
  ['breathing', 'Supine Breathing', '🌬️', 'In through the nose, out slow'],
  ['stretch', 'Full-Body Stretch', '✨', 'Breathe slow, reach far'],
])

export const EXERCISES: Record<string, Exercise> = { ...LOWER, ...UPPER, ...CORE, ...HIIT, ...STRETCH }

/** Ids that have GOYA pose art (art/exercises.py): /sprites/ex/<id>-1.png and -2.png, alternated on the workout stage.
 *  Everything else falls back to its emoji. */
const SPRITED = ['jacks', 'squats', 'pushups', 'climbers', 'burpees', 'plank', 'highknees', 'lunges', 'crunches', 'bridges', 'boxing', 'wallsit', 'skaters', 'twists', 'legraise', 'stretch']
for (const id of SPRITED) EXERCISES[id].sprite = `/sprites/ex/${id}-1.png`
export const spriteFrames = (ex: Exercise) => (ex.sprite ? [ex.sprite, ex.sprite.replace('-1.png', '-2.png')] : [])

/* ---------- Workouts ---------- */
export type Category = Group
export type Workout = {
  id: string; title: string; emoji: string; category: Category
  level: 'Easy' | 'Medium' | 'Hard'
  steps: { ex: string; secs: number }[]
  rest: number          // seconds of rest
  groupSize: number     // rest after every N moves (1 = after each move; 3 = one rest per round)
  rounds?: number       // for circuits: how many times the group repeats
  equipment: string; boss?: boolean
}
/** Rest (seconds) that follows move `i`; 0 when none (mid-round, or after the last move). */
export const restAfter = (w: Workout, i: number) => (i < w.steps.length - 1 && (i + 1) % w.groupSize === 0 ? w.rest : 0)
export const totalSecs = (w: Workout) => w.steps.reduce((a, s, i) => a + s.secs + restAfter(w, i), 0)
export const minutesOf = (w: Workout) => Math.max(1, Math.round(totalSecs(w) / 60))
export const kcalOf = (w: Workout) => Math.round((totalSecs(w) / 60) * (w.category === 'Stretch' ? 3 : w.category === 'HIIT' ? 12 : 8))

const rep = (ids: string[], n: number) => Array.from({ length: n }, () => ids).flat()
/** House rule: EVERY move is 30 seconds and EVERY break is 30 seconds. No exceptions. */
export const WORK_SECS = 30
export const REST_SECS = 30
const mk = (id: string, title: string, emoji: string, category: Category, level: Workout['level'],
  ids: string[], extra: Partial<Workout> = {}): Workout => ({
  id, title, emoji, category, level, rest: REST_SECS, groupSize: 1, equipment: 'None', steps: ids.map((ex) => ({ ex, secs: WORK_SECS })), ...extra,
})

/** Circuit: the same group of moves repeated `rounds` times, rest after each round. */
const cir = (id: string, title: string, emoji: string, category: Category, level: Workout['level'],
  ids: string[], rounds: number): Workout =>
  mk(id, title, emoji, category, level, rep(ids, rounds), { groupSize: ids.length, rounds })

/* Rule: every workout is at least 3 rounds OR at least 7 minutes, and every move belongs to the workout's category
   (enforced by scratchpad/check.ts). */
export const LIBRARY: Workout[] = [
  // HIIT
  cir('quick-hit', 'Quick Hit', '⚡', 'HIIT', 'Easy', ['jacks', 'highknees', 'buttkicks'], 3),
  cir('wake-up', 'Wake-Up Circuit', '☀️', 'HIIT', 'Easy', ['jacks', 'highknees', 'runinplace', 'fastfeet'], 3),
  cir('court-training', 'HIIT: Court Training', '🏛', 'HIIT', 'Medium', ['jacks', 'jumpsquats', 'climbers'], 4),
  cir('cardio-party', 'Cardio Party', '🎉', 'HIIT', 'Medium', ['boxershuffle', 'punchingjacks', 'speedskaters', 'highknees'], 3),
  cir('jump-power', 'Jump Power', '🦘', 'HIIT', 'Hard', ['jumpsquats', 'broadjumps', 'tuckjumps', 'frogjumps'], 3),
  cir('burpee-showdown', 'Burpee Showdown', '🔥', 'HIIT', 'Hard', ['burpees', 'climbers', 'highknees'], 3),
  mk('full-body-10', 'Full Body 10', '🏆', 'HIIT', 'Hard', ['jacks', 'squatthrusts', 'highknees', 'burpees', 'climbers', 'jumpsquats', 'speedskaters', 'tuckjumps', 'punchingjacks', 'broadjumps']),
  // Lower body
  cir('glute-wake-up', 'Glute Wake-Up', '🍑', 'Lower', 'Easy', ['bridges', 'donkeykicks', 'hydrants', 'clamshells'], 3),
  cir('leg-day', 'Leg Day Lite', '🦵', 'Lower', 'Medium', ['squats', 'lunges', 'wallsit'], 3),
  cir('booty-burn', 'Booty Burn', '🔥', 'Lower', 'Medium', ['slbridges', 'frogpumps', 'bridgepulses', 'kickbacks'], 3),
  cir('side-to-side', 'Side-to-Side Legs', '↔️', 'Lower', 'Medium', ['laterallunges', 'curtsylunges', 'lateralwalks', 'sumosquats'], 3),
  cir('hinge-and-hammies', 'Hinge & Hammies', '🌅', 'Lower', 'Medium', ['goodmornings', 'slrdl', 'hamwalkouts', 'bridges'], 3),
  cir('booty-boss', 'Booty Boss', '👑', 'Lower', 'Hard', ['bulgarians', 'slbridges', 'curtsylunges', 'jumpsquats'], 4),
  // Upper body
  cir('push-starter', 'Push Starter', '🧱', 'Upper', 'Easy', ['wallpushups', 'inclinepushups', 'kneepushups', 'armcircles'], 3),
  cir('posture-reset', 'Posture Reset', '😇', 'Upper', 'Easy', ['superman', 'snowangels', 'ytw', 'wallangels'], 3),
  cir('push-power', 'Push Power', '💪', 'Upper', 'Medium', ['pushups', 'pushuptaps', 'dips'], 3),
  cir('shoulder-sculpt', 'Shoulder Sculpt', '🔺', 'Upper', 'Medium', ['pikepushups', 'scappushups', 'armpulses', 'ytw'], 3),
  cir('chest-and-triceps', 'Chest & Triceps', '💎', 'Upper', 'Medium', ['widepushups', 'diamondpushups', 'dips', 'declinepushups'], 3),
  cir('push-up-ladder', 'Push-Up Ladder', '🏹', 'Upper', 'Hard', ['archerpushups', 'diamondpushups', 'pikepushups', 'declinepushups'], 4),
  // Core
  cir('ab-starter', 'Ab Starter', '🪲', 'Core', 'Easy', ['deadbugs', 'birddogs', 'crunches', 'reversecrunches'], 3),
  cir('core-crush', 'Core Crush', '🌀', 'Core', 'Medium', ['plank', 'crunches', 'twists'], 3),
  cir('lower-abs', 'Lower Ab Lab', '🦋', 'Core', 'Medium', ['legraise', 'flutter', 'scissors', 'reversecrunches'], 3),
  cir('side-burn', 'Obliques & Waist', '🌊', 'Core', 'Medium', ['bicycles', 'sideplankdips', 'heeltouches', 'twists'], 3),
  cir('plank-party', 'Plank Party', '🧱', 'Core', 'Hard', ['highplank', 'plankshouldertaps', 'plankkneedrives', 'sideplank'], 4),
  cir('hollow-fire', 'Hollow Fire', '🌙', 'Core', 'Hard', ['hollowhold', 'hollowrocks', 'vups', 'tuckups'], 3),
  // Mobility & stretch
  cir('desk-reset', 'Desk Reset', '🪑', 'Stretch', 'Easy', ['neckrolls', 'shoulderrolls', 'thoracic', 'catcow'], 3),
  cir('cooldown', 'Cooldown Stretch', '🧘', 'Stretch', 'Easy', ['standingfold', 'quad', 'hamstring', 'stretch'], 3),
  cir('hip-opener', 'Hip Opener', '🕊️', 'Stretch', 'Easy', ['pigeon', 'figurefour', 'butterfly', 'hipflexor'], 3),
  cir('back-release', 'Back Release', '🐈', 'Stretch', 'Easy', ['catcow', 'childspose', 'threadneedle', 'supinetwist'], 3),
  cir('wind-down', 'Wind-Down', '🌙', 'Stretch', 'Easy', ['happybaby', 'kneestochest', 'breathing', 'stretch'], 3),
]

/* ---------- Worlds: unlocked by total workouts completed. Each world drills one target. ---------- */
export type World = { id: string; name: string; emoji: string; blurb: string; unlockAt: number; boss: string; category: Category; pool: string[] }
export const WORLDS: World[] = [
  { id: 'steps', name: 'Courthouse Steps', emoji: '🏛', blurb: 'Warm up. Everyone starts on the steps.', unlockAt: 0, boss: 'The Bailiff', category: 'HIIT',
    pool: ['jacks', 'highknees', 'buttkicks', 'fastfeet', 'runinplace', 'halfjacks', 'starjumps', 'boxershuffle'] },
  { id: 'gym', name: 'Gym Gauntlet', emoji: '🏋️', blurb: 'Leg day. The prosecution brought weights.', unlockAt: 17, boss: 'The Prosecutor', category: 'Lower',
    pool: ['squats', 'lunges', 'sumosquats', 'stepups', 'bridges', 'splitsquats', 'laterallunges', 'curtsylunges', 'donkeykicks'] },
  { id: 'evidence', name: 'Evidence Room', emoji: '🗄️', blurb: 'Core strength is the best evidence.', unlockAt: 34, boss: 'The Clerk', category: 'Core',
    pool: ['plank', 'crunches', 'twists', 'legraise', 'deadbugs', 'birddogs', 'bicycles', 'flutter'] },
  { id: 'heights', name: 'High Court Heights', emoji: '⚖️', blurb: 'Thin air. Thick sweat. Arms and shoulders.', unlockAt: 51, boss: 'The Judge', category: 'Upper',
    pool: ['pushups', 'pikepushups', 'dips', 'boxing', 'widepushups', 'pushuptaps', 'diamondpushups', 'superman'] },
  { id: 'supreme', name: 'Supreme Court', emoji: '👑', blurb: 'Final appeal. All-out cardio. No excuses.', unlockAt: 68, boss: 'The Chief Justice', category: 'HIIT',
    pool: ['burpees', 'climbers', 'jumpsquats', 'tuckjumps', 'squatthrusts', 'speedskaters', 'plankjacks', 'broadjumps'] },
]
export const NODES_PER_WORLD = 5
/** Workouts that must be cleared, in order, to beat each stage of a world (the last stage is the boss). */
export const PARTS_PER_STAGE = [2, 3, 3, 4, 5]
export const WORKOUTS_PER_WORLD = PARTS_PER_STAGE.reduce((a, b) => a + b, 0)

export type Stage = { id: string; title: string; emoji: string; boss: boolean; parts: Workout[] }
export const partsDone = (st: Stage, completed: Record<string, { stars: number }>) => st.parts.filter((p) => completed[p.id]).length
export const stageCleared = (st: Stage, completed: Record<string, { stars: number }>) => partsDone(st, completed) === st.parts.length
/** Stars for a stage = its weakest workout. */
export const stageStars = (st: Stage, completed: Record<string, { stars: number }>) => Math.min(...st.parts.map((p) => completed[p.id]?.stars ?? 0))

export const stagesOf = (wi: number): Stage[] => {
  const wd = WORLDS[wi]
  return PARTS_PER_STAGE.map((count, i) => {
    const boss = i === NODES_PER_WORLD - 1
    const id = `${wd.id}-${i}`
    const title = boss ? `BOSS: ${wd.boss}` : `${wd.name} ${i + 1}`
    const parts = Array.from({ length: count }, (_, p) => {
      const finale = p === count - 1
      const perRound = boss || i >= 2 || finale ? 4 : 3
      const ids = Array.from({ length: perRound }, (_, k) => wd.pool[(i * 2 + p * 3 + k + wi) % wd.pool.length])
      const w = cir(`${id}-p${p + 1}`, `${title} · ${p + 1}/${count}`, boss ? '👑' : wd.emoji,
        wd.category, wi < 1 ? 'Easy' : wi < 3 ? 'Medium' : 'Hard', ids, boss && finale ? 4 : 3)
      return { ...w, boss: boss && finale }
    })
    return { id, title, emoji: boss ? '👑' : wd.emoji, boss, parts }
  })
}
export const ALL_STAGES: Stage[][] = WORLDS.map((_, wi) => stagesOf(wi))
export const ALL_NODES: Workout[] = ALL_STAGES.flat().flatMap((st) => st.parts)
export const getWorkout = (id?: string) => [...LIBRARY, ...ALL_NODES].find((w) => w.id === id)

/* ---------- Goya's hype lines ---------- */
export const LINES = {
  work: ['HOLD IT! Do not stop now!', 'Objection to sitting down!', 'The jury is watching. Move!', 'TAKE THAT! Keep going!', "You're stronger than your excuses.", 'Sweat is evidence. Make more.'],
  mid: ['HALFWAY! Court is still in session.', "Half done. You're not quitting now."],
  last: ['LAST ONE! Empty the tank!', 'FINAL ARGUMENT! Give it everything!'],
  rest: ['Breathe. Hydrate.', 'Shake it out. Next one is coming.', "Nice work. Don't get comfy."],
  nice: ['NICE!', 'CRUSHED IT!', 'BOOM!', 'OBJECTION OVERRULED!', 'YES!', 'SUSTAINED!'],
}
export const pick = <T,>(arr: T[], i: number) => arr[i % arr.length]

/* ---------- Programs, missions, cosmetics ---------- */
export type Program = { id: string; title: string; meta: string; tag: string; icon: string }
export const PROGRAMS: Program[] = [
  { id: 'bootcamp', title: 'Court Bootcamp', meta: '4 weeks · HIIT', tag: 'HIIT', icon: '🏛' },
  { id: 'strength', title: 'Strength Evidence', meta: '4 weeks · Full Body', tag: 'Strength', icon: '🗿' },
  { id: 'lean', title: 'Lean & Toned', meta: '4 weeks · HIIT + Core', tag: 'Core', icon: '🏛' },
  { id: 'consistency', title: 'Consistency Case', meta: '8 weeks · Habit Builder', tag: 'Strength', icon: '⚖' },
]

export type MissionDef = {
  id: string; scope: 'Daily' | 'Weekly' | 'Cases'; label: string; reward: number
  cond: 'workout' | 'hiit' | 'core' | 'streak7' | 'week4' | 'kcal' | 'boss' | 'streak14'
}
export const MISSIONS: MissionDef[] = [
  { id: 'd-workout', scope: 'Daily', label: 'Complete a workout', reward: 10, cond: 'workout' },
  { id: 'd-hiit', scope: 'Daily', label: 'Finish a HIIT workout', reward: 10, cond: 'hiit' },
  { id: 'd-core', scope: 'Daily', label: 'Do a core workout', reward: 10, cond: 'core' },
  { id: 'd-streak', scope: 'Daily', label: 'Keep your streak', reward: 20, cond: 'streak7' },
  { id: 'w-four', scope: 'Weekly', label: 'Work out 4 days this week', reward: 40, cond: 'week4' },
  { id: 'w-burn', scope: 'Weekly', label: 'Burn 1,500 kcal', reward: 40, cond: 'kcal' },
  { id: 'c-boss', scope: 'Cases', label: 'Defeat your first boss', reward: 100, cond: 'boss' },
  { id: 'c-streak', scope: 'Cases', label: 'Reach a 14-day streak', reward: 150, cond: 'streak14' },
]

export type Cosmetic = { id: string; name: string; unlockLevel: number }
export const COSMETICS: Record<'Outfits' | 'Frames' | 'Titles', Cosmetic[]> = {
  Outfits: [
    { id: 'suit', name: 'Courtroom Suit', unlockLevel: 1 },
    { id: 'gym', name: 'Gym Fit', unlockLevel: 2 },
    { id: 'rest', name: 'Rest Day', unlockLevel: 3 },
    { id: 'champ', name: 'Champion Robes', unlockLevel: 6 },
  ],
  Frames: [
    { id: 'plain', name: 'Plain', unlockLevel: 1 },
    { id: 'gold', name: 'Gold Trim', unlockLevel: 3 },
    { id: 'laurel', name: 'Laurel Wreath', unlockLevel: 5 },
  ],
  Titles: [
    { id: 'rookie', name: 'Rookie Attorney', unlockLevel: 1 },
    { id: 'defender', name: 'Defender of Gains', unlockLevel: 3 },
    { id: 'justice', name: 'Chief Justice', unlockLevel: 8 },
  ],
}

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
