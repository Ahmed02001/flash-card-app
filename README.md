# LEXIS — EN ↔ AR Vocabulary Flashcards

A lightweight browser-based flashcard app for learning English and Arabic vocabulary. Save word pairs with example sentences, browse your deck, and review with a flipped flashcard study mode.

## Features

- Add English words with Arabic translations and optional example sentences.
- Live preview while typing a new flashcard.
- Local storage persistence in the browser.
- Searchable word list with delete support.
- Flashcard study mode with card flipping, navigation, restart, and optional shuffle.
- Deck progress indicator and quick card selection.

## Getting Started

### Open the app

1. Open `flashcard-app.html` in a modern browser.
2. Use the navigation buttons at the top to switch between:
   - `Add` — create new words
   - `Words` — view, search, and delete saved words
   - `Flash` — study your deck with interactive flashcards

### Add a new word

- Enter the English word.
- Enter the Arabic translation.
- Optionally add an example sentence in English.
- Click `SAVE WORD` or press `Enter`.

### Study mode

- Click on the flashcard or press the spacebar to flip between English and Arabic.
- Use `Prev` / `Next` to navigate cards.
- Enable `Shuffle Deck` to randomize the order.
- Use `Restart Deck` to jump back to the first card.

## Project Structure

- `flashcard-app.html` — main HTML user interface.
- `style.css` — dark themed styling and layout.
- `main.js` — app logic, local storage, rendering, and flashcard behavior.

## Notes

- Data is stored in browser `localStorage` under the key `lexis_v3`.
- No server or build tools are required.
- Works best in modern browsers with JavaScript enabled.

## Documentation

For more details on app behavior and internal structure, see `docs/PROJECT_DOCUMENTATION.md`.
