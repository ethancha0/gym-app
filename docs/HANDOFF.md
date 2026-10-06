# Workout Tracker — Claude Code Handoff

A local-first iOS workout tracker built with React Native (Expo). It covers everything RepCount Premium offers, plus auto-progression, warm-up generation, natural-language logging, and a weekly AI coach.

The owner is **Ethan**, a CS student who is building this to **learn React Native deeply**, not just to get an app. Read the "How to work with Ethan" section before writing any code. It overrides your default pace and style.

---

## 1. How to work with Ethan (read first)

Ethan wants to understand how this app is built while it is being built. Optimizing for speed of delivery is the wrong goal. Optimize for **Ethan being able to explain and rebuild every part of this app himself.**

### Pause and teach, frequently

- **Before each milestone**, explain the plan in plain terms: what you'll build, which files you'll create, which libraries you'll add and why. Then wait for Ethan to say go.
- **During a milestone**, stop at every meaningful React Native decision and explain it before moving on. A "meaningful decision" includes, at minimum:
  - choosing or installing a library (what it does, the alternatives, why this one)
  - anything that behaves differently in React Native than on the web (layout, styling, text, scrolling, gestures, keyboard, navigation)
  - where state lives (component state vs. a store vs. the database) and why
  - performance choices (list virtualization, memoization, animations on the UI thread)
  - anything that needs a native module, a development build, or a permission
  - data model and migration decisions
- **After each milestone**, give a short recap: what was built, the 3–5 most important React Native concepts it used, and where to look in the code to see each one. Then give Ethan a test checklist and **stop**. Do not start the next milestone until Ethan approves.

### How to explain

- Lead with the decision, then the reason, then the alternative you didn't pick. Example: "I'm using `FlashList` instead of `ScrollView` here. `ScrollView` renders every row at once, which gets slow with long histories; `FlashList` only renders rows on screen and recycles them. `FlatList` is the built-in version of the same idea."
- Compare to web React when it helps. Ethan knows web React; point out where React Native differs (e.g., no CSS cascade, Flexbox defaults to `column`, all text must be inside `<Text>`, no DOM).
- Point to the exact file and lines you're talking about.
- Keep each explanation short (a few sentences to a short paragraph). Many small explanations beat one wall of text.
- Occasionally ask Ethan to predict something before you show it ("What do you think happens to this list if we remove `keyExtractor`?"). Don't overdo it: about once per milestone.

### Keep a learning log

Maintain `docs/LEARNING.md`. After every milestone, append:

- **Decisions** made, each in 2–3 lines: the decision, why, alternatives considered.
- **React Native concepts** introduced, each with a one-line definition and a file path where it appears.
- **Open questions** Ethan raised that are worth revisiting.

### Other working rules

- Small, focused commits, one concern each, with clear messages. Ethan will read the diffs.
- Don't add libraries beyond what a milestone needs. Each new dependency gets an explanation.
- Before installing any library, check its current docs for the latest version and Expo compatibility. Don't rely on memorized versions.
- Prefer clear code over clever code. Add comments where a React Native–specific behavior isn't obvious.
- If something in this document seems wrong or outdated, say so and propose an alternative instead of silently working around it.

---

## 2. Tech stack (proposed; confirm each in Milestone 0/1)

| Area | Choice | Why |
|---|---|---|
| Framework | Expo + React Native, TypeScript | Fastest path to running on Ethan's iPhone; managed native builds |
| Navigation | Expo Router (file-based) | Tabs + stacks + modals map directly to the screen list |
| UI library | **Decide in Milestone 1** (see options there) | Ethan explicitly wants a design library as the foundation |
| Local database | `expo-sqlite` + Drizzle ORM | Local-first, offline, typed queries and migrations |
| Active-workout state | Zustand | Fast in-memory state for the screen that changes every few seconds |
| Lists | FlashList (or FlatList) | Virtualized history and exercise lists |
| Charts | Victory Native (Skia) or react-native-gifted-charts | Decide in Milestone 6 and explain the tradeoff |
| Haptics / notifications | `expo-haptics`, `expo-notifications` | Set check-off feedback, rest-timer alert |
| CSV | `expo-file-system`, `expo-sharing`, `papaparse` | Export via the iOS share sheet, import from files |
| Tests | Jest (+ React Native Testing Library where useful) | All training math must be unit-tested |
| AI | Claude API behind a small server proxy | Never ship an API key inside the app |

**Out of scope for now:** Apple Health, Apple Watch, cloud sync, accounts, social features, Android polish.

---

## 3. Design system

Approved visual direction: **native iOS feel, dark theme, San Francisco type, gray surfaces, one lavender accent.** Map these tokens into whichever UI library is chosen.

### Colors

| Token | Value | Use |
|---|---|---|
| `background` | `#000000` | Screen background |
| `surface` | `#1C1C1E` | Cards, grouped lists, sheets |
| `surfaceRaised` | `#2C2C2E` | Inputs, chips, secondary buttons, inactive check circles |
| `surfaceHigh` | `#3A3A3C` | Inputs inside sheets, secondary buttons on surfaces |
| `separator` | `#38383A` | 0.5pt dividers between rows |
| `textPrimary` | `#FFFFFF` | Main text |
| `textSecondary` | `#8E8E93` | Captions, labels, metadata |
| `textTertiary` | `#636366` | "Previous" column, placeholder values, disabled |
| `accent` | `#AD9FB8` | Primary buttons, completed sets, links, AI suggestions, active tab |
| `onAccent` | `#1C1A1F` | Text and icons on accent fills |
| `completedRow` | `#232126` | Background of a completed working-set row |
| `warning` | `#E8C27A` | Under-target counts (e.g., low weekly sets) |
| `switchOff` | `#39393D` | Switch track when off |

Rule: **the accent is only for things you can act on or should notice.** Everything else is gray.

### Typography

Use the system font (San Francisco). Don't bundle a font. Use tabular numbers (`fontVariant: ['tabular-nums']`) anywhere numbers line up in columns.

| Style | Size / weight | Use |
|---|---|---|
| largeTitle | 34 / bold | Screen titles (Today, Routines, Push Day A) |
| title2 | 22 / bold | Card headlines, stat values |
| title3 | 20 / semibold | Exercise names, section titles |
| headline | 17 / semibold | Nav titles, buttons, set numbers |
| body | 17 / regular | Rows, inputs |
| subheadline | 15 / regular | Secondary lines, suggestion text |
| footnote | 13 / regular | Column labels, captions, section headers (uppercase) |
| caption | 11 / regular | Chart axes, tab labels (10) |

### Shape and spacing

- Radii: cards 12, inputs and chips 8, buttons 12, pills/full-round for the natural-language bar and check circles, sheets 14 (top corners).
- Screen side padding 16. Gap between cards 14–16. Row minimum height 44 (rows with two lines ≈ 56–60).
- **Every tap target is at least 44×44pt.**
- Grouped lists follow the iOS inset-grouped pattern: uppercase footnote section header, rounded surface card, 0.5pt separators between rows.

### Core components to build in Milestone 1

`AppText` (type scale variants) · `Card` · `GroupedList` / `ListRow` (with chevron, value, switch variants) · `Button` (primary/accent, secondary/gray, plain/text) · `IconButton` · `SegmentedControl` · `Switch` (styled to tokens) · `NumberField` (weight/reps cell) · `CheckCircle` · `Chip` · `ProgressBar` · `SectionHeader` · `BottomSheet` · tab bar styling.

---

## 4. Screens (from the approved mockups)

Ethan has the design canvas as a reference. These specs describe what each screen must contain.

1. **Today (tab)** — date + large title; "Up next" card with routine name, exercise count, duration estimate, exercise list, **Start Workout** (accent) and **Start Empty Workout** (gray); "This Week" 7-day strip (planned = dashed ring, done = accent fill, rest = faint ring, today's letter in accent); weekly Coach preview card linking to the Coach screen; latest PR card.
2. **Active workout (full-screen)** — nav bar: options button, elapsed time centered, **Finish** pill. Large title = routine name; subtitle = progress + total volume. One card per exercise:
   - exercise name (tappable → Exercise detail) and equipment
   - auto-progression line in accent (e.g., "Up 5 lb. You hit 8 reps on every set last time.")
   - columns **Set | Previous | lb | Reps | ✓**
   - warm-up rows labeled `W` in muted gray above working sets
   - suggested values pre-filled; completed working rows get `completedRow` background and an accent check
   - **Add Set** text button
   - Bottom bar: rest timer (−15 / progress bar with `1:24 / 2:00` / +15) and the natural-language input pill with sparkle icon and mic button.
3. **Natural-language log sheet (bottom sheet)** — shows what was typed as a chat bubble; "Matched to Bench Press · sets 1–3"; parsed rows (Set, lb, Reps, RPE) as editable fields with PR tags; note that nothing saves until confirmed; **Log N Sets** button; Cancel.
4. **Routines (tab)** — large title, + button, search field; current program section (rows: dot for "up next", name, exercise summary, last-done day, chevron); "Other" section; "Build a Program with Coach" button.
5. **Routine editor** — back to Routines, Done. Reorderable exercise rows (drag handle). An expanded exercise shows: working sets (e.g., 3 × 6–8), rest, progression rule with a plain-language explanation, **Generate warm-ups** switch with a preview of warm-up chips and plates per side.
6. **Exercise detail (Progress tab entry)** — segmented control: **Est. 1RM / Volume / Best Set**; big current value + delta; line chart with area fill over ~12 weeks; 2×2 PR tiles (Est. 1RM, Heaviest set, Best rep set, Session volume); recent history rows.
7. **Coach summary** — week range; one-sentence headline; three stat tiles (workouts done/planned, volume change, new PRs); "Needs attention" card (stalled lift, likely cause, suggested fix with **Apply to [routine]** / **Dismiss**); weekly sets per muscle as horizontal bars with a 10–20 target, under-target values in `warning`.
8. **Your Data (Settings)** — date range picker (All time / Last 90 days / Custom), include switches (warm-up sets, notes, bodyweight), monospaced CSV preview, live "N sets from M workouts" count, **Export CSV** (share sheet), **Import from Another App…**
9. **History (tab)** — not mocked yet. Build a simple list of past workouts by date that opens a read-only workout detail. Propose a layout to Ethan before building.

---

## 5. Domain rules (implement as pure, tested TypeScript)

All training math lives in `src/domain/` as pure functions with **no React or database imports**, and every function has Jest tests. Explain to Ethan why this separation matters.

- **Estimated 1RM:** Brzycki, `weight × 36 / (37 − reps)`, valid for 1–12 reps. Round to the nearest whole lb. The mockups use this (190 × 8 ≈ 236).
- **PRs** (per exercise): best estimated 1RM, heaviest weight lifted, best weight at each rep count, best single-session working volume. Warm-up sets never count.
- **Auto-progression (double progression, the default rule):** each exercise has a rep range [min, max] and an increment (5 lb barbell, 5 lb dumbbell per hand configurable). If every working set last session hit `max` reps → suggest `weight + increment` at `min` reps. Otherwise → suggest the same weight with reps = last session's reps + 1, capped at `max`. Also support a "reps first" rule (add reps only) for isolation movements.
- **Warm-up generator:** for a working weight `W` on a barbell lift: bar × 10, ~50% × 5, ~70% × 3, ~85% × 1, rounded down to the nearest 5 lb and de-duplicated. Skip steps that are at or below the bar weight; skip warm-ups entirely if `W` ≤ 95 lb (just bar × 10). Return plates per side for each step.
- **Plate calculator:** 45 lb bar; plates 45, 35, 25, 10, 5, 2.5 (configurable); greedy from heaviest; report any remainder that can't be loaded.
- **Plateau detection:** an exercise is "stalled" if its best estimated 1RM hasn't improved across its last 3 sessions spanning at least 14 days. Diagnostics to compute (deterministically) for the coach: rest-time trend, rep-drop pattern across sets, session frequency for that lift.
- **Weekly volume by muscle:** count working sets per primary muscle (secondary muscles count as half a set). Target band 10–20.
- **Units:** store weights in **kg as REAL** or **lb with a unit column**. Pick one in Milestone 2 and explain. Display in lb by default.

---

## 6. Data model (starting point; refine in Milestone 2)

- `exercises` — id, name, equipment, primary_muscle, secondary_muscles (JSON), is_custom
- `routines` — id, name, program_name, position, notes
- `routine_exercises` — id, routine_id, exercise_id, position, target_sets, rep_min, rep_max, rest_seconds, progression_rule, increment, warmups_enabled
- `workouts` — id, routine_id (nullable), started_at, finished_at, notes
- `sets` — id, workout_id, exercise_id, position, is_warmup, weight, reps, rpe (nullable), completed_at
- `coach_reports` — id, week_start, payload JSON, created_at
- `suggestions` — id, type, exercise_id, routine_id, payload JSON, status (pending/applied/dismissed)

Seed an exercise library (~80 common lifts with equipment and muscles).

---

## 7. AI features — architecture

- **Never put an API key in the app.** Add a tiny proxy (e.g., a Cloudflare Worker or Supabase Edge Function) in `server/` that holds the Claude API key and exposes two endpoints: `/parse-log` and `/coach-summary`. Explain the security reason to Ethan.
- **Deterministic first, LLM second.** The app computes all numbers (1RM, PRs, volumes, plateau signals). The LLM only (a) turns free text into structured sets and (b) writes plain-language summaries and suggestions from numbers the app already computed. The LLM never invents numbers.
- **Structured output.** Both endpoints return strict JSON validated with a schema (e.g., Zod) on the server and again in the app. On parse failure, show a friendly error and keep the user's text.
- **`/parse-log`** input: the text, the current workout's exercises, and recent sets. Output: `{ exerciseId, sets: [{ weight, reps, rpe? }], confidence, ambiguity? }`. If ambiguous, the sheet asks the user to pick instead of guessing.
- **`/coach-summary`** input: the week's computed stats JSON. Output: headline, wins, needs-attention items with suggested changes in a machine-applicable format (e.g., `{ routineExerciseId, newWeight, newRepRange, newRest }`). Suggestions only change routines when the user taps **Apply**.
- Speech: use iOS dictation (keyboard mic) first. A custom speech-to-text button can come later.
- Check the current Claude API docs for model names, structured output support, and pricing before building.

---

## 8. Milestones

Each milestone ends with: a recap, updates to `docs/LEARNING.md`, a test checklist for Ethan, and a **full stop** until he approves.

### Milestone 0 — Project setup
- Create the Expo app with TypeScript and Expo Router; folder structure (`app/`, `src/components`, `src/domain`, `src/db`, `src/stores`, `docs/`); ESLint + Prettier; Jest.
- Run it on Ethan's iPhone with Expo Go.
- **Teach:** what Expo is vs. bare React Native; Expo Go vs. development builds and when we'll need one; how Metro bundling and fast refresh work; how file-based routing maps to screens; the New Architecture at a high level.
- **Ethan tests:** the app opens on his phone; an edit shows up instantly.

### Milestone 1 — Design system
- Present 2–3 UI library options with tradeoffs and a recommendation, and let Ethan choose. Candidates to evaluate: **Tamagui** (tokens/themes, compiler), **NativeWind + react-native-reusables** (Tailwind-style), **gluestack-ui**, or a thin custom kit on `StyleSheet`. Material libraries (e.g., React Native Paper) are a poor fit for the iOS look.
- Implement the tokens from §3 and the core components.
- Build a hidden **component gallery** screen showing every component and state.
- Set up the four tabs with empty placeholder screens; dark theme only.
- **Teach:** how styling works in React Native (no cascade, style arrays, Flexbox defaults), how the chosen library generates styles, safe areas, how `Text` differs from web text, `Pressable` and touch feedback, accessibility props.
- **Ethan tests:** the gallery matches the mockups' look on his phone; Dynamic Type at a larger size doesn't break layouts badly.

### Milestone 2 — Data layer
- `expo-sqlite` + Drizzle schema from §6, migrations, exercise seed data, and a repository layer (`src/db/`) with typed functions.
- **Teach:** why local-first; SQLite on device; how migrations run on app start; async data access in React Native; where we keep server-free state; how Drizzle maps to SQL.
- **Ethan tests:** a debug screen lists seeded exercises; creating a test row survives an app restart.

### Milestone 3 — Core logging MVP
- Routines list and a basic routine editor (add/remove/reorder exercises, sets and rep range).
- Start a workout from a routine or empty; active workout screen with set rows, **Previous** column from the last session, number entry, check-off with haptics, Add Set, Finish → saved.
- A basic History tab list.
- **Teach:** Zustand store for the in-progress workout vs. writing to SQLite (and when we persist); keyboard handling (`KeyboardAvoidingView`, numeric keyboards); list virtualization; avoiding re-renders when one cell changes (memoization, selectors); navigation stacks vs. modals.
- **Ethan tests:** log a full real workout at the gym; kill the app mid-workout and confirm nothing is lost (define the recovery behavior with Ethan first).

### Milestone 4 — Rest timer
- Timer starts on set check-off, using the routine's rest time; ±15s; progress bar; a local notification and haptic when rest ends, including when the app is in the background.
- **Teach:** why timers must be timestamp-based (JS timers pause in the background); app state events; local notifications and permissions; animating progress with Reanimated on the UI thread.
- **Ethan tests:** lock the phone during rest and get notified on time; timer is accurate after switching apps.

### Milestone 5 — Training logic
- Implement §5 in `src/domain/` with Jest tests: estimated 1RM, PR detection, double progression, warm-up generator, plate calculator.
- Wire into the UI: suggested values pre-filled, the progression line on each exercise card, warm-up rows, the routine editor's progression rule and warm-up switch with preview and plates per side, PR tags on completed sets.
- **Teach:** separating pure logic from UI; testing strategy; derived data vs. stored data (what we compute on the fly vs. cache).
- **Ethan tests:** run the test suite; check suggestions against his real history by hand.

### Milestone 6 — Progress and Today
- Exercise detail: segmented metric control, line chart, PR tiles, history. Choose the chart library with Ethan.
- Today tab: up-next card, week strip, latest PR (Coach card stays a placeholder until Milestone 9).
- **Teach:** how native-feeling charts render (Skia vs. SVG), memoizing expensive queries, aggregate SQL queries for stats.
- **Ethan tests:** charts match his logged data; switching metrics is smooth.

### Milestone 7 — CSV export and import
- Your Data screen from §4 with live preview and counts; export through the share sheet.
- Import: a CSV column-mapping step so Ethan can bring in his **RepCount export** (he'll provide a sample file); show a preview and a duplicate check before writing.
- **Teach:** the file system sandbox on iOS, the share sheet, document picker, streaming vs. loading large files, transactions for bulk inserts.
- **Ethan tests:** export opens correctly in Numbers/Sheets; importing his RepCount data produces correct history and PRs.

### Milestone 8 — Natural-language logging
- Build the server proxy (`server/`) with `/parse-log`; schema validation on both sides.
- The input pill on the active workout screen opens the confirmation sheet from §4; editable parsed rows; ambiguity handling; confirm writes the sets.
- **Teach:** calling a backend from React Native, environment config and secrets, loading and error states, bottom sheets and gestures, why the LLM output is validated rather than trusted.
- **Ethan tests:** try 15+ phrasings, including messy ones ("same as last time", "3x8 at 185 then 1 at 205"); nothing saves without confirming.

### Milestone 9 — Weekly coach and plateau diagnostics
- Compute the weekly stats and plateau signals deterministically; `/coach-summary` endpoint; Coach screen from §4; generate the report once per week (on first app open after the week ends) and cache it.
- **Apply** writes the suggested change to the routine; **Dismiss** records it so it isn't repeated.
- Hook up the Today coach card and the plateau note on the active workout card.
- **Teach:** background vs. on-open work on iOS, caching strategy, designing an AI feature that's safe when the model is wrong.
- **Ethan tests:** a report for a real week reads correctly and every number matches the app's own stats; Apply changes the routine as expected.

### Milestone 10 — Polish and ship to his phone
- Empty states, loading states, VoiceOver labels, Dynamic Type checks, app icon and splash, settings (units, plate inventory, default rest).
- A development or TestFlight build via EAS (TestFlight requires an Apple Developer account; explain the cost and options before doing anything).
- **Teach:** EAS Build, app signing basics, what changes between Expo Go and a real build.
- **Ethan tests:** the app installed as a standalone app, used for a full week of training.

---

## 9. Definition of done (every milestone)

- Runs on Ethan's iPhone without errors or yellow-box warnings.
- Domain logic covered by passing tests.
- Matches the design tokens and screen specs above.
- `docs/LEARNING.md` updated.
- Recap and test checklist delivered, then **stop and wait for Ethan.**
