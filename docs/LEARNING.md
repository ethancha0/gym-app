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

---

## Milestone 1 — Design system

### Decisions

- **NativeWind v4.2.7 (Tailwind 3) + react-native-reusables, chosen by Ethan over a StyleSheet kit or Tamagui.** Familiar Tailwind classes, and reusables gives copy-in components we own. Not v5: its docs call it a pre-release "not intended for production use", and reusables doesn't support it. Cost: a build-time layer between our code and RN styles, so config changes need `npx expo start -c`.
- **One color vocabulary (ours), no shadcn aliases.** Reusables uses shadcn names (`primary`, `muted-foreground`); mapping them onto our tokens would give every color two names, and shadcn's `accent` (gray hover) clashes with ours (lavender). Reusables components are rewritten to our classes when added. Text colors use iOS names (`text-label`, `text-label-secondary`) to avoid `text-text-primary`.
- **Tokens in one CommonJS file (`src/theme/tokens.js`).** tailwind.config.js `require`s it in Node; TS imports it for places that need raw colors (nav theme, native Switch). Alternative: duplicate values in two places (they'd drift).
- **tailwind-merge pinned to v2.6 and extended with our font sizes.** v3 targets Tailwind 4. Unextended, it treats `text-headline` (size) and `text-label` (color) as conflicting and silently drops one. Covered by `src/lib/utils.test.ts`.
- **Native tab bar (`NativeTabs`) over JS tabs.** Real UITabBar (SF Symbols, Liquid Glass on iOS 26). Tradeoff: still under `expo-router/unstable-native-tabs` in SDK 57, so the API may change on upgrade.
- **A Stack inside each tab** for native large titles and in-tab pushes (Routines → editor, Progress → exercise detail).
- **Header colors come only from the navigation theme.** Setting `headerStyle`/`headerTintColor`/`header*TitleStyle` per screen made the large title disappear on iOS 26; the theme (`text`, `card`, `primary`) already does the job.
- **Native controls where iOS has them:** RN's built-in `Switch` (real UISwitch) instead of reusables' JS switch; `@expo/ui` SwiftUI `Picker` for the segmented control; an Expo Router **formSheet route** for bottom sheets (native grabber, detents, swipe-to-dismiss) instead of `@gorhom/bottom-sheet`. Tradeoff for the sheet: it's a route, so data goes in via params or a store, not props.
- **Kept reusables' `TextClassContext` pattern** so `<Button>` can style the `<AppText>` inside it. Renamed Text → `AppText` so a stray `Text` import from `react-native` (black by default, invisible on our background) is easy to spot.

### React Native concepts

- **No CSS cascade:** a `<Text>` inside a `<View>` never inherits color/font from the View (nested Text inside Text does). Workaround: React context. — `src/components/ui/text.tsx` (`TextClassContext`)
- **All styling is JS objects on `style`:** NativeWind compiles classNames into those objects at build time via Babel (`jsxImportSource`) and Metro (`withNativeWind`). — `babel.config.js`, `metro.config.js`
- **Config files load once at Metro startup:** Fast Refresh only re-sends JS modules; Babel/Metro/Tailwind config changes need a restart with `-c` (clear cache).
- **Props vs. styles for native components:** some colors are props, not styles (`SymbolView.tintColor`, `TextInput.placeholderTextColor`, `Switch.trackColor`). `cssInterop` can map a className's color onto a prop. — `src/components/ui/icon.tsx`
- **Dynamic values go in `style`, not className:** classNames must exist at build time; a computed width like `${pct}%` goes in `style`. — `src/components/ui/progress-bar.tsx`
- **Pressable + `active:`:** touch feedback comes from Pressable's pressed state (no `:hover` on touch). `hitSlop` enlarges the touch area without changing layout (44pt rule). — `button.tsx`, `chip.tsx`, `check-circle.tsx`
- **Safe areas via the native header:** `contentInsetAdjustmentBehavior="automatic"` lets iOS inset scroll content below the header and above the tab bar, and lets large titles collapse. — `src/components/screen.tsx`
- **File-based routing needs a file for every URL:** the app launches at `/`, so `src/app/index.tsx` redirects to `/today`. Route groups like `(tabs)` don't appear in the URL.
- **`<Host>` is the RN ↔ SwiftUI boundary:** outside it Flexbox lays things out, inside it SwiftUI does. — `src/components/ui/segmented-control.tsx`
- **Accessibility props:** `role`, `accessibilityLabel` (required on icon-only buttons), `accessibilityState` (checked/selected/disabled), `accessibilityValue` (progress). — `icon-button.tsx`, `check-circle.tsx`, `progress-bar.tsx`
- **Dynamic Type:** RN `Text`/`TextInput` scale with the system text size by default; `maxFontSizeMultiplier` caps it where space is tight. — `number-field.tsx`
- **San Francisco already uses tabular (equal-width) digits by default;** `tabular-nums` documents intent and protects against other fonts.
- **`__DEV__`** is true only in development; dev-only UI (the gallery link) is stripped from release builds. — `src/app/settings.tsx`

### Open questions

- Expo Go on the iPhone hung on "Opening project" while the simulator worked. Likely Local Network permission or campus Wi-Fi client isolation; `npx expo start --tunnel` is the fallback.
- Revisit whether `NativeTabs` has moved out of `unstable-` on the next SDK upgrade.
