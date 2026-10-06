# Learning Log

One section per milestone: decisions, React Native concepts, and open questions.

---

## Milestone 0 — Project setup

### Decisions

- **Standalone git repo in `gym-app/`.** The folder was inside a git repo rooted at the home directory (remote `ai-project`). A dedicated repo keeps this project's history clean and avoids committing unrelated files. Alternative: a subfolder of the home repo (rejected: wrong remote, noisy status).
- **Expo SDK 57 with the default `create-expo-app` template, then `reset-project`.** The template wires up TypeScript, Expo Router, Reanimated, gesture handler, and safe-area. Expo Go only runs the latest SDK, so starting on 57 means it just works on the phone. Alternative: `blank-typescript` + adding the router by hand (more typing, little extra learning). The template's example code is kept locally in `example/` (gitignored) for reference.
- **Routes live in `src/app/`, not `app/` as HANDOFF.md says.** This is the current Expo template convention: screens in `src/app/`, everything else in `src/`. One `src/` root keeps the `@/` import alias simple.
- **ESLint via `npx expo lint` (`eslint-config-expo`) + Prettier as an ESLint rule.** Expo's guide recommends this, so one command (`npx expo lint`) checks both correctness and formatting. Alternative: run Prettier separately with only `eslint-config-prettier` (two commands to remember).
- **Jest with the `jest-expo` preset.** It mocks Expo's native modules, so tests run in Node. `npm test` runs once; `npm run test:watch` watches. React Native Testing Library is deferred until there are components worth testing.
- **Kept template dependencies we don't use yet** (`expo-symbols`, `@expo/ui`, `expo-image`, `expo-glass-effect`). Several are relevant to the Milestone 1 UI decision (SF Symbols icons, native SwiftUI components); prune whatever we don't pick then.

### React Native concepts

- **Expo vs. bare React Native:** Expo is a framework and toolchain on top of React Native: SDK modules, a CLI, config-driven native projects, cloud builds. "Bare" means you own and edit the `ios/` and `android/` folders yourself. — `app.json`
- **Continuous Native Generation (CNG):** `ios/` and `android/` aren't committed; Expo generates them from `app.json` and config plugins when needed. — `.gitignore` (`/ios`, `/android`)
- **Expo Go vs. development build:** Expo Go is a prebuilt app containing a fixed set of native modules, and your JS bundle loads into it. A development build is your own app binary with exactly the native modules you choose. Expo Go is enough until we add a library whose native code isn't bundled in Expo Go. We check this per library.
- **Metro:** React Native's bundler. It turns `src/` into one JS bundle and serves it over your Wi-Fi to the phone. Release builds compile it to Hermes bytecode (`.hbc`). — `npx expo start`
- **Fast Refresh:** on save, Metro sends only the changed module. React re-renders while keeping component state, as long as the file only exports components. — any file in `src/app/`
- **File-based routing:** every file in `src/app/` is a route (`index.tsx` → `/`), and `_layout.tsx` defines the navigator (Stack, Tabs) that wraps its sibling routes. `package.json` `"main": "expo-router/entry"` boots the router. — `src/app/_layout.tsx`
- **New Architecture:** JS talks to native code through JSI (direct C++ calls, no JSON bridge), renders through Fabric (a synchronous, concurrent-capable renderer), and loads native modules lazily through TurboModules. It is the only architecture in current React Native.
- **React Compiler is on** (`experiments.reactCompiler` in `app.json`). It auto-memoizes components and hooks at build time, which changes how much manual `useMemo`/`memo` we'll need in Milestone 3. — `app.json`

### Open questions

- _(none yet)_
