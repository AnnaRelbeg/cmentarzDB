# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for **Cmentarz Dąbrówki Breńskie** (a parish cemetery in Poland), hosted at `https://www.cmentarzdabrowkibrenskie.pl`. It is a plain HTML/CSS/JS project with no build system or package manager — everything runs directly in the browser.

## No Build Process

There are no build steps, no `npm install`, no bundler, and no test suite. To develop locally, open the HTML files directly in a browser or use a simple local HTTP server (e.g., `python -m http.server` or VS Code Live Server).

## Architecture

The site consists of three pages sharing one stylesheet:

- **`index.html`** — Main page: search, gallery, "Zasłużeni" section, donations, contact. Contains inline Firebase module script that queries Firestore `zmarli` collection and renders search results as cards.
- **`profile.html`** — Individual person profile page, loaded via `?id=<personId>`. Fetches a single Firestore document from `zmarli` collection, renders photo gallery (Swiper.js), candle-lighting feature, memory/prayer submissions, and photo upload to Firebase Storage.
- **`admin.html`** — Password-gated admin panel (client-side only, plaintext password in source). Allows submitting new entries to `pending_submissions` Firestore collection and deleting entries from `zmarli` by ID.
- **`styles.css`** — All shared styles for all three pages.
- **`script.js`** — Legacy/partial mobile navbar logic (largely superseded by inline scripts).

## Firebase Backend

Firebase project: `cmentarz-dabrowki` (project ID). The Firebase config (apiKey, etc.) is embedded inline in each HTML file — this is intentional for a public-facing static site with Firestore security rules.

**Firestore collections:**
- `zmarli` — Main collection of deceased persons. Fields: `id`, `fullName`, `birthDate`, `deathDate`, `location` (grave number), `age`, `description`, `photoGallery` (array of URLs), `candles` (array of `{timestamp}`), `memories` (array of `{from, text, timestamp, reported}`)
- `pending_submissions` — New person submissions awaiting review. Fields: `fullName`, `birthDate`, `deathDate`, `graveNumber`, `description`, `photoURL`, `submittedAt`

**Firebase Storage:** Photos uploaded to `photos/{personId}/{timestamp}.jpg`. Pending photos go to `pending_photos/`.

## Caching Strategy

- **`index.html` search**: Uses `sessionStorage` to cache the full `zmarli` collection for 12 hours (`zmarli` + `zmarli_fetched` keys).
- **`profile.html`**: Uses `localStorage` to cache individual profile data for 12 hours (`profile_{id}` + `profile_{id}_timestamp` keys). Cache is cleared after candle, memory, or photo uploads before re-fetching.

## Key Dependencies (CDN only)

- Firebase v9.22.2 (compat + module versions used in same project)
- Swiper.js v11 (photo gallery on profile page)
- AOS (Animate on Scroll) v2.3.4 (index page animations)
- Google Fonts: Playfair Display + Open Sans

## Language

All UI text and content is in **Polish**. Variable names and code comments are in English.
