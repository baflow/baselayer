# Plan: Navbar dla astro-dev-template

## Context

Stworzenie górnego paska nawigacji (navbar) zgodnego z załączonym screenem i `DESIGN.md`. Projekt to Astro + Tailwind CSS v4 + Basecoat CSS. Basecoat ma komponent `sidebar` dla widoku mobilnego oraz klasy akcyjne (`btn`, `btn-link`, `btn-ghost`) i system tokensów.

**Nieścisłość w `DESIGN.md`:** screen pokazuje ciemne tło strony (neutralne, ~`#142418`), a `DESIGN.md` definiuje `--color-background: #437652` (zielone). Plan zakłada skorygowanie tokenów tła w `global.css`, aby tło strony i navbaru było ciemne zgodnie z rzeczywistym wyglądem.

## Decyzje użytkownika

- Logo/tytuł: **PURELINK** (zastępuje `SITE_TITLE`)
- Desktop linki → ścieżki: Log (`/`), Lab (`/lab`), Archive (`/blog`), About (`/about`)
- Mobile: **hamburger sidebar z Basecoat**

## Approach

1. **Skorygować kolory tła** w `src/styles/global.css` aby tło strony i navbaru było ciemne (`#142418` lub `#0B0F0D`) zamiast zielonego `#437652`; dostosować `--color-surface` do jaśniejszego ciemnego odcienia.
2. Utworzyć **współdzielony layout** `src/layouts/BaseLayout.astro` (obecnie każda strona ma własny `<html>`).
   - Zawiera `<aside class="sidebar" data-side="right" aria-hidden="true">` z Basecoat + strukturę nawigacji mobilnej.
   - Importuje JS Basecoat: `import 'basecoat-css/sidebar'`.
   - Wstrzykuje `<Header />` powyżej `<main>`.
3. Zbudować **Header** (`src/components/Header.astro`):
   - Desktop: flex justify-between z logo PURELINK (Newsreader, accent) i linkami (Inter, `btn-sm btn-link`/`btn-ghost` z Basecoat).
   - Mobile: logo + hamburger button toggle'ujący sidebar (`basecoat:sidebar` event).
4. Zaktualizować **HeaderLink.astro** — logika aktywnego linku, podkreślenie aktywnego (np. underline lub inny kolor).
5. Zmienić `consts.ts` → `SITE_TITLE = 'PURELINK'`.
6. Uaktualnić **istniejące strony/layouty** aby używały `BaseLayout`:
   - `src/pages/index.astro`
   - `src/pages/blog/index.astro`
   - `src/layouts/BlogPost.astro` (który używa BlogPost zawierającego Header/Footer)
   - `src/pages/about.astro` (używa BlogPost)
   - Uwaga: dodać placeholder `src/pages/lab.astro` (portfolio).
7. Dostosować style w `global.css` jeśli kolory/tokens Basecoat nie są spójne z DESIGN.md dla linków aktywnych.
   - **Kluczowe:** ustawić `--color-background` na ciemny kolor (np. `#0B0F0D` lub `#142418`) oraz `--color-surface` na nieco jaśniejszy ciemny, aby tło strony i navbaru było ciemne jak na screenie.


## Files to modify / create

| Plik | Akcja |
|---|---|
| `src/layouts/BaseLayout.astro` | **Utworzyć** — shared layout z sidebar-em, Header, Footer, `<html class="dark">` |
| `src/components/Header.astro` | **Nadpisać** — desktop navbar + mobile hamburger toggle |
| `src/components/HeaderLink.astro` | **Nadpisać** — active link style (underline / accent) |
| `src/components/MobileSidebar.astro` | **Utworzyć** (opcjonalnie inline w BaseLayout) — struktura `<aside class="sidebar">` z Basecoat |
| `src/consts.ts` | **Zmienić** `SITE_TITLE` na `'PURELINK'` |
| `src/pages/index.astro` | **Zmienić** na `<BaseLayout>` |
| `src/pages/blog/index.astro` | **Zmienić** na `<BaseLayout>` i wynieść style do `<style>` lub global |
| `src/layouts/BlogPost.astro` | **Zmienić** na `<BaseLayout>` i skonfigurować sloty |
| `src/pages/lab.astro` | **Utworzyć** placeholder |
| `src/styles/global.css` | Ewentualne poprawki custom underline / active color |

## Reuse z projektu

- `BaseHead.astro` (import w BaseLayout)
- `Footer.astro` (import w BaseLayout)
- Istniejąca konfiguracja Tailwind + Basecoat w `global.css`
- Tokens z `DESIGN.md` (kolory, spacing) już zdefiniowane w `@theme`

## Verification

- `npm run dev` → wizualne porównanie ze screenem (logo, linki, kolory)
- Sprawdzenie aktywnego stanu: przejście na `/blog` powinno podkreślić "Archive"
- Mobile (< 768px): hamburger otwiera Basecoat sidebar z linkami; zamknięcie działa poprawnie
- Brak błędów w konsoli (JS Basecoat załadowany)
