# Product Manager Mission Report

**Agent**: product-manager  
**Generated**: 2026-08-09T11:03:12.265Z

---

## User Stories (12)

### US-000: As a Developer, I want the project scaffolded with Vite, TypeScript, Preact, and CI pipelines
- So that: development can start quickly with a consistent build environment
- AC: Repository contains a Vite + Preact + TypeScript template with proper scripts; GitHub Actions workflow runs lint, type‑check, unit tests, and builds on every push
### US-001: As a Player, I want to see a start screen with title, high scores, and options to start, toggle sound, and switch color‑blind mode
- So that: I can begin playing and configure settings before gameplay
- AC: Start screen displays game title, top‑10 high‑score list, and buttons for "Start Game", "Sound On/Off", and "Color‑Blind Mode"; All controls are reachable via keyboard (Tab navigation) and have visible focus indicators; Clicking or tapping "Start Game" transitions to a countdown screen; Toggling sound updates the Audio Manager mute state and persists the preference in LocalStorage; Enabling color‑blind mode updates the ghost palette instantly
### US-002: As a Player, I want the game to run at 60 fps, updating positions, handling collisions, and rendering the maze and sprites
- So that: gameplay feels smooth and responsive
- AC: Game loop runs at approximately 60 fps (±5 fps) on both desktop and mobile browsers; Pac‑Man and ghosts move according to current direction and speed, and stop when colliding with walls; Dots, power pellets, and fruit disappear when Pac‑Man passes over them; Canvas rendering reflects the current game state each frame without visual tearing
### US-003: As a Player, I want to control Pac‑Man using keyboard, WASD, swipe gestures, or on‑screen buttons
- So that: I can play on any device
- AC: Arrow keys and WASD change Pac‑Man direction instantly; Swipe left/right/up/down on touch devices triggers the corresponding direction; On‑screen directional buttons are clickable/tappable and produce the same effect; Input events are normalized and delivered to the Game Engine within one frame
### US-004: As a Player, I want each ghost to exhibit its unique personality and follow chase/scatter cycles
- So that: the challenge feels authentic
- AC: Blinky chases Pac‑Man directly, Pinky targets four tiles ahead, Inky uses a flanking algorithm, and Clyde alternates between chase and random wandering; Ghosts alternate between chase and scatter modes based on level‑specific timers; When Pac‑Man eats a power pellet, all ghosts enter frightened state, reverse direction, and move at reduced speed; After the frightened timer expires, ghosts revert to their previous mode
### US-005: As a Player, I want my score, lives, and level to be displayed and updated, and to earn extra lives at 10 000 points
- So that: I can track progress and continue playing
- AC: HUD continuously shows current score, remaining lives, and current level; Eating dots, pellets, ghosts, and fruit adds the correct points as defined in the scoring table; When the score reaches a multiple of 10 000, an extra life is added and the extra‑life sound plays; Losing a life triggers a death animation, resets Pac‑Man position, and preserves remaining dots
### US-006: As a Player, I want bonus fruit to appear at the correct dot counts, award appropriate points, and disappear after a timeout
- So that: I can earn extra points
- AC: First fruit spawns after 70 dots have been eaten, second after 170 dots; Fruit sprite matches the level‑specific type (cherry, strawberry, orange, etc.) and is rendered on the canvas; Collecting fruit adds the correct points and plays the fruit‑collected sound effect; If not collected within the configured timeout, the fruit disappears automatically
### US-007: As a Player, I want background music and sound effects to play appropriately and be muteable
- So that: I can enjoy audio or silence as I prefer
- AC: Background siren loops continuously during gameplay and its pitch increases as the number of remaining dots decreases; Sound effects play for dot eat, power pellet, ghost eat, death, fruit collection, and extra life; Mute toggle instantly silences all audio and updates the UI indicator; Audio playback does not crash on browsers lacking Web Audio support
### US-008: As a Player, I want my top‑10 high scores to be saved between sessions and to enter my initials after a game over
- So that: I can keep a record of my achievements
- AC: On game over, if the score qualifies for the top‑10, a modal prompts for three‑letter initials; Submitted initials and score are stored in LocalStorage and displayed on the start screen; High scores persist after page reloads and browser restarts; Non‑qualifying scores do not trigger the initials prompt
### US-009: As a User, I want the game to be playable offline after the first load
- So that: I can play without internet connectivity
- AC: Service Worker precaches all JavaScript, CSS, image, and audio assets on the first visit; When offline, the app loads from cache and all gameplay, audio, and high‑score features work; If a new version is deployed, the Service Worker updates the cache and notifies the user on the next load
### US-010: As a User, I want the UI to adapt to any screen size and be fully keyboard accessible, with a color‑blind palette option
- So that: the game is usable on all devices and for users with color vision deficiencies
- AC: Layout scales fluidly from 375 px to 2560 px width; the canvas resizes while preserving aspect ratio; All interactive elements are reachable via Tab and display a visible focus outline; Enabling color‑blind mode swaps ghost colors to the predefined palette; Text and UI elements meet WCAG AA contrast requirements
### US-999: As a Player, I want all game components (UI, input, engine, renderers, audio, score, high‑score service, service worker) to be wired together in the main application entry point so the game is fully playable
- So that: the game runs end‑to‑end and provides a complete experience
- AC: Root Preact component mounts the Start Screen, Game Canvas, HUD, and registers the Service Worker on load; Input Handler feeds commands to Game Engine, which updates the Game State Store; renderers read from the store and draw each frame; Audio Manager receives events from the engine and plays appropriate sounds; Score Manager updates the HUD and persists high scores; Application builds without errors, runs in the browser, and a user can start a game, play through at least one level, and see the high score appear on the start screen after a reload

## Tasks (37)

- **TASK-001** [infra/Vite] Initialize repository with Vite + Preact + TypeScript template
- **TASK-002** [infra/npm or Yarn] Install core dependencies
- **TASK-003** [infra/TypeScript] Configure TypeScript for strict mode and Preact JSX
- **TASK-004** [infra/ESLint, Prettier] Set up ESLint and Prettier with Preact rules
- **TASK-005** [infra/GitHub Actions] Create GitHub Actions CI workflow
- **TASK-006** [backend/Redux Toolkit] Scaffold Redux Toolkit store for game state and UI slices
- **TASK-007** [frontend/Preact, TypeScript] Implement StartScreen component
- **TASK-008** [testing/Jest, @testing-library/preact] Write unit tests for StartScreen
- **TASK-009** [frontend/TypeScript, LocalStorage API] Implement HighScoreService using LocalStorage
- **TASK-010** [testing/Jest] Write unit tests for HighScoreService
- **TASK-011** [frontend/Howler.js] Integrate AudioManager mute toggle with StartScreen
- **TASK-012** [frontend/CSS variables, TypeScript] Implement color‑blind palette toggle UI
- **TASK-013** [frontend/TypeScript, Preact event system] Create InputHandler module
- **TASK-014** [testing/Jest, @testing-library/preact] Write integration tests for InputHandler
- **TASK-015** [frontend/TypeScript] Implement GameEngine core loop
- **TASK-016** [testing/Playwright or Puppeteer] Add performance test for frame rate stability
- **TASK-017** [frontend/Canvas API] Develop MazeRenderer component
- **TASK-018** [frontend/Canvas API] Develop SpriteRenderer component
- **TASK-019** [testing/Jest, canvas‑mock] Write unit tests for MazeRenderer
- **TASK-020** [frontend/TypeScript] Implement GhostAI state machine
- **TASK-021** [testing/Jest] Write unit tests for GhostAI targeting logic
- **TASK-022** [frontend/Redux Toolkit] Create ScoreManager service
- **TASK-023** [testing/Jest] Write unit tests for ScoreManager calculations
- **TASK-024** [frontend/TypeScript] Implement BonusFruitSystem module
- **TASK-025** [testing/Jest] Write unit tests for fruit spawn and timeout
- **TASK-026** [infra/Workbox] Configure Workbox for asset precaching
- **TASK-027** [testing/Playwright] Write offline integration test
- **TASK-028** [frontend/CSS, TypeScript] Implement responsive layout CSS
- **TASK-029** [frontend/CSS, Preact] Add focus-visible styles and keyboard navigation
- **TASK-030** [frontend/CSS variables, TypeScript] Create color‑blind palette toggle logic
- **TASK-031** [testing/axe-core, Jest] Write accessibility tests for focus order and contrast
- **TASK-032** [frontend/Preact, TypeScript] Compose root App component and bootstrap application
- **TASK-033** [testing/Playwright] End‑to‑end test of full game flow
- **TASK-034** [frontend/Preact, TypeScript] Implement GameOver modal for initials entry
- **TASK-035** [testing/Jest, @testing-library/preact] Write unit tests for GameOver modal
- **TASK-036** [frontend/Howler.js] Implement AudioManager wrapper around Howler.js
- **TASK-037** [testing/Jest] Write unit tests for AudioManager behavior
