# Technical Preferences

<!-- Populated by /setup-engine. Updated as the user makes decisions throughout development. -->
<!-- All agents reference this file for project-specific standards and conventions. -->

## Engine & Language

- **Engine**: Phaser.js 4.1.0 (H5 Game Framework)
- **Language**: TypeScript
- **Rendering**: Canvas 2D / WebGL (Phaser auto-detects)
- **Physics**: Phaser Arcade Physics

## Input & Platform

<!-- Written by /setup-engine. Read by /ux-design, /ux-review, /test-setup, /team-ui, and /dev-story -->
<!-- to scope interaction specs, test helpers, and implementation to the correct input methods. -->

- **Target Platforms**: Web / Browser (PC + Mobile)
- **Input Methods**: Keyboard/Mouse, Touch
- **Primary Input**: Keyboard/Mouse (PC), Touch (Mobile)
- **Gamepad Support**: Partial (future)
- **Touch Support**: Partial (responsive UI, tap-based controls)
- **Platform Notes**: H5 platform — no native install. Must work in Chrome, Safari, Firefox, Edge.

## Naming Conventions

- **Classes/Components**: PascalCase (e.g., `WorldScene`, `PortalManager`)
- **Variables/Functions**: camelCase (e.g., `moveSpeed`, `loadGame()`)
- **Event Names**: snake_case (e.g., `game_completed`, `portal_entered`)
- **Files**: kebab-case (e.g., `world-scene.ts`, `portal-manager.ts`)
- **Phaser Scenes**: PascalCase matching file (e.g., `WorldScene` in `world-scene.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_PLAYER_SPEED`)

## Performance Budgets

- **Target Framerate**: 60fps (desktop), 30fps (mobile target)
- **Frame Budget**: 16.6ms (desktop), 33ms (mobile)
- **Draw Calls**: Keep under 50 (2D Canvas/WebGL)
- **Memory Ceiling**: 256MB (H5 browser context)

## Testing

- **Framework**: Vitest (unit tests)
- **Minimum Coverage**: Core gameplay systems only
- **Required Tests**: Game loading/unloading, state management, score/communication system

## Forbidden Patterns

<!-- Add patterns that should never appear in this project's codebase -->
- [None configured yet — add as architectural decisions are made]

## Allowed Libraries / Addons

<!-- Add approved third-party dependencies here -->
- [None configured yet — add as dependencies are approved]

## Architecture Decisions Log

<!-- Quick reference linking to full ADRs in docs/architecture/ -->
- [No ADRs yet — use /architecture-decision to create one]

## Engine Specialists

<!-- Written by /setup-engine when engine is configured. -->
<!-- Read by /code-review, /architecture-decision, /architecture-review, and team skills -->
<!-- to know which specialist to spawn for engine-specific validation. -->

This is a pure H5/web project using Phaser.js — traditional game engine
specialists (Godot/Unity/Unreal) do not apply. Use general-purpose
or claude for most code work. Spawn technical-artist for shader/3D work
(Three.js integration).

- **Primary**: general-purpose
- **Language/Code Specialist**: general-purpose (TypeScript review)
- **Shader Specialist**: technical-artist (GLSL shaders, Three.js integration)
- **UI Specialist**: general-purpose (Phaser UI / DOM overlay)
- **Additional Specialists**: technical-artist (3D assets, procedural generation)
- **Routing Notes**: General-purpose for all code. Technical-artist for shaders, 3D, and visual effects.

### File Extension Routing

<!-- Skills use this table to select the right specialist per file type. -->
<!-- If a row says [TO BE CONFIGURED], fall back to Primary for that file type. -->

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| Game code (.ts files) | general-purpose |
| Shader / material files (.glsl, .vert, .frag) | technical-artist |
| UI / screen files (.ts, .html, .css) | general-purpose |
| Scene / level config files (.json) | general-purpose |
| Native extension / plugin files (N/A) | general-purpose |
| 3D integration (Three.js) | technical-artist |
| General architecture review | general-purpose |
