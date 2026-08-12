# Cute Birthday Friend Website — Vanilla HTML/CSS/JS

A reusable, config-driven birthday surprise page with **no framework, no build step, and no required dependencies**.

## Features

- Animated intro and gift reveal
- Cute responsive birthday hero
- Polaroid-style memory gallery with full-screen photo dialog
- Configurable “reasons you're awesome” cards
- Interactive cake and individually clickable candles
- Canvas confetti effect written in vanilla JavaScript
- Tiny clickable easter-egg stars
- Optional background music
- Final birthday letter
- Replay button
- Mobile-friendly and reduced-motion friendly
- Theme colors and almost all content controlled by `config.js`

## Fast customization

Open `config.js`. Most of the project can be personalized there:

- `friendName`, `nickname`, `senderName`
- intro text
- birthday hero text
- memories/photos/captions
- reasons cards
- secret star messages
- cake text and candle count
- final message
- colors/theme
- music settings

Place your photos in:

```text
assets/photos/
```

Then set each memory image path in `config.js`, for example:

```js
image: "assets/photos/beach-day.jpg"
```

## Add music

1. Put an MP3 file in `assets/music/`, for example `birthday-song.mp3`.
2. In `config.js`, change:

```js
music: {
  enabled: true,
  src: "assets/music/birthday-song.mp3",
  label: "Our song",
  startAfterGiftOpens: true,
  volume: 0.45
}
```

Browsers require a user gesture before audio can play. Clicking the gift counts as a gesture on many browsers, and the floating music button is always available when music is enabled.

## Run locally

Because this is a static site, you can simply open `index.html` in a browser. A local server is better for testing:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

You can deploy the folder as-is on any static host:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

No npm, Node.js, React, bundler, or framework is required.

## File structure

```text
birthday-friend-cute/
├── index.html
├── styles.css
├── config.js
├── app.js
├── README.md
└── assets/
    ├── photos/
    │   ├── memory-1.svg
    │   ├── memory-2.svg
    │   ├── memory-3.svg
    │   └── memory-4.svg
    └── music/
        └── PUT_YOUR_SONG_HERE.txt
```

## Notes

- The included memory images are local SVG placeholders, so the demo works immediately and offline.
- There are **zero external JavaScript libraries**. GSAP is not needed for this version.
- If you later want heavier cinematic timeline animation, you can add GSAP without changing the overall config-driven structure.
