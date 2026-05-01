# Plan: Komponent PostCard (Svelte)

## Kontekst
Na podstawie fragmentu HTML z innego projektu trzeba stworzyć komponent `PostCard.svelte` w `src/components/ui/` zgodny z istniejącym design systemem `astro-dev-template` (Tailwind v4 + Basecoat).

## Mapowanie klas (brakujące → istniejące w projekcie)

| Oryginał | Zamiana w tym projekcie | Uzasadnienie |
|---|---|---|
| `instrument-shell` | `bg-surface border border-border/20 rounded-md` | kontener karty – tło, subtelna ramka, zaokrąglenie zgodne z projektem |
| `glow-hover` | `hover:border-primary/40 hover:shadow-surface` | brak dedykowanego glow; wystarczy zmiana obramowania + cień |
| `instrument-core` | usunięta (zastąpiona przez zwykły `<div>` z paddingiem) | zbędny wrapper |
| `p-md` | `p-4` (16 px) | brak tokena `md` w spacingu projektu |
| `gap-xs` | `gap-1` (6 px) | najmniejszy odstęp zgodny z `--spacing: 6px` |
| `mb-xs` | `mb-2` (12 px) | brak tokena `xs` w marginach |
| `font-label-caps` | `font-sans uppercase tracking-widest` | styl etykiety – sans-serif, kapitaliki |
| `text-tertiary-fixed-dim` | `text-text-primary/60` | przyciemniony kolor trzeciorzędny zastępujemy przez szary 60 % |
| `material-symbols-outlined` | wbudowana ikona SVG (strzałka ↗) | projekt nie ładuje Material Symbols |
| `text-outline` | `text-text-primary/40` | kolor obrysowy/jałowy = szary 40 % |
| `font-headline-sm` / `text-headline-sm` | `font-display text-lg` | Newsreader 20 px – najbliższy token `text-lg` zdefiniowany w global.css |
| `text-on-surface` | `text-text-secondary` | główny kolor tekstu na surface = białawy |
| `text-primary-fixed` | `text-primary` | zielony akcentowy |
| `font-body-md` / `text-body-md` | `font-sans text-sm` | body-md = 14 px, w projekcie zamapowane jako `--text-sm` |
| `text-on-surface-variant` | `text-text-primary` | szary tekst pomocniczy |
| `line-clamp-2` | `line-clamp-2` | Tailwind v4 obsługuje to natywnie |
| `group-hover:*` | pozostaje bez zmian | Tailwind grupa działa |
| `transition-all duration-500` | pozostaje bez zmian | Tailwind działa |
| `cursor-pointer` | pozostaje bez zmian | Tailwind działa |

## Propsy

```ts
interface Props {
  /** Data wyświetlana w etykiecie (np. "JUL 12, 2024") */
  date: string;
  /** Tytuł posta */
  title: string;
  /** Opis / zajawka */
  description: string;
  /** Dodatkowe klasy CSS */
  class?: string;
}
```

## Kod komponentu (`src/components/ui/PostCard.svelte`)

```svelte
<script lang="ts">
  interface Props {
    date: string;
    title: string;
    description: string;
    class?: string;
  }

  let { date, title, description, class: className = '' }: Props = $props();
</script>

<article
  class="group bg-surface border border-border/20 rounded-md cursor-pointer transition-all duration-500 hover:border-primary/40 hover:shadow-surface {className}"
>
  <div class="p-4 flex flex-col gap-1">
    <div class="flex justify-between items-start mb-2">
      <span class="font-sans text-[10px] uppercase tracking-widest text-text-primary/60">
        {date}
      </span>
      <svg
        class="size-4 text-text-primary/40 group-hover:text-primary transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </div>
    <h3
      class="font-display text-lg text-text-secondary group-hover:text-primary transition-colors"
    >
      {title}
    </h3>
    <p class="font-sans text-sm text-text-primary line-clamp-2">
      {description}
    </p>
  </div>
</article>
```

## Krok weryfikacji
1. Użyć komponentu na przykład w `src/pages/index.astro` lub `src/pages/blog.astro`:
   ```astro
   <PostCard
     date="JUL 12, 2024"
     title="Bento Grids & Information Density"
     description="A technical deep dive into modular grid systems and the psychology of structural containment in UI."
   />
   ```
2. Otworzyć http://localhost:4322/ i zweryfikować wygląd oraz hover.

## Pliki do zmiany
- **Nowy:** `src/components/ui/PostCard.svelte`
- **Opcjonalnie:** strona, na której komponent zostanie umieszczony (do ustalenia z użytkownikiem)
