# Wuzi2do

> **中文版本**: [README-CN.md](./README-CN.md)

A desktop tool application built with **Electron** and **React**, using **electron-vite**. The UI features a borderless window design, and when the window adheres to the edge of the screen, there is a smooth fade - in and fade - out animation.

Any suggestions for improvement are welcome. The sole purpose of this project is to become a desktop tool assistant - focusing on doing this one thing well.

| Item             | Details                                              |
|------------------|------------------------------------------------------|
| Runtime          | Electron (main process: window, tray, edge-snapping) |
| Frontend         | React 19, Tailwind CSS 4, Vite                       |

## Features

- **Todos**: Add, toggle completion, and remove items; scrollable list with basic accessibility (e.g. `aria-label`).
- **Window behavior**: Snapping to any screen edge shrinks the window to a narrow strip; interacting again restores it. The renderer listens for `window-snap` and runs matching CSS transitions.
- **Desktop integration**: System tray, draggable chrome region; on Windows, hit-testing for very small windows uses `setShape` where needed for correct behavior.
- **Persistence**: Todos are stored as JSON in `localStorage` under the key `todos`.

## Requirements

- **Node.js**: Current LTS is recommended (match any `engines` field in `package.json` if present).
- **OS**: Development and packaging scripts target Windows, macOS, and Linux (see build commands below for artifacts).

## Development and build

```bash
# Install dependencies
npm install

# Development with HMR
npm run dev

# Preview the production build locally
npm run start

# Production build (output under conventions such as out/)
npm run build
```

### Packaged installers

After `npm run build`, use **electron-builder** to produce per-platform packages or unpacked directories:

| Command                | Purpose                                                 |
|------------------------|---------------------------------------------------------|
| `npm run build:unpack` | Unpacked output for debugging                           |
| `npm run build:win`    | Windows                                                 |
| `npm run build:mac`    | macOS                                                   |
| `npm run build:linux`  | Linux (e.g. AppImage, deb — see `electron-builder.yml`) |

Installer names, app ID, and related metadata are defined in **`electron-builder.yml`** at the repo root (`productName` and similar may differ from the repository display name; adjust before release).

### Code quality

```bash
npm run lint
npm run format
```

## Project layout

- `src/main/` — Electron main process (window, tray, IPC, snap logic).
- `src/renderer/` — React app (components, `hooks/useTodos`, etc.).
- `src/preload/` — Preload script exposing a controlled `window.api` to the renderer (e.g. window snap notifications).

## Preview

![Wuzi2do demo](/resources/wuzi2do.gif)

---

This project started from the [electron-vite](https://electron-vite.org) template. For auto-updates, configure the `publish` section in `electron-builder.yml` and wire up **electron-updater** with your update URL and code signing as needed.
