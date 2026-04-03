# Jerry's Apartment

A browser-based recreation of the "Party House" mini-game from UFO 50, built with Next.js.

## Cursor Cloud specific instructions

### Project overview

Single Next.js 16 app (React 19, TypeScript, Tailwind CSS 4). No backend, no database — all game logic runs client-side via `useReducer`. Only one service to run: the Next.js dev server.

### Node version

Node 22 is required (see `.nvmrc`).

### Common commands

All standard commands are in `package.json`:
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint (0 errors expected; a few warnings exist)

### Notes

- The game uses keyboard navigation (arrow keys + X/Z). There is no mouse-click interaction for gameplay — buttons and cards are navigated via keyboard.
- No environment variables or secrets are needed.
- No tests are configured in the repository (no test runner or test files).
