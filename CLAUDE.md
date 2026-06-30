# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Diretrizes de trabalho

Diretrizes comportamentais para reduzir erros comuns de LLM ao programar (baseadas no plugin [karpathy-guidelines](https://github.com/forrestchang/andrej-karpathy-skills)). **Tradeoff:** priorizam cautela sobre velocidade — em tarefas triviais, use bom senso.

### 1. Pense antes de codar
**Não assuma. Não esconda dúvidas. Exponha tradeoffs.**
- Declare suas suposições explicitamente. Se houver incerteza, pergunte.
- Se existirem múltiplas interpretações, apresente-as — não escolha em silêncio.
- Se houver uma abordagem mais simples, diga. Discorde quando fizer sentido.
- Se algo estiver confuso, pare. Aponte o que não está claro. Pergunte.

### 2. Simplicidade primeiro
**O mínimo de código que resolve o problema. Nada especulativo.**
- Nenhuma funcionalidade além do que foi pedido.
- Nenhuma abstração para código de uso único.
- Nenhuma "flexibilidade" ou "configurabilidade" que não foi solicitada.
- Nenhum tratamento de erro para cenários impossíveis.
- Se escreveu 200 linhas e dava para fazer em 50, reescreva.

Pergunte-se: "Um engenheiro sênior diria que isto está complicado demais?" Se sim, simplifique.

### 3. Mudanças cirúrgicas
**Mexa só no que precisa. Limpe só a sua própria bagunça.**
- Não "melhore" código, comentários ou formatação adjacentes.
- Não refatore o que não está quebrado.
- Siga o estilo existente, mesmo que você faria diferente.
- Se notar dead code não relacionado, mencione — não apague.
- Remova imports/variáveis/funções que SUAS mudanças deixaram sem uso; não remova dead code preexistente sem ser pedido.

O teste: toda linha alterada deve rastrear diretamente ao pedido do usuário.

### 4. Execução guiada por objetivo
**Defina critérios de sucesso. Itere até verificar.**
- "Adicionar validação" → "Escreva testes para entradas inválidas e faça-os passar"
- "Corrigir o bug" → "Escreva um teste que o reproduz e faça-o passar"
- "Refatorar X" → "Garanta que os testes passam antes e depois"

Para tarefas multi-etapa, declare um plano breve (passo → como verificar). Critérios de sucesso fortes permitem iterar de forma independente; critérios fracos ("faça funcionar") exigem esclarecimentos constantes.

## Commands

```bash
npm run dev      # Vite dev server (default :5173; falls back to next free port)
npm run build    # production build to dist/
npm run lint     # ESLint (flat config in eslint.config.js)
npm run preview  # serve the built dist/
```

There is **no test framework** configured. To visually verify a change, build and capture a screenshot with headless Edge over the DevTools protocol (the hero is `100svh`, so a naive top-of-page screenshot only shows the hero — use `Page.captureScreenshot` with `captureBeyondViewport` and a clip computed from `getElementById('<section-id>').getBoundingClientRect()`).

## Stack & conventions

- **React 19 + Vite 8 + Tailwind 3**, plain JS/JSX (no TypeScript). Icons from `lucide-react`.
- **All UI copy and code comments are in Brazilian Portuguese.** Match this.
- This is a single-page marketing site for a fictional game store ("HALLOW"). `src/App.jsx` composes the whole page by stacking section components in order: Navbar → HeroCarousel → Ticker → GameGrid → DealBanner → TopicCarousels → RetroDeals → Genres → Newsletter → Footer.
- Section layout container is consistently `mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16`.

## Architecture

**Data is separated from presentation.** Components in `src/components/` are presentational; their content lives in `src/data/` modules (`games.js`, `catalog.js`, `deals.js`, `topics.js`, `retro.js`). Each data module maps raw entries through a local `make()` helper that derives computed fields and resolves image URLs — never hardcode cover URLs in components.

**Cover images come from real Steam/YouTube assets** via helpers in `src/data/catalog.js`:
- `steamCapsule(appId)` → official Steam header image (reliable).
- `ytThumb(id)` → YouTube thumbnail (used as fallback).
- `coverSources(game)` → ordered preference list; cards `onError`-chain to the next source.
- Steam covers (by `appId`) are dependable; some YouTube trailer IDs are placeholders and may fail to embed — cards degrade gracefully to the cover image, so don't assume every trailer plays.

**Trailer videos are served by Steam itself, not YouTube.** Each data entry carries a `steamMovie` (the trailer's movie ID, which is **distinct from `steamAppId`** — obtained via the public `appdetails` API). `steamTrailer(movieId)` in `catalog.js` builds the direct-file URL `…/steam/apps/{movieId}/movie480.mp4`. Only `movie480.mp4` (h264) is used — it's the one direct file present for every trailer that has a static version (the `movie_max`/`.webm` variants 404 on newer titles, and modern trailers otherwise only expose DASH/HLS manifests a plain `<video>` can't play). A few live-service titles (Apex, Rocket League, Dead by Daylight) have **no** static file at all — they intentionally omit `steamMovie` and show cover-only. The data `make()` helpers resolve `trailer: g.steamMovie ? steamTrailer(g.steamMovie) : null`.

**Hover-to-play previews are centralized in `src/hooks/useTrailerPreview.js`.** Hovering a card for ~0.5s mounts a muted, looping native `<video>` and only reveals it once the `playing` event fires, avoiding the black-frame flash while it buffers. The hook takes the resolved trailer URL (or `null` → no preview arms). `GameCard` (which derives the URL from `game.steamMovie` via `steamTrailer`), `DealBanner`'s `DealCard`, `TopicCarousels`' `TopicCard`, and `RetroDeals`' `RetroCard` (which read the pre-resolved `game.trailer`) all consume this hook — keep the behavior consistent by reusing it rather than re-implementing. The `GameDetails` "Assistir trailer" viewer also plays the Steam `<video>`, falling back to a YouTube iframe only for entries with no `steamMovie` (e.g. age-gated RE Requiem). The `HeroCarousel` is the **exception**: it deliberately keeps the YouTube embed for every slide because at full-screen size YouTube serves HD, whereas the Steam static file is only 480p (the 1080p `movie_max.mp4` 404s on newer titles, so it's not reliable).

**Sale / promotion convention:** a data entry is "on sale" iff it has an `oldPrice` greater than `price`; `make()` computes `discount` from that. Cards render the discount badge and struck-through old price **only when `discount > 0`**. To take a game off promotion, remove its `oldPrice`. `fmtBRL` (in `games.js`) formats all prices. Note: the `DealBanner` (Festival de Inverno) is the dedicated promo section — all its items are intentionally on sale.

## Styling system

- **Design tokens live in `tailwind.config.js`** `theme.extend`: the `ink-*` dark scale, `acid` (lime brand accent), `signal`, `chrome`; font families `display` (Unbounded), `body` (Sora), `mono` (Space Mono), plus retro/medieval faces `pixel` (Press Start 2P), `crt` (VT323), `heraldic` (Cinzel Decorative), `medieval` (Cinzel); and custom keyframes/animations (`ken-burns`, `marquee`, `rise`, `flicker`, etc.). Prefer these tokens over arbitrary values.
- **Adding a font requires two edits:** the `<link>` in `index.html` (Google Fonts) **and** a `fontFamily` entry in `tailwind.config.js`.
- **Shared utility classes are in `src/index.css`** under `@layer utilities` (`grain`, `scanlines`, `clip-btn`, `no-scrollbar`, `text-stroke`, `glow-acid`).
- **Section-specific complex CSS is colocated in a scoped `<style>` block**, not in global CSS. `RetroDeals.jsx` is the model: a `ScopedStyles()` component holds all `.med-`-prefixed rules and keyframes, and the section's theme is driven by CSS custom properties (`--gold`, `--sky-1`, etc.) set inline via `style={retroTheme}`. Follow this pattern (prefixed class names + CSS vars) for new themed sections.
