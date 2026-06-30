# Product

## Register

brand

> **Nota sobre o register split.** O default é `brand` — a identidade visual da
> HALLOW é o que carrega este projeto. Mas a aplicação tem superfícies de produto
> reais (Catálogo, Login, Registro, Conta, Admin, carrinho, biblioteca, pedidos).
> Trate a **home/vitrine como brand** (o design É o produto) e as **páginas de app
> como product** (o design SERVE o fluxo) caso a caso. Cada tarefa pode sobrescrever
> o register; este arquivo só carrega o default.

## Users

Este é um **projeto de portfólio / showcase**: uma loja de jogos fictícia ("HALLOW")
construída para demonstrar domínio de frontend e full-stack.

- **Usuário real:** recrutadores, leads técnicos e visitantes avaliando a qualidade
  do trabalho. O contexto é uma avaliação rápida — a primeira tela precisa provar
  craft em segundos.
- **Usuário encenado (a persona da loja):** um gamer navegando por lançamentos,
  promoções e títulos retrô. As superfícies de app (catálogo, carrinho, conta,
  biblioteca) existem para que a experiência *funcione de verdade*, não só pareça
  funcionar — comprar, logar, gerenciar biblioteca e o CRUD de admin são fluxos reais.

O trabalho a ser feito: **convencer o avaliador de que quem construiu isto sabe
desenhar e implementar uma experiência completa**, da vitrine à área logada.

## Product Purpose

HALLOW é uma vitrine full-stack de loja de jogos. Existe para mostrar, num único
projeto, tanto **identidade visual ambiciosa** (hero cinematográfico, carrosséis de
trailers, seção retrô/medieval temática, animações) quanto **engenharia de produto
honesta** (auth user/admin com JWT, catálogo via API, biblioteca, pedidos, SQLite).

Sucesso = um visitante que chega pela home impressionado e, ao explorar catálogo →
detalhe → carrinho → conta, encontra um app coeso e sem arestas. O design nunca pode
parecer template; a engenharia nunca pode parecer mockup.

## Brand Personality

**Três palavras: ousada, elétrica, arcade.**

- **Voz:** confiante e direta, com atitude de gamer. Toda a copy e os comentários de
  código são em **português brasileiro** — manter assim.
- **Tom:** alta energia. Acid-lime neon sobre escuridão (`ink-*`), tipografia
  expressiva (display Unbounded, mono Space Mono, mais as faces retrô/medieval
  pixel/CRT/heráldica), movimento como parte do material (ken-burns, marquee,
  flicker, previews de trailer no hover).
- **Emoção alvo:** empolgação e desejo — a vontade de clicar em "jogar trailer" e de
  adicionar ao carrinho. Nas áreas de app, a energia baixa o suficiente para o fluxo
  respirar, sem perder a marca.

## Anti-references

- **SaaS genérico / AI-slop.** Nada de fundos creme/bege, eyebrows minúsculas em
  caixa-alta com tracking largo acima de cada seção, texto com gradiente
  (`background-clip: text`), grids de cards idênticos com ícone+título+texto, ou o
  template hero-métrica. É o visual "gerado por IA de 2026" — banido.
- **Gamer clip-art / infantil.** Nada de clichês RGB baratos, energia Comic-Sans,
  lens flares, ou gradientes arco-íris berrantes. A estética é arcade *com craft* —
  ousadia que parece desenhada, não cafona.
- (Implícito) Não virar um clone utilitário de Steam/Epic, nem um minimalismo
  estéril que apague a personalidade retrô/arcade.

## Design Principles

1. **O design é a prova.** Sendo um portfólio, cada seção precisa demonstrar
   intenção. Se um avaliador pudesse dizer "isso é template", falhou.
2. **Ousadia com disciplina.** Loud não é desculpa para bagunça — neon, movimento e
   tipografia expressiva sempre a serviço de hierarquia e legibilidade, nunca contra.
3. **Dados separados de apresentação.** Componentes em `src/components/` são
   apresentacionais; o conteúdo vive em `src/data/` via helpers `make()`. Manter
   essa fronteira ao estender.
4. **Vitrine encanta, app respeita.** A home pode gritar; as telas logadas (conta,
   admin, checkout) priorizam clareza e fluxo. A marca atravessa as duas, com
   volumes diferentes.
5. **Degradação graciosa como recurso de craft.** Covers e trailers vêm de assets
   reais (Steam/YouTube) e podem falhar; a experiência sempre cai para um estado
   bom (cover-only, fallback de fonte) em vez de quebrar.

## Accessibility & Inclusion

Meta: **WCAG 2.1 AA + redução de movimento.**

- **Contraste:** texto de corpo ≥ 4.5:1 e texto grande ≥ 3:1 — exigência real num
  tema escuro com acentos neon. O acid-lime sobre `ink` escuro tem contraste alto;
  cuidar de texto cinza/muted sobre superfícies tingidas, o ponto fraco típico.
- **Movimento:** o projeto é rico em animação (ken-burns, marquee, flicker, previews
  de trailer no hover). Toda animação precisa de alternativa em
  `@media (prefers-reduced-motion: reduce)` — tipicamente crossfade ou estado
  estático. Autoplay de vídeo sempre mudo e nunca essencial à compreensão.
- **Idioma:** documento em `pt-BR`; manter `lang` e copy consistentes.
