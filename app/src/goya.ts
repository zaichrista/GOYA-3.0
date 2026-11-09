/** Sprites per outfit. `body` is the full-body art (home, splash, results...), `face` the small avatar. Outfits without art fall back to the suit. */
const ART: Record<string, { body: string; face: string }> = {
  suit: { body: '/sprites/goya-full.png', face: '/sprites/goya-avatar.png' },
  gym: { body: '/sprites/goya-workout.png', face: '/sprites/goya-workout-avatar.png' },
  rest: { body: '/sprites/goya-rest.png', face: '/sprites/goya-rest-avatar.png' },
}

export const outfitArt = (outfit: string) => ART[outfit] ?? ART.suit
