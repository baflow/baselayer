# Plan: Homepage Lists (Personal Log + Laboratory)

## Context
Strona główna (`/`) obecnie zawiera tylko Hero. Użytkownik chce dodać poniżej Hero dwie kolumny:
- **Lewa** — "PERSONAL LOG" z listą 3 najnowszych postów (reuse PostCard)
- **Prawa** — "LABORATORY" z listą 2-3 projektów (nowy ProjectCard)

## Files to create
- `src/content/projects/` — nowa kolekcja z 2-3 przykładowymi `.md`
- `src/components/ui/SectionHeader.svelte` — nagłówek uppercase + linia
- `src/components/ui/SectionHeader.stories.svelte`
- `src/components/ui/ProjectCard.svelte` — karta z opcj. obrazkiem, tytułem, opisem, tagami, linkiem
- `src/components/ui/ProjectCard.stories.svelte`
- `src/pages/lab/index.astro` — widok registry (taka sama siatka jak `/blog`)
- `src/pages/lab/[...slug].astro` — strona pojedynczego projektu

## Files to modify
- `src/content.config.ts` — dodać kolekcję `projects`
- `src/pages/index.astro` — dodać sekcję z dwiema kolumnami pod Hero
- `src/layouts/BaseLayout.astro` — opcjonalnie, jeśli potrzeba

## Steps
1. [ ] Rozszerzyć schemat o kolekcję `projects` (title, description, pubDate, image?, tags?, href?)
2. [ ] Utworzyć przykładowe projekty w `src/content/projects/`
3. [ ] Stworzyć `SectionHeader.svelte` + stories
4. [ ] Stworzyć `ProjectCard.svelte` + stories
5. [ ] Zmodyfikować `index.astro` o sekcję dwukolumnową
6. [ ] Stworzyć `lab/index.astro` jako pełny registry
7. [ ] Stworzyć `lab/[...slug].astro` jako layout pojedynczego projektu
8. [ ] Build + verify
