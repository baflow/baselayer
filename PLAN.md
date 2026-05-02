# Plan: Strona posta blogowego (`blog/[...slug].astro`)

## Context
Potrzebna jest implementacja strony pojedynczego posta blogowego zgodna z DESIGN.md i dostarczonym obrazkiem (ciemno-zielony design "Technical Zen"). Obecnie `src/pages/blog/[...slug].astro` renderuje post przez `BlogPost.astro` layout, ale wygląd jest domyślny i niezgodny z design systemem.

## Approach
1. Zainstalować i skonfigurować `astro-expressive-code` dla code blocks z nazwami plików, terminal buttons i kolorowaniem składni (Shiki 4).
2. Stworzyć komponent `ImageWithCaption.astro` oparty na natywnym `Image` z Astro + prop tekstowy `caption`.
3. Stworzyć **reuzywalny komponent `ArticleMeta.astro`** — subtitle-style header używany zarówno w Hero (`subtitle` prop) jak i w headerze posta. Będzie przyjmował: `systemId`, `date`, `readTime`.
4. Przebudować `src/layouts/BlogPost.astro` na layout zgodny z designem:
   - **ArticleMeta** (reuzywalny): SYSTEM_LOG_ID, data, read time — styl uppercase/tracking-widest jak Hero subtitle
   - Tytuł w Newsreader (`display-lg`)
   - Subtitle (`description`)
   - Hero image w gradient border shell + figcaption
   - **Prose content** — `Content` z `render()` generuje plain HTML (`<h2>`, `<p>`, `<pre>`, `<code>`, `<ul>`). Trzeba dodać style w `global.css` pod selektor `.prose` żeby pasowały do designu.
   - Custom CSS dla code blocks (zielone akcenty jak na obrazku)
5. Upewnić się że `src/pages/blog/[...slug].astro` poprawnie przekazuje dane do layoutu.

## Files to modify
- `astro.config.mjs` — dodać `astro-expressive-code` do integracji
- `src/layouts/BlogPost.astro` — pełna przebudowa layoutu posta
- `src/pages/blog/[...slug].astro` — ewentualna aktualizacja (prawdopodobnie bez zmian, bo layout robi robotę)
- `src/components/ImageWithCaption.astro` — nowy komponent
- `src/components/ArticleMeta.astro` — nowy reuzywalny komponent
- `src/styles/global.css` — dodać style dla `.prose` i expressive-code overrides

## Reuse
- `BaseLayout.astro` — już istnieje, zawiera Header/Footer i dark mode
- `FormattedDate.astro` — istnieje, użyć dla daty publikacji
- `Image` z `astro:assets` — użyć w `ImageWithCaption`
- Tailwind tokens z `global.css` — `bg-surface`, `text-text-secondary`, `font-display`, itd.
- Komponent `Card.svelte` — można zainspirować się gradient border shell z jego implementacji

## Steps
- [ ] **Code blocks**: Zainstalować `astro-expressive-code` (Astro 6 jest wspierany — `astro-expressive-code` v0.41 wymaga `astro: ^4.0.0-beta || ^5.0.0-beta || ^3.3.0 || ^6.0.0-beta`, więc peer dep npm to tylko warning). To oficjalna integracja Astro używana w Astro Docs. Daje: Shiki 4 syntax highlighting, editor frames z nazwą pliku (np. `title="layout_config.css"`), terminal buttons (3 kropki), copy button.
- [ ] Skonfigurować `astro.config.mjs` — import i integracja `expressiveCode()`
- [ ] Stworzyć `src/components/ArticleMeta.astro` — reuzywalny header z systemId/date/readTime
- [ ] Stworzyć `src/components/ImageWithCaption.astro` z `Image` + `caption` prop
- [ ] Przebudować `src/layouts/BlogPost.astro` — ArticleMeta, tytuł, hero image shell, content area
- [ ] Dodać custom CSS w `global.css` dla `.prose` (h2, p, code inline) i expressive-code frames (dark green theme)
- [ ] Przetestować na istniejącym poście (`first-post.md`)

## Prose — before/after
**Before:** `Content` renderuje plain HTML bez stylów — `<h2>` ma domyślne style przeglądarki, `<pre>` jest białe z czarnym tekstem.  
**After:** Dodajemy w `global.css` selektor `.prose` z:
- `h2`: `font-display text-3xl text-text-secondary mt-8 mb-2`
- `p`: `text-body-md text-text-primary/90 leading-relaxed mb-4`
- `pre` (expressive-code): dark shell z gradient border, zielone akcenty w tokenach (`#437652`)
- `code` inline: `bg-surface-card px-1 py-0.5 rounded text-primary text-sm`

W Markdown będzie można pisać:
````markdown
```css title="layout_config.css"
.bento-system-container { display: grid; }
```
````
Co wyrenderuje code block z headerem "layout_config.css" i 3 kropkami terminala.

## Verification
- `npm run dev` → wejść na `/blog/first-post/` → sprawdzić czy layout pasuje do obrazka
- Sprawdzić czy code blocks mają header z nazwą pliku (po dodaniu `title="..."` w markdown)
- Sprawdzić czy `ImageWithCaption` renderuje obrazek z podpisem
- Sprawdzić czy `ArticleMeta` wygląda identycznie w Hero i w poście
