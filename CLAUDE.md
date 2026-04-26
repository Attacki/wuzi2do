# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Slide2do is a desktop todo app built with **Electron** and **React 19**, using **electron-vite** for build tooling. It features a frameless window with edge-snapping behavior that collapses into a slim strip when snapped to a screen edge.

## Build Commands

```bash
npm run dev      # Development with HMR
npm run start    # Preview production build locally
npm run build    # Production build (outputs to out/)
npm run lint     # Run ESLint
npm run format   # Run Prettier
npm run build:win   # Build Windows installer
npm run build:mac   # Build macOS app
npm run build:linux # Build Linux app
npm run build:unpack # Unpacked output for debugging
```

## Architecture

### Three-Process Model

- **src/main/index.js** — Electron main process: window creation, tray, edge-snapping logic, IPC handlers
- **src/preload/index.js** — Preload script exposing `window.api` (minimize, close, onWindowSnap)
- **src/renderer/src/** — React app with components, hooks, and assets

### Main Process Key Logic

The main process implements **edge-snapping** via `snapManager`:
- Window snaps to any screen edge and collapses into a 5px strip
- Mouse polling detects cursor hover to expand/collapse
- Windows requires `setShape()` to enable hit-testing on tiny collapsed windows (see electron#32302 workaround at line 18)

IPC channels:
- `minimize-app` / `close-app` — from renderer to main
- `window-snap` — from main to renderer (fires on snap state changes for CSS transitions)

### Renderer Architecture

- `hooks/useTodos.js` — Todo state management with localStorage persistence (`todos` key)
- `components/TodoList.jsx` — Scrollable todo list with right-click to delete
- `components/AddTodoForm.jsx` — Todo input form
- `App.jsx` — Root component handling snap state and window class names

CSS animations for snap states are defined in `assets/animations.css` (classes like `snapped-top`, `un-snapping-left`, etc.).

### Styling

- Tailwind CSS 4 with `@tailwindcss/vite` plugin
- Custom frosted-glass aesthetic via `backdrop-blur` and semi-transparent backgrounds
- Draggable chrome region via `-webkit-app-region: drag`

## Code Conventions

- PropTypes for runtime type checking on all components
- ESLint flat config extending `@electron-toolkit/eslint-config` and `@electron-toolkit/eslint-config-prettier`
- Prettier for formatting (configured in `.prettierrc.yaml`)

## Key Files

- `electron.vite.config.mjs` — Vite config for main, preload, renderer with alias `@renderer` → `src/renderer/src`
- `electron-builder.yml` — Packaging config (productName: slide2do, appId: com.electron.app)
- `src/main/index.js:18` — Windows setShape workaround comment for frameless window minimum size
