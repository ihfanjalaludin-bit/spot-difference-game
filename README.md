# spot-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ihfanjalaludin-bit/spot-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ihfanjalaludin-bit/spot-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

## About the game

Park Pair is a spot-the-difference game drawn entirely on a canvas.
Two pictures of the same little park sit side by side — a sunny lawn
with trees, a cottage, a bench and a duck pond — but the right-hand
picture quietly changes seven things: a colour shifts, something
vanishes, and the duck moves house. Click a difference in either
picture to circle it in both. Find all seven before the 90-second
clock runs out; every wrong click costs five seconds. The layout is
deterministic from a seed in the query string (`?seed=1`), so the
same seed always deals the same park.

## Run it

To play the game locally:

```
node serve.ts
```

then open http://localhost:8080 in a desktop browser. No build step
and no dependencies — the game is plain static files under `game/`
and runs fully offline.

`node main.ts` is the submission program, not the game launcher: it
copies `game/` and `screenshots/` into the output folder
(`MAKEFUN_OUTPUT_DIR`, or `/output` by default) and writes the
`dossier.json` summary there.
