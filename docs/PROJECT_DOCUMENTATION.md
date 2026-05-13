# Project Documentation

## Overview

`LEXIS` is a static HTML/CSS/JavaScript flashcard application for practicing English and Arabic vocabulary. It stores entries locally in the browser, so users can continue their study sessions without a backend.

## Core Components

### HTML

- `flashcard-app.html` contains the application shell and three panels:
  - `Add` panel for entering new vocabulary.
  - `Words` panel for searching and managing saved entries.
  - `Flash` panel for studying the deck.
- The navigation bar toggles visible panels and updates active state.
- Elements are identified by IDs and classes consumed by `main.js`.

### CSS

- `style.css` provides the app's dark UI theme, responsive layout, and component styles.
- Key visual sections include:
  - header and navigation
  - stats strip and form layout
  - word list cards
  - flashcard 3D flip effect
  - sidebar controls and deck list

### JavaScript

- `main.js` manages state and UI interactions.
- Data persistence uses `localStorage` with the key `lexis_v3`.

#### App functions

- `load()` / `save()`
  - Manage JSON serialization to/from localStorage.
- `show(id)`
  - Switch panels and initialize the list or flash view when needed.
- `addWord()`
  - Validate inputs, save a new card, reset the form, and show a toast.
- `renderList()`
  - Display saved words, filter by search query, and show an empty state.
- `delWord(id)`
  - Remove a word and refresh statistics.
- `initFlash()` / `renderFlash()`
  - Build the flashcard study UI and prepare the deck.
- `updateCard()`
  - Update the current flashcard, progress bar, and deck list.
- `flipCard()`, `nav()`, `jumpTo(i)`, `restart()`, `reshuffle()`
  - Provide interactive flashcard controls.

## Data Model

Each saved word entry has this shape:

- `id` — unique timestamp-based identifier.
- `en` — English vocabulary word.
- `ar` — Arabic translation.
- `ex` — Example sentence in English.
- `ts` — timestamp when the entry was created.

## Behavior Details

- Entries are displayed in reverse chronological order.
- The `Add` view includes live preview updates for new word input.
- Search supports both English and Arabic text.
- The `Flash` view automatically resets the flipped state whenever the card changes.
- The deck list highlights the active card and scrolls it into view.

## Customization

- To change the theme, edit `style.css` variables in the `:root` section.
- To adjust storage behavior, update the `KEY` constant in `main.js`.
- You can add additional fields or translations by extending the form and word model.

## Browser Compatibility

- Designed for modern browsers with ES6 support.
- Requires JavaScript and `localStorage` availability.
- No dependencies or build process required.

## Deployment

- Host the three files on any static web server.
- Alternatively, open `flashcard-app.html` directly in the browser for local use.
