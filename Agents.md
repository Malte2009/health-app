# Agents

This file gives coding agents the baseline structure and workflow for working in this Vue health app.

## Project Structure

- `src/views/` contains route-level Vue views, grouped by health domain such as `HRV`, `Daily`, `Diagnostic`, `Food`, `Sleep`, `Symptoms`, `Vitals`, and `Workout`.
- `src/components/` contains reusable Vue components shared across views.
- `src/services/` contains API wrappers. Keep HTTP details here and expose small typed functions to views and stores.
- `src/types/` contains TypeScript API and domain types. Add or update these alongside service contract changes.
- `src/stores/` contains Pinia state where shared client state is needed.
- `src/router/` contains route declarations.
- `src/utility/` contains pure helpers and shared data shaping code.
- `src/assets/` contains static app assets and global styling resources.

## Agent Code Structure

When implementing a feature, keep changes in the same layers the app already uses:

1. Define or update domain types in `src/types/...`.
2. Add or update API access in `src/services/...`.
3. Keep route-level orchestration in `src/views/...`.
4. Extract shared UI into `src/components/...` only when more than one view benefits from it.
5. Put reusable pure transformations in `src/utility/...`.
6. Add or update routes in `src/router/...` only when navigation changes are part of the task.

For example, HRV window UI work should usually coordinate `src/views/HRV/HrvWindowsView.vue`, `src/services/hrvService.ts`, and the related files in `src/types/hrv/`.

## API Contract Rule

If a feature needs API behavior that does not exist yet, or if an API change would make the implementation cleaner, safer, or more maintainable, the agent must stop and ask before writing dependent code.

The question should clearly state:

- what API change is required or recommended;
- why the current API is insufficient;
- what frontend implementation would become possible after that change;
- whether the change is required to proceed or only a nice improvement.

Do not silently mock, invent, or assume backend fields, endpoints, statuses, or response shapes unless the user explicitly asks for a frontend-only placeholder.

## Working Guidelines

- Prefer existing service, type, view, and utility patterns over new abstractions.
- Keep API response shape assumptions visible in TypeScript types.
- Keep Vue views focused on presentation state, loading/error handling, and wiring user interactions to services.
- Run `npm run build` for type checking and production build verification when changes touch TypeScript or Vue behavior.
- Run formatting or linting only for files touched by the task unless a broader cleanup is requested.
