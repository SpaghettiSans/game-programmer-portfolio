# Sandee Srisawat — portfolio

## Visual editor (recommended)

Open https://spaghettisans.github.io/game-programmer-portfolio/edit/ or use **Edit portfolio** in the footer.

1. Add, edit, reorder, or remove projects using the form. Expand **Contributions, takeaways & showcase** to write your two project sections and add media.
2. Edit your biography, social links, and skill groups. Blank optional links disappear. Uncheck **Mark as sample content** when a project is real, and confirm your biography and skills when ready.
3. Click **Publish changes**, copy the generated content, and open the GitHub file editor using the supplied link.
4. Click inside the GitHub file editor, select all, paste, and **Commit changes** directly to main. No code writing is needed. GitHub builds and deploys the site.

Drafts save automatically in this browser; they do not update the live website. Download a backup to move a draft between devices. Reset discards the draft after confirmation. Publishing checks for newer GitHub content and stops if it might overwrite another update. GitHub account permissions control who can publish; no tokens are stored in the editor. GitHub remains the final confirmation step.

For media and a resume, upload files to `public/` using GitHub's file uploader. Enter a path such as `/game-programmer-portfolio/screenshot.webp` or `/game-programmer-portfolio/resume.pdf`, or a full HTTPS media URL. Videos need direct video URLs; use the separate trailer link for YouTube. Add caption and transcript alternatives when needed.

## Content and code

All content is in `src/data/content.json`. `src/data/portfolio.ts` supplies types and validates it at build time. Do not edit the TypeScript adapter to change content. The editor and build share `validate-content.mjs`. Project pages use About project, Technical Contributions, Challenges & Takeaways, and a bottom Showcase. Add, reorder, and remove showcase media in the editor. A homepage card preview is configured separately. Older challenge/reflection text and media are carried forward automatically; original fields remain in backups. Empty project and skill lists are supported. Deleting a project removes its page at the next deployment. Git history lets you restore earlier content.

Use Node 22+ and pnpm: `pnpm install`, `pnpm dev`, `pnpm build`. Static output is in `dist/`. GitHub Actions deploys pushes to main. The base path is `/game-programmer-portfolio`; for a custom domain, update Astro site/base and profile.siteUrl together.

The former website is preserved in branch `backup/portfolio-before-astro-2026-10-13`. Its external sample project data is archived in `archive/legacy-projects-2026-10-13.json`.

The design uses charcoal, pasta cream, tomato red, and basil green. Sample work is explicitly labeled. Add real project media, resume, confirmed skills, and your personal story before sharing with recruiters.

Browser visual and keyboard QA remain unverified because browser access was denied. Build, content validation, and generated page/link checks are performed locally.
