# Repository Guidelines

## Project Structure & Module Organization
- `src/app` holds the Next.js App Router entry points (`layout.tsx`, `page.tsx`) and global styles (`globals.css`).
- `src/components` contains reusable UI components; component files are PascalCase (e.g., `PillNav.tsx`) and often pair with a CSS file (e.g., `PillNav.css`).
- `src/lib` is for shared utilities (e.g., `utils.ts`).
- Static assets live in `public/`; design references currently include `brochurepage1.png` and `brochurepage2.png` at repo root.

## Build, Test, and Development Commands
- `bun install`: install dependencies.
- `bun run dev`: start the dev server with webpack at `http://localhost:3000`.
- `bun run dev:turbo`: start the dev server with Turbopack (faster, if available).
- `bun run build`: build the production bundle.
- `bun run start`: run the built app locally.
- `bun run lint`: run ESLint.

## Coding Style & Naming Conventions
- Indentation is 2 spaces in TS/TSX/CSS; follow existing formatting in `src/`.
- React components use PascalCase filenames and exports; hooks use `useX` naming.
- Prefer colocated component CSS (`Component.css`) when a component needs custom styles.
- TypeScript is the default language; keep props typed and avoid `any` unless unavoidable.

## Testing Guidelines
- No test framework is configured yet. If you add tests, document the runner and update scripts in `package.json`.
- Name tests alongside sources (e.g., `Component.test.tsx`) or in a dedicated `__tests__/` directory if introduced.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and plain (e.g., “updated UI”, “build error fix”); follow this style unless a new convention is agreed.
- PRs should include a concise description, linked issue (if any), and screenshots for UI changes.

## Configuration Tips
- Use `.env.local` for local secrets; do not commit secrets. Add new environment keys to documentation when introduced.

## Agent & Tooling Notes
- Development uses `bun` (see `bun run dev` and `bun run dev:turbo`).
- Documentation research can use the Context7 MCP server when needed.
- For UI work, the `$frontend-design` and `$react-best-practices` skills are available and should be applied as appropriate.
