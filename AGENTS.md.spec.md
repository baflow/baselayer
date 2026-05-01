# AGENTS.md — Specyfikacja Formatu Kontekstu dla Agentow Kodujacych

> Wersja: 1.0-PL (na podstawie analizy agents.md, OpenAI Codex, Claude Code, Cursor, dyskusji Reddit i praktyk spolecznosci)
> Zrodla: https://agents.md, r/programming, r/ClaudeCode, r/codex, r/ChatGPTCoding, aihero.dev

---

## 1. Definicja i cel

**AGENTS.md** to plik kontekstowy w formacie Markdown, przeznaczony wylacznie dla agentow AI wspomagajacych kodowanie. Jego rola jest analogiczna do README.md — ale podczas gdy README sluzy ludziom (quick start, opis projektu, wskazowki dla contributorow), AGENTS.md zawiera dodatkowy, czasem szczegolowy kontekst, ktory ludziom przeszkadzalby w szybkim zrozumieniu projektu, a agentowi jest niezbedny do efektywnej pracy.

> "Think of it as a README for agents." — agents.md

### 1.1. Roznica miedzy README.md a AGENTS.md

| README.md | AGENTS.md |
|-----------|-----------|
| Dla ludzi | Dla agentow AI |
| Misja i wizja projektu | Konwencje kodu, komendy build/test |
| Jak zaczac (quick start) | Anti-patterny i szczegoly architektury |
| Wskazowki dla contributorow | Guardrails i sciezki do dodatkowego kontekstu |
| Ogolny opis technologii | Dlaczego uzywamy X zamiast Y (legacy, constraint) |

---

## 2. Lokalizacja i hierarchia

### 2.1. Plik globalny (root)
Umiesc `AGENTS.md` w **korzeniu repozytorium**. Wiekszosc narzedzi (Codex, Claude Code, Cursor, Copilot) automatycznie wczytuje ten plik jako statyczny, ciagle obecny kontekst.

### 2.2. Pliki zagniezdzone (subdirectory AGENTS.md)
W monorepo lub duzych projektach mozesz umieszczac dodatkowe `AGENTS.md` w **subfolderach** (np. `/backend/AGENTS.md`, `/frontend/AGENTS.md`). Agent zawsze czyta plik **najblizszy edytowanemu plikowi** w hierarchii katalogow.

> Przyklad: w repo OpenAI na dzien pisania tej specyfikacji istnialo **88 plikow AGENTS.md** w roznych pakietach.

### 2.3. Plik globalny uzytkownika
Niektore narzedzia (np. Codex, Claude Code) wspieraja plik globalny uzytkownika:
- `~/.codex/AGENTS.md` (Codex)
- `~/.claude/CLAUDE.md` (Claude Code)

Ten kontekst jest wczytywany automatycznie przy kazdej sesji i zawiera zasady obowiazujace we wszystkich projektach.

---

## 3. Zasady ogolne (Najwazniejsze zasady z dyskusji)

### 3.1. Mniej = wiecej
"Badz bezwzgledny w tym, co tu trafiasz." Duze pliki AGENTS.md (**>64KB**) zniechecaja agentow, zuzywaja tokeny i zmniejszaja skutecznosc. Badania z 2026 r. (arXiv:2602.11988) pokazuja, ze nadmiar kontekstu moze obnizyc skutecznosc agenta o 20%+.

**Zasada progressive disclosure:** Podaj agentowi tylko tyle, ile potrzebuje do startu, z odsylaczami (breadcrumbs) do szczegolowych zasobow, gdy zajdzie potrzeba.

### 3.2. Konkret bije ogolnosc
Dobra sekcja to:
```
## Anti-patterns
- NIGDY nie uzywaj `eval()` w parserze zapytan — prowadzilo to do
  CVE-2024-XXXX. Zamiast tego uzyj `ast.literal_eval()`.
```

Zla sekcja to:
```
## Kodowanie
- Pisz czysty kod zgodny z najlepszymi praktykami.
```

### 3.3. Living documentation
AGENTS.md musi byc aktualizowany razem z projektem. Nieaktualny kontekst jest gorszy niz brak kontekstu — agent podejmie decyzje na podstawie zdezaktualizowanych informacji.

### 3.4. Guardrails > instrukcje ogolne
Zamiast dlugich opisow "jak kodowac", uzywaj zasad typu:
- "Po przeniesieniu plikow uruchom `pnpm lint --filter <pkg>`"
- "Zawsze dodaj testy do zmienionego kodu, nawet jesli nikt nie prosil"
- "Tytul PR: `[<project_name>] <Title>`"

---

## 4. Rekomendowana struktura (szablon)

Plik powinien byc podzielony na logiczne sekcje. Nie wszystkie sa obowiazkowe — wybierz te, ktore maja sens dla Twojego projektu.

---

### Sekcja 1: Project Identity (1-3 zdania)
> "Zdanie o roli agenta."

```markdown
# AGENTS.md

## Project Identity
This is the [language/framework] backend for [Product Name], a [type of app].
The agent acts as a senior [language] developer with expertise in [domain].
```

### Sekcja 2: Key Files & Architecture
> Krotki opis struktury i waznych plikow. Agent powinien wiedziec, gdzie szukac.

```markdown
## Key Files
| File/Folder | Purpose |
|-------------|---------|
| `src/core/` | Business logic, pure functions, no I/O |
| `src/adapters/` | Ports & adapters, DB/HTTP/API integrations |
| `src/cli/` | Entry points, argument parsing |
| `tests/` | Pytest suite; mirror structure of `src/` |
| `pyproject.toml` | Dependencies, scripts, metadata |
```

### Sekcja 3: Dev Environment
> Komendy, ktore agent bedzie uzywal codziennie.

```markdown
## Dev Environment
- Package manager: **pnpm** (use corepack if missing)
- Node version: >=22.12.0 (see `.nvmrc`)
- Run dev server: `pnpm dev`
- Run tests: `pnpm test`
- Run linter: `pnpm lint`
- Type check: `pnpm typecheck`
- After any import change, run `pnpm lint` before committing.
```

### Sekcja 4: Code Style & Conventions
> Tu wlasnie **konkret** jest krolem. Nie wymieniaj "najlepszych praktyk" — opisz Twoj **wymuszony styl**.

```markdown
## Code Style
- TypeScript: strict mode ON (`strict: true` in tsconfig)
- Naming: `PascalCase` for components, `camelCase` for functions,
  `kebab-case` for files, `SCREAMING_SNAKE_CASE` for constants
- Prefer `async/await` over raw Promises
- NO `console.log` in production code — use the `logger` from `src/lib/logger.ts`
- NO barrel exports (`index.ts` re-exporting everything) in `src/core/`
```

### Sekcja 5: Architecture Rules
> Decyzje architektoniczne, ktorych agent nie powinien lamac.

```markdown
## Architecture
- All DB access MUST go through repositories in `src/adapters/db/`
- Controllers MUST be thin — max 20 lines; logic goes to services
- API responses use the envelope pattern: `{ data, error, meta }`
- Never import from `../` above `src/`; use path aliases (`@/core/...`)
```

### Sekcja 6: Testing
> Jak testowac, jakie frameworki, ktore pliki.

```markdown
## Testing
- Framework: **Vitest**
- Test naming: `<module>.test.ts` next to tested file
- Run focused test: `pnpm vitest run -t "<test name>"`
- All PRs must pass `pnpm test` before merge
- Mock external HTTP calls; never hit real APIs in tests
```

### Sekcja 7: Security & Anti-patterns (Critical)
> To najwazniejsza sekcja wg. dyskusji. Konkretne bledy i jak ich unikac.

```markdown
## Security & Anti-patterns
- NEVER commit secrets. `.env` is gitignored; use `.env.example` for docs
- NEVER use `innerHTML` or `dangerouslySetInnerHTML` — always escape output
- SQL queries MUST use parameterized queries (Drizzle/Knex/ORM)
- Input validation: use Zod schemas in `src/validators/`
- If modifying auth flow, always check with `tests/auth/`
```

### Sekcja 8: Handoff & State (opcjonalne)
> Dlugie zadania moga wymagac wznowienia. Instrukcja, jak prowadzic handoff.

```markdown
## Session Handoff
- After each session: update `handoff.md` with what was done and what's next
- Trigger word for handoff: `hand off`
- Always reference `handoff.md` when starting a new thread
```

---

## 5. Co ZAKAZANE / co nie powinno trafic do AGENTS.md

| Nie umieszczaj | Dlaczego |
|----------------|----------|
| Pelnej dokumentacji API | Zbyt dlugie; odsylaj do `docs/api.md` |
| Historii git / changeloga | To nie jest miejsce na release notes |
| Ogolnych porad typu "pisz czysty kod" | Marnuje tokeny; nic nie wnosi |
| Opisow technologii, ktore agent zna | Nie wyjasniaj, czym jest React czy Python |
| Duzych sekcji zamiennie uzywalnych z README | Jesli pasuje do README, tam to zostaw |
| Starych, nieaktualnych informacji | Stale informacje "trują" kontekst |

---

## 6. Progressive Disclosure — wzorzec skalowania

Jesli projekt jest duzy, nie wpychaj wszystkiego do AGENTS.md. Zamiast tego:

1. **Trzymaj szczegoly w osobnych plikach** w folderze `docs/` lub `.ai/`
2. **W AGENTS.md umiesc tylko odsylacze** z krotkim opisem

```markdown
## Extended Context
- `docs/ARCHITECTURE.md` — full system design and ADRs
- `docs/API.md` — OpenAPI spec and endpoint conventions
- `docs/DEPLOYMENT.md` — CI/CD, infra, env vars
- `.ai/testing-guide.md` — detailed testing patterns for this repo
```

> "Best practice is to chop your large file into logical sections, put these in
> separate files in a docs/ subfolder, then include their pathnames
> (with for each a brief explanation of what the Agent can find there)
> in your AGENTS.md file." — r/codex

---

## 7. Kompatybilnosc narzedziowa (2026)

| Narzedzie | Plik(y) | Uwagi |
|-----------|---------|-------|
| **OpenAI Codex** | `AGENTS.md`, `~/.codex/AGENTS.md` | Automatycznie wczytywany na starcie sesji |
| **Claude Code** | `CLAUDE.md`, `~/.claude/CLAUDE.md` | Zawsze w kontekscie; nie obsluguje hierarchii AGENTS.md |
| **Cursor** | `.cursor/rules`, `CLAUDE.md` | Wczytuje z folderu `.cursor` |
| **GitHub Copilot** | `.github/copilot-instructions.md` + `AGENTS.md` | AGENTS.md jest wczytywany dodatkowo |
| **Aider** | `AGENTS.md` (via `.aider.conf.yml`) | Wymaga jawnej konfiguracji: `read: AGENTS.md` |
| **Gemini CLI** | `AGENTS.md` (via `.gemini/settings.json`) | Wymaga jawnej konfiguracji `context.fileName` |
| **VS Code** | `AGENTS.md` | Społecznosciowa zgodnosc |
| **Augment Code / RooCode / Factory / Devin / Goose** | `AGENTS.md` | Oficjalnie wspierane przez agents.md |

### Unifikacja (opcjonalna)
Jesli chcesz jeden plik dla wszystkich agentow:
```bash
# Stworz AGENTS.md jako zrodlo prawdy, symlinkuj dla innych:
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md .cursor/rules
```

Lub w `CLAUDE.md` umiesc tylko:
```markdown
# AI Agent Context
@AGENTS.md
```

---

## 8. Dobra praktyka: Ewolucja pliku

Nie pisz AGENTS.md naraz. Rozwijaj go iteracyjnie:

1. **Start:** Stworz minimalny plik (Project Identity + Dev Environment)
2. **Observacja:** Gdy agent popelni blad, ktory moglby zapobiec AGENTS.md — dodaj regule
3. **Poddzial:** Gdy plik przekroczy ~500 linii — wydziel sekcje do osobnych plikow
4. **Audyt:** Co 2-4 tygodnie sprawdz, czy informacje sa aktualne

> "Every time it makes a big mistake, I ask it to refine the rules to make sure
> that doesn't happen again. It's a process to develop, but once you have it
> dialed in it really helps." — r/ChatGPTCoding

---

## 9. Kompletny przyklad minimalnego AGENTS.md

```markdown
# AGENTS.md — Vertex Holdings Dashboard

## Project Identity
Astro 6 + Tailwind v4 static dashboard for investment analytics.
The agent acts as a senior frontend developer with strong design-system thinking.

## Key Files
| Path | Purpose |
|------|---------|
| `src/styles/global.css` | Tailwind theme + design tokens (colors, spacing, shadows) |
| `src/components/` | Reusable UI components |
| `src/layouts/` | Page layouts |
| `src/pages/` | Astro routes |
| `DESIGN.md` | Full design system spec (read before implementing UI) |

## Dev Environment
- Package manager: **npm**
- Dev server: `npm run dev` (port 4321)
- Build: `npm run build`
- Preview: `npm run preview`

## Code Style
- Astro components use frontmatter (`---`) for server-side logic
- Styles: Tailwind utility classes ONLY; no custom CSS in components
- Naming: PascalCase for components, kebab-case for files
- Images: use `astro:assets` (`<Image />`) instead of `<img>`

## Architecture
- All components live in `src/components/` or subfolders
- Layouts wrap pages in `src/layouts/`
- Data fetching: use Astro Content Collections (`src/content/`)
- NEVER use `client:*` directives unless interactivity is strictly required

## Testing
- Always run `npm run build` before finishing a task to catch type errors
- Check `DESIGN.md` before implementing any UI element

## Anti-patterns
- NEVER use arbitrary Tailwind values (e.g. `w-[123px]`) —
  extend theme in `global.css` if a token is missing
- NEVER skip `npm run build` before declaring a task complete
```

---

## 10. Podsumowanie zasad

1. **AGENTS.md to README dla agenta** — nie dla czlowieka.
2. **Krotki i konkretny** — mniej tokenow = lepsze wyniki.
3. **Anti-patterns > ogolne wytyczne** — "NIGDY nie rob X" dziala lepiej niz "Staraj sie robic Y".
4. **Progresywne ujawnianie** — linkuj do szczegolow, nie wklejaj ich.
5. **Living doc** — aktualizuj, gdy projekt sie zmienia.
6. **Hierarchiczny** — root + subfoldery w monorepo.
7. **Guardrails** — zasady wymuszajace, nie sugestie.

---

*Specyfikacja opracowana na podstawie dokumentacji https://agents.md, artykulow
aihero.dev i towardsdatascience.com, oraz analizy dyskusji na subredditach
r/programming, r/ClaudeCode, r/codex, r/ChatGPTCoding, r/vibecoding, r/LLM
(z luty-kwiecien 2026).*
