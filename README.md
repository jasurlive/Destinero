# Destinero

Simple mapping app built with React, TypeScript and Vite.

<img width="1918" height="874" alt="image" src="https://github.com/user-attachments/assets/04fc973d-1d42-42d2-b2da-630f768ceacd" />
<img width="1918" height="877" alt="image" src="https://github.com/user-attachments/assets/1c6bd439-e9f2-420c-a850-f2287333d8e2" />

## What this is

- A small web app that shows map markers, reads Excel data, and uses live/location features.
- Built with `React`, `TypeScript`, and `Vite`. It uses `leaflet` and `react-leaflet` for maps.

## Quick links

- Source: This repository
- Run locally: `npm run dev`

## Project structure

Main folders:

- `public/python/` - some Python helper scripts and excel sheets
- `src/` - application source code
  - `react/` - main React entry and `App.tsx` (`src/react/main.tsx` and `src/react/App.tsx`)
  - `add/` - extra features and components
    - `components/` - map components used in the app
    - `css/` - CSS styles for the app and map
    - `hooks/` - custom React hooks (location, search, locking, fetch excel, etc.)
    - `tools/` - helper components like `Markers.tsx`, `PopUp.tsx`, `Buttons.tsx`

## How it works (high level)

- Vite serves the React + TypeScript app in development and builds a static bundle for production.
- `leaflet` displays the map and markers; `react-leaflet` provides React bindings.
- Excel spreadsheets are parsed with the `xlsx` package when the app needs to import marker data.
- Several small hooks provide features like live location tracking, search, and UI locking.

## Prerequisites

- Node.js (recommend LTS, Node 18+)
- npm (or yarn/pnpm — the scripts below use npm)

## Install and run

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview a production build locally:

```bash
npm run preview
```

## Dependencies (high level)

- `react`, `react-dom` — UI library
- `vite` — build tool and dev server
- `leaflet`, `react-leaflet` — map rendering
- `xlsx` — Excel parsing

## Contributing

Contributions are welcomed:

1. Fork the repo.
2. Create a short-lived branch: `git checkout -b feat/your-change`.
3. Make changes and keep them small and focused.
4. Run `npm run lint` and test locally with `npm run dev`.
5. Open a pull request describing the change and why it helps.

Be polite in PR descriptions. If the change affects user-facing behavior, include brief steps to test it.

## Code style and practices

- TypeScript is used across the app. Keep types explicit where useful.
- Follow existing folder conventions: UI components in `tools/` or `components/`, logic in `hooks/`.
- Keep components small and testable.

## License

This project is available under the MIT License. See the `LICENSE` file for details.

## Issues & Contact

- Open issues for bugs or feature requests.
- For questions, leave a clear description and reproduction steps.
