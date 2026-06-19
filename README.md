## Algorithms Visualizer

## Overview

This is an interactive, browser-based algorithms visualizer built with React + TypeScript and Vite. It demonstrates animations and step-by-step execution for a range of algorithm categories (sorting, searching, graph algorithms, dynamic programming, and recursion). The visualizer is designed for learning, teaching, and experimenting with algorithm behavior and complexity.

Key goals:
- Make algorithm execution visible and interactive.
- Provide configurable inputs and animation controls.
- Offer analysis hooks and dry-run / step inspection for deeper study.

## Features

- Visualizations for arrays, trees, graphs, and DP tables.
- Animation controls: play, pause, step, speed, and loop.
- Input components to customize example data and parameters.
- Analysis panel showing complexity, runtime traces, and step counts.
- Modular engine: `engine/` contains algorithm implementations and the visualization bridge.

## Live demo

Run locally (see Installation). Optionally deploy the built output to any static host.

## Tech stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Build: Vite

## Project structure

- [src](src)
  - [components](src/components): UI components and visualizers
    - [visualization](src/components/visualization): `ArrayVisualizer`, `TreeVisualizer`, `GraphVisualizer`, `DPTableVisualizer`, `VisualizationEngine`
    - [controls](src/components/controls): `AnimationControls`
    - [input](src/components/input): `AlgorithmInput`
    - [layout](src/components/layout): `Navbar`, `Sidebar`
    - [analysis](src/components/analysis): `ComplexityPanel`, `DryRunTable`
  - [engine](src/engine): core algorithm implementations and analysis hooks
    - `analysisEngine.ts` — analysis/metrics for runs
    - `detector.ts` — runtime detection utilities
    - `types.ts` — shared types
    - [algorithms](src/engine/algorithms): categorized algorithm implementations
      - [sorting](src/engine/algorithms/sorting)
      - [search](src/engine/algorithms/search)
      - [graph](src/engine/algorithms/graph)
      - [dp](src/engine/algorithms/dp)
      - [recursion](src/engine/algorithms/recursion)
  - [context](src/context): `AppContext.tsx` — app-wide state and providers
  - [hooks](src/hooks): `useAnimationPlayer.ts` — animation and timing logic
  - [pages](src/pages): `VisualizerPage.tsx` — main application page

Other top-level files:
- `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `package.json`

## Installation

1. Clone the repo:

```bash
git clone <repo-url> project1
cd project1
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

## Development

Run the dev server:

```bash
npm run dev
# or
yarn dev
```

Open `http://localhost:5173` (or the port Vite reports).

Build for production:

```bash
npm run build
# or
yarn build
```

Preview production build locally:

```bash
npm run preview
# or
yarn preview
```

## Usage Guide

1. Open the Visualizer page (default at app root).
2. Choose an algorithm category and specific algorithm using the input panel (`src/components/input/AlgorithmInput.tsx`).
3. Configure input data (array length, values, graph edges, tree shape, DP matrix size) using the provided controls.
4. Use `AnimationControls` to start, pause, step forward/back, and adjust speed.
5. Inspect analysis panels (`ComplexityPanel`, `DryRunTable`) for step-level metrics and complexity annotations.

Helpful UI notes:
- Array visualizations show indices and current pointers/highlights.
- Graph visualizations present node expansions and traversal order.
- DP table visualizations reveal subproblem fills and dependencies.

## Algorithms Implemented

Core categories and where to find them:
- Sorting: [src/engine/algorithms/sorting](src/engine/algorithms/sorting)
- Searching: [src/engine/algorithms/search](src/engine/algorithms/search)
- Graph: [src/engine/algorithms/graph](src/engine/algorithms/graph)
- Dynamic Programming: [src/engine/algorithms/dp](src/engine/algorithms/dp)
- Recursion: [src/engine/algorithms/recursion](src/engine/algorithms/recursion)

Each algorithm module exports a function that the visualization engine consumes to produce a sequence of steps and metadata. See `src/engine/types.ts` for the step/action shapes and `src/engine/analysisEngine.ts` for metrics collection.

## Architecture & Implementation Details

High level:
- The `VisualizationEngine` component receives a sequence of steps (an "execution trace") from an algorithm implementation and schedules visual updates according to the animation controller (`useAnimationPlayer`).
- Algorithms in `src/engine/algorithms/*` are implemented to be deterministic and to emit an ordered list of step objects rather than driving UI directly. This separation enables testing and analysis.
- `analysisEngine.ts` takes a trace and computes complexity metrics and per-step annotations (e.g., comparisons, swaps, visited nodes).

Important files:
- [src/components/visualization/VisualizationEngine.tsx](src/components/visualization/VisualizationEngine.tsx)
- [src/hooks/useAnimationPlayer.ts](src/hooks/useAnimationPlayer.ts)
- [src/engine/analysisEngine.ts](src/engine/analysisEngine.ts)
- [src/context/AppContext.tsx](src/context/AppContext.tsx)

Design patterns used:
- Unidirectional data flow: the engine is the single source of truth for step traces.
- Separation of concerns: algorithm logic vs visualization rendering vs animation timing.
- Immutable step traces: steps are pure data; visual components map them to render state.

## Testing

There are no automated tests committed by default. Suggested testing approaches:
- Unit tests for algorithm trace generation (ensure trace length, step contents, invariants).
- Snapshot tests for component renders at known steps.

If you add tests, consider `vitest` for fast TypeScript-aware unit tests.

## Contributing

Contributions are welcome. Recommended workflow:
1. Fork the repo and create a feature branch.
2. Add tests for new algorithms or refactors.
3. Keep PRs small and focused: one algorithm or one UI improvement per PR.

Coding guidelines:
- Keep algorithm implementations pure and trace-producing.
- Add appropriate types to `src/engine/types.ts` for any new step shapes.
- Document algorithm complexity and behavior in code comments.

## Performance & Profiling Tips

- Large inputs will produce long traces; consider adding sampling or summarized steps for very large N.
- The animation player (`useAnimationPlayer`) supports variable speeds; when profiling, throttle the animation to inspect rendering hotspots.

## Deployment

Build and host the `dist` folder produced by `npm run build` on any static hosting (Netlify, Vercel, GitHub Pages, Surge, etc.). For GitHub Pages, a simple `gh-pages` deployment can be configured.

## Roadmap / Ideas

- Add more algorithms (e.g., advanced graph algorithms, probabilistic algorithms).
- Add step-by-step explanation text alongside visualizations.
- Export traces as JSON for offline analysis.
- Add performance instrumentation to compare theoretical vs empirical step counts.

## Troubleshooting

- If the dev server fails to start, ensure Node.js is >= 16 and dependencies are installed.
- If styles look broken, confirm Tailwind is built and `index.css` imports Tailwind directives.

## Credits

Built with Vite, React, TypeScript, and Tailwind CSS.

If you'd like, I can:
- Add this as `read.md` (done) and also create `README.md` copy.
- Insert usage screenshots or animated GIFs into `public/` and reference them.
- Generate a CONTRIBUTING.md and CODE_OF_CONDUCT.md.
