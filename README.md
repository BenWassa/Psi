# Project Psi Ψ

*Interactive companion to The Mind Unfolding — explore the history of psychology by time and by idea.*

---

## 🎧 Project Overview

Project Psi powers The Mind Unfolding — an audio series with a lightweight, interactive companion site. Together they explore the **history of psychology** as a living story you can hear and navigate.

The site is built for two complementary ways of learning:

- Timeline Mode — Walk chronologically through key eras via short, focused episode cards.
- Theme Mode — Jump between cross‑cultural ideas (e.g., “Dream Realms,” “Soul Architecture”) and watch concepts evolve across time.

Every episode appears in both modes, so you can follow the story linearly or hop between connected ideas. The goal is clarity, context, and curiosity — turning listening into exploration.

Think:

- Carl Jung meets Joseph Campbell meets modern, minimal web design
- A navigable museum of the mind you can browse by time or idea

---

## 🧭 Interactive Companion Vision

The Mind Unfolding is paired with a dual‑mode site that mirrors each episode in two views:

1) Timeline Mode
- Chronological spine of the field — eras, thinkers, and turning points
- Episode cards with quick context, tags, and links to listen/read

2) Theme Mode
- Cross‑cultural concepts that thread through history (e.g., dreams, soul models, healing)
- Each concept aggregates related episodes across eras

Design principles:
- One source of truth per episode; many paths through it
- Minimal, accessible UI (keyboard and screen‑reader friendly)
- Fast to scan, easy to dive deeper (audio, transcript, glossary)

Status: The MVP dual‑mode mockup lives in `/docs/index.html` and will expand as episodes ship.

---

## 🚦 Milestone Phases

### ✅ Phase 0: Concept Solidified

* [x] Narrative voice + tone finalized
* [x] Core vision and platform scope defined
* [x] Initial prompt suite complete
* [x] Repository + documentation structured

### 🚧 Phase 1: Episode 1 Build (MVP Production Loop)

* [x] 5 prompts processed (Gemini + GPT/Claude)
* [x] 3 key insights extracted per prompt
* [x] All 5 research summaries completed (P1-P5)
* [x] Episode 1 scaffold created ("Before the Mind Was Measured")
* [x] Symbol + tone mapping completed
* [x] Audio production framework defined
* [x] Dual‑mode site mockup (Timeline/Themes) in `/docs`
* [ ] Beatboard + scratch narration
* [ ] Audio board test in NotebookLM
* [ ] 15‑min narrative audio prototype
* [ ] Publish Episode 1 page with audio + transcript

### 🌿 Phase 2: Companion Materials + Platform Expansion

* [ ] Glossary, quotes, and source archive
* [ ] Episode cards wired to both modes (time + theme)
* [ ] Cross‑linking: episode ↔ related themes ↔ adjacent eras
* [ ] Research logs exported as structured notes
* [ ] Collaborative tooling setup for future team contributions

---

## 🎙️ Production Loop (Lean & Constrained)

> *No source enters the workflow unless it earns a place in the final 15-min arc.*

### 🛠️ 1. Dual AI Research

* Prompt each source (Gemini + GPT/Claude)
* Cull and critique to top **3 insights per prompt**

### 🧠 2. Beat Extraction

* Identify:

  * Story beats
  * Emotional tones
  * Symbols/metaphors
  * Psychological function

### 🎧 3. Scratch Narration

* Record or synthesize each beat (voice notes or ElevenLabs)
* Evaluate narrative clarity + emotional rhythm

### 🧩 4. Audio Board Assembly

* Tag each beat with timestamp, tone, and theme in NotebookLM
* Align structure to episode arc and site modes (Timeline/Themes)

### 🔁 5. Iterate the Arc

* Revise story flow until it feels like a **cohesive inner journey**

### ⏱️ 6. Track the Burn Rate™

* Log hours per step (research → beat → audio)
* Use this to scope future episodes and team bandwidth

---

## 🗂️ Repo Structure

```
docs/       → Public site (HTML/CSS/JS). Dual‑mode MVP in index.html
scripts/    → Final narrator scripts
audio/      → Raw and processed narration files
research/   → Source notes, summaries, citations
content/    → Companion docs: glossaries, timelines, symbols
planning/   → Vision docs, beatboards, task tracking
```

---

## 🚀 GitHub Pages & Local Dev

This site is served from the `docs/` folder, compatible with GitHub Pages.

- docs/.nojekyll — disables Jekyll processing (so assets load as-is)
- docs/404.html — SPA fallback that redirects back to `docs/index.html` (keeps hash routing working)

### Local development

Use a small static server so the app can fetch `assets/data.json` without file:// issues.

- VS Code task: "Serve docs" (requires Node.js)
  1. Open the Command Palette → "Run Task" → "Serve docs"
  2. Browser will open at http://localhost:5173

Alternatively, use any static HTTP server to serve the `docs/` directory.

### Deploy to GitHub Pages

1) Push to `main` with your changes (including `docs/`)
2) In your repository settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` (folder: `/docs`)
3) Visit your site at: `https://<user-or-org>.github.io/<repo>/docs/`

Deep links
- The app uses hash routing (e.g., `#mode=timeline&episode=egypt`), which is preserved on Pages.
- The `404.html` redirects back to `docs/index.html` to recover if a path is opened directly.

---

## 🧪 Tools & Stack

| Use                   | Tools                          |
| --------------------- | ------------------------------ |
| Research              | Gemini, GPT‑4o, Claude         |
| Audio Drafting        | NotebookLM, ElevenLabs (test)  |
| Script Writing        | ChatGPT + Claude + Manual edit |
| Site UI               | HTML/CSS + vanilla JS (`/docs`)|
| Visual Planning       | Figma, Excalidraw, Mermaid     |
| Deployment            | GitHub Pages via `/docs/`      |
| Collaboration (later) | GitHub + Notion (TBD)          |

---

## 🔭 Vision Statement
An interactive companion to the history of psychology: listen to the story, then explore it by time and idea. Each episode anchors a small, reliable node; the site lets those nodes recombine into paths, clusters, and questions.

As it grows, Psi becomes:

* A **map of psychological evolution** across eras and cultures
* A **toolkit for learners**, linking episodes to glossaries, sources, and visuals
* A **clean, extensible interface** for cross‑connecting ideas without complexity

---

## 💬 Contact / Contributions

This project is currently solo-built with planned expansion for collaborators in writing, audio production, and platform design.
If you'd like to contribute or follow the journey, reach out via GitHub discussions or email (TBD).
