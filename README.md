# Sandee Srisawat — portfolio

An Astro + TypeScript static portfolio. All personal content and project data live in `src/data/portfolio.ts`. Reusable Astro components render the navigation, media, project cards, project breakdowns, skill groups, and footer. CSS is in `src/styles/global.css`.

## Run

Use Node 22 or newer and pnpm: `pnpm install`, then `pnpm dev`. `pnpm build` creates the static site in `dist/`. `pnpm preview` serves the build.

## Replace before sharing with recruiters

- Replace the three sample project records, keeping their unique slugs. Set `sample: false` only after replacing all sample copy. Project pages are generated automatically.
- Add personal contributions, role, engine, language, project type, team size, duration, challenges, outcomes, and reflections. Keep team contributions distinct and use only evidenced metrics.
- Put optimized screenshots, diagrams, portrait, and resume PDF in `public/`, then use paths such as `/media/gameplay.webp` or `/resume.pdf` in the content file.
- Set `heroMedia` or a project's `media` to a local image/video URL. Set the associated media type to `image` or `video`. Supply descriptive alt text. Videos use controls and never autoplay. For meaningful speech, use the captions field for a WebVTT file and the transcript field for an adjacent text alternative before sharing.
- Replace the abstract previews with real media. The geometric scenes are designed placeholders, not gameplay or a claim of completed work.
- Update `about`, `approach`, and actual skills. Set `aboutConfirmed` and `skillsConfirmed` to true when those entries are confirmed.
- Supply email, GitHub, itch.io, LinkedIn, and resume URLs. Missing links display honest notices; there is no simulated contact form.
- Add optional project build, repository, trailer, documentation, diagram, and code entries. Code is escaped and displayed as text.
- `siteUrl` controls canonical and social URLs. The footer year is generated at build time.
- Replace `public/social.svg` with a 1200×630 PNG/JPEG for broad social-platform compatibility, then update the layout's `og:image` path.

## Build environment note

The config disables dependency prebundling for this static, zero-framework site to avoid a Windows sandbox directory-enumeration issue in unused development-toolbar dependencies.

## Design and accessibility

Spaghetti-inspired palette: roasted brown / pasta cream / tomato red, with basil green details, responsive grids, semantic landmarks, a skip link, visible focus rings, native links, a mobile menu with expanded state and Escape handling, reduced-motion support, and lazy-loaded project/portrait images. Fonts use Google Fonts with local system fallbacks. No analytics, contact submission, or backend is required.

The supplied inspiration was used for an approachable introduction and project-first structure, with an original visual identity: https://www.jocolomban.com



## GitHub Pages

This project replaces the previous website in SpaghettiSans/game-programmer-portfolio. Pushes to main build Astro and deploy dist/ through GitHub Actions. The configured base path is /game-programmer-portfolio. For a custom domain, update both Astro site/base and profile.siteUrl.

The former site is preserved in branch backup/portfolio-before-astro-2026-10-13. Its externally stored sample project data was exported to archive/legacy-projects-2026-10-13.json. The new site uses local content and does not depend on the former Studio API.

Build and internal links have been checked. Browser visual and keyboard QA remain unverified because browser access was denied in the creation session.
