# BT Builder — Visual Behavior Tree Builder

A responsive single-page web app for visually configuring an AI agent's
decision-making **Behavior Tree** and exporting it as clean, structured YAML.
Built for non-technical strategic managers — no code required.

Stack: **Vite · React · TypeScript · Tailwind CSS · React Flow · Zustand**.

> 🇵🇱 Polska wersja instrukcji znajduje się [poniżej](#-bt-builder--wizualny-kreator-drzewa-zachowań).

---

## ✨ Features

- **Bilingual UI (EN / PL)** — toggle the whole interface from the header.
- **Node palette** — drag-and-drop or click-to-add Composite, Condition and Action nodes.
- **Canvas workspace** — link nodes into a parent → child hierarchy.
- **Property panel** — configure each node's custom label and parameters.
- **Live YAML preview** — updates as you build, with built-in validation.
- **Export to YAML** — download a ready-to-use strategy file.

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build into /dist
npm run preview  # preview the production build locally
```

---

## 🧩 How to use it

### 1. Add nodes
- Open the **Node Palette** on the left.
- **Drag** a node onto the canvas, or **click** it to drop one near the centre.
- Categories:
  - **Composite** — `Selector (?)` runs children until one succeeds; `Sequence (->)` runs them in order until one fails.
  - **Condition** — Health Check, Cooldown Status, Enemy Distance, Status Effect.
  - **Action** — Cast Ability, Use Item, Move To Position, Interact With Object.

### 2. Connect nodes
- Drag from a composite node's **bottom handle** to another node's **top handle**.
- The node with **no parent** becomes the **root**.
- Each node may only have one parent — connecting a new parent replaces the old link.

### 3. Fill in variables
- Click any node to open the **Property panel** on the right.
- Set a **Custom Label** (e.g. *Emergency Healing*) and edit the parameters
  (e.g. *Threshold Percentage* for Health Check, *Ability ID* for Cast Ability).

### 4. Export the strategy
- Watch the **YAML Preview** update live at the bottom.
- Read the **Validation** banner to catch a missing root or misplaced node.
- Click **Export to YAML** to download `behavior_tree.yaml`, or **Copy** to the clipboard.

Tip: click **Load Example** in the header to start from a working tree.

---

## 📄 Export format

The exporter produces standard indented YAML, for example:

```yaml
type: "Selector"
name: "Root Priority"
children:
  - type: "Sequence"
    name: "Emergency Healing"
    conditions:
      - type: "HealthBelow"
        value: 35
    actions:
      - type: "ExecuteAbility"
        ability: "health_potion"
```

Under each composite node, children are grouped automatically into
`conditions:`, `actions:` and nested `children:` lists.

---

## 🏗️ Project structure

```
src/
  components/
    Canvas/        # React Flow canvas + drag-drop
    Sidebar/       # Palette + Property panel
    NodeTypes/     # Custom BT node renderer
    Export/        # Live YAML preview panel
    Header.tsx     # Title bar, actions, language toggle
  hooks/
    useTreeExporter.ts   # Tree-building + YAML serialisation + validation
  i18n/            # EN/PL translations + context provider
  store/           # Zustand state (nodes, edges, selection)
  nodeDefinitions.ts     # The bilingual node catalogue
  exampleTree.ts         # Sample strategy
```

---

## 🌐 Deploy to GitHub Pages

`gh-pages` is preconfigured and `vite.config.ts` uses `base: './'` so assets
resolve correctly on Pages.

```bash
npm run deploy   # runs predeploy (build) then publishes /dist to gh-pages branch
```

If you host under a project path and prefer an absolute base, set
`base: '/<repo-name>/'` in `vite.config.ts` instead.

---
---

# 🇵🇱 BT Builder — Wizualny Kreator Drzewa Zachowań

Responsywna, jednostronicowa aplikacja webowa do wizualnej konfiguracji
**Drzewa Zachowań** (Behavior Tree) agenta AI i eksportu go do czytelnego pliku
YAML. Stworzona dla nietechnicznych menedżerów strategicznych — bez pisania kodu.

Technologie: **Vite · React · TypeScript · Tailwind CSS · React Flow · Zustand**.

## ✨ Funkcje

- **Dwujęzyczny interfejs (EN / PL)** — przełączany z paska nagłówka.
- **Paleta węzłów** — przeciągnij lub kliknij, aby dodać węzły złożone, warunkowe i akcji.
- **Plansza robocza** — łącz węzły w hierarchię rodzic → dziecko.
- **Panel właściwości** — konfiguruj etykietę i parametry każdego węzła.
- **Podgląd YAML na żywo** — aktualizowany podczas budowy, z walidacją.
- **Eksport do YAML** — pobierz gotowy plik strategii.

## 🚀 Pierwsze kroki

```bash
npm install      # instalacja zależności
npm run dev      # serwer deweloperski (http://localhost:5173)
npm run build    # sprawdzenie typów + build produkcyjny do /dist
npm run preview  # podgląd builda produkcyjnego
```

## 🧩 Jak używać

### 1. Dodawanie węzłów
- Otwórz **Paletę węzłów** po lewej stronie.
- **Przeciągnij** węzeł na planszę lub **kliknij**, aby dodać go w pobliżu środka.
- Kategorie:
  - **Złożone** — `Selektor (?)` uruchamia dzieci, aż jedno odniesie sukces; `Sekwencja (->)` uruchamia je po kolei, aż jedno zawiedzie.
  - **Warunkowe** — Sprawdzenie zdrowia, Status odnowienia, Dystans wroga, Efekt statusu.
  - **Akcji** — Rzuć zdolność, Użyj przedmiotu, Przejdź do pozycji, Wejdź w interakcję.

### 2. Łączenie węzłów
- Przeciągnij od **dolnego uchwytu** węzła złożonego do **górnego uchwytu** innego węzła.
- Węzeł **bez rodzica** staje się **korzeniem** (root).
- Każdy węzeł może mieć tylko jednego rodzica — nowe połączenie zastępuje poprzednie.

### 3. Uzupełnianie zmiennych
- Kliknij dowolny węzeł, aby otworzyć **Panel właściwości** po prawej.
- Ustaw **Etykietę własną** (np. *Awaryjne leczenie*) i edytuj parametry
  (np. *Próg procentowy* dla Sprawdzenia zdrowia, *ID zdolności* dla Rzuć zdolność).

### 4. Eksport strategii
- Obserwuj **Podgląd YAML** aktualizowany na żywo u dołu.
- Czytaj komunikat **Walidacji**, aby wykryć brak korzenia lub źle umieszczony węzeł.
- Kliknij **Eksportuj do YAML**, aby pobrać `behavior_tree.yaml`, lub **Kopiuj** do schowka.

Wskazówka: kliknij **Wczytaj przykład** w nagłówku, aby zacząć od gotowego drzewa.

## 📄 Format eksportu

Eksporter tworzy standardowy YAML z wcięciami, na przykład:

```yaml
type: "Selector"
name: "Root Priority"
children:
  - type: "Sequence"
    name: "Emergency Healing"
    conditions:
      - type: "HealthBelow"
        value: 35
    actions:
      - type: "ExecuteAbility"
        ability: "health_potion"
```

Pod każdym węzłem złożonym dzieci są automatycznie grupowane w listy
`conditions:`, `actions:` oraz zagnieżdżone `children:`.

## 🌐 Wdrożenie na GitHub Pages

`gh-pages` jest skonfigurowane, a `vite.config.ts` używa `base: './'`, dzięki
czemu zasoby ładują się poprawnie na GitHub Pages.

```bash
npm run deploy   # uruchamia predeploy (build), a następnie publikuje /dist na gałąź gh-pages
```

Jeśli hostujesz pod ścieżką projektu i wolisz ścieżkę bezwzględną, ustaw
`base: '/<nazwa-repo>/'` w `vite.config.ts`.
