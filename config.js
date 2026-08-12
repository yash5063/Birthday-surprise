/**
 * Birthday site configuration
 * ------------------------------------------------------------
 * Edit this file for almost every personalization change.
 * No build step is required. Keep the variable name `BIRTHDAY_CONFIG`.
 */
window.BIRTHDAY_CONFIG = {
  // Browser/tab settings
  pageTitle: "A tiny birthday surprise for Julia ✨",
  faviconEmoji: "🎂",

  // Main person / sender
  friendName: "Julia",
  nickname: "Mimi",
  senderName: "Your Friend",

  // Opening screen
  intro: {
    eyebrow: "psst... I made you something",
    lines: [
      "Hey {name} 👀",
      "I know today is supposed to be about cake...",
      "but I brought a tiny internet-sized surprise too ✨"
    ],
    buttonText: "Open your surprise 🎁"
  },

  // Hero section after opening the gift
  hero: {
    badge: "official birthday person of the day",
    title: "Happy Birthday, {name}!",
    subtitle: "May your day be soft, silly, sparkly, and full of the people who make you feel at home.",
    note: "You deserve a ridiculous amount of happiness today 💛",
    scrollHint: "there's more ↓"
  },

  // Optional background music. Put a local file in assets/music/ and update src.
  // Browsers do not allow autoplay before user interaction, so music starts only after a click.
  music: {
    enabled: false,
    src: "assets/music/birthday-song.mp3",
    label: "Birthday song",
    startAfterGiftOpens: false,
    volume: 0.45
  },

  // Memory cards. Use local paths or normal https image URLs.
  memories: {
    enabled: true,
    eyebrow: "tiny time machine",
    title: "A few favorite moments 📸",
    subtitle: "Replace these demo cards with your own photos in assets/photos/.",
    items: [
      {
        image: "assets/photos/memory-1.svg",
        alt: "Pastel placeholder for a friendship memory",
        caption: "That one day we laughed way too much",
        note: "10/10 chaos. Would absolutely repeat."
      },
      {
        image: "assets/photos/memory-2.svg",
        alt: "Pastel placeholder for a friendship memory",
        caption: "Main-character energy",
        note: "No context needed. You know exactly why this is here 😭"
      },
      {
        image: "assets/photos/memory-3.svg",
        alt: "Pastel placeholder for a friendship memory",
        caption: "A very normal photo (probably)",
        note: "Some memories get funnier every time you remember them."
      },
      {
        image: "assets/photos/memory-4.svg",
        alt: "Pastel placeholder for a friendship memory",
        caption: "One for the friendship archive",
        note: "Keeping this forever, obviously."
      }
    ]
  },

  // Things you appreciate about your friend
  reasons: {
    enabled: true,
    eyebrow: "scientifically verified facts",
    title: "Reasons you're pretty awesome ⭐",
    subtitle: "A completely unbiased list compiled by me.",
    items: [
      { emoji: "☀️", title: "You make things lighter", text: "Even normal days somehow feel more fun when you're around." },
      { emoji: "😂", title: "Elite humor department", text: "Half our conversations would make absolutely no sense to anyone else." },
      { emoji: "🫶", title: "You actually care", text: "You remember the small things, and that matters more than you realize." },
      { emoji: "✨", title: "You are very you", text: "Please keep that. The world already has enough copies of everyone else." },
      { emoji: "🌷", title: "Soft heart, strong human", text: "You handle more than people notice and still find ways to be kind." },
      { emoji: "🎉", title: "Certified good company", text: "From serious talks to nonsense at 2 AM: always a solid experience." }
    ]
  },

  // Small interactive stars floating around the page.
  easterEggs: {
    enabled: true,
    label: "Tap the tiny stars",
    messages: [
      "Reminder: hydrate between cake slices 💧",
      "You found a secret! +1 birthday luck ✨",
      "Friendship achievement unlocked 🏆",
      "Today you are legally allowed to be extra 🎀",
      "Tiny message: I'm glad you exist 🌼",
      "Emergency compliment: your vibe is immaculate 💫"
    ]
  },

  // Interactive cake section
  cake: {
    enabled: true,
    eyebrow: "important birthday business",
    title: "Okay, make a wish 🎂",
    subtitle: "Tap each candle or use the button. No actual fire hazard involved.",
    candleCount: 5,
    wishPrompt: "Think of something good...",
    buttonText: "Blow out the candles 💨",
    successTitle: "WISH SENT ✨",
    successText: "I can't guarantee the universe got the memo, but the confetti department definitely did."
  },

  // Final letter/message
  finalMessage: {
    enabled: true,
    eyebrow: "one last thing",
    title: "A little note for you 💌",
    paragraphs: [
      "Happy birthday, {nickname}. I hope this year gives you more calm days, more ridiculous laughs, more unexpected good news, and a lot of moments that make you think, ‘yeah, life is actually pretty nice sometimes.’",
      "Thank you for being someone I can laugh with, annoy, send random things to, and still count on when it matters.",
      "Keep being wonderfully, unmistakably you. I'm very lucky our paths crossed."
    ],
    signoff: "Happy Birthday again, {name} 💛",
    signature: "— {sender}"
  },

  // Footer / replay
  footer: {
    replayText: "Replay the surprise ↻",
    tinyText: "made with friendship, questionable jokes & vanilla JavaScript"
  },

  // Theme: accepts normal CSS color values.
  theme: {
    background: "#fffaf3",
    backgroundAlt: "#fff2f7",
    text: "#3c3340",
    mutedText: "#766b79",
    primary: "#ff7fa8",
    primaryDark: "#e95f8d",
    secondary: "#9b8cff",
    accent: "#ffd166",
    mint: "#9be7c4",
    card: "rgba(255, 255, 255, 0.78)",
    shadow: "rgba(85, 61, 92, 0.14)"
  },

  // Decorative settings
  effects: {
    confettiPieces: 170,
    floatingDoodles: true,
    cursorGlow: true,
    reducedMotionFriendly: true
  }
};
