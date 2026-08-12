(() => {
  "use strict";

  const config = window.BIRTHDAY_CONFIG;
  if (!config) {
    console.error("BIRTHDAY_CONFIG was not found. Make sure config.js loads before app.js.");
    return;
  }

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const state = {
    opened: false,
    candlesOut: 0,
    confettiRunning: false,
    musicPlaying: false,
    toastTimer: null
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function text(template = "") {
    return String(template)
      .replaceAll("{name}", config.friendName || "Friend")
      .replaceAll("{nickname}", config.nickname || config.friendName || "Friend")
      .replaceAll("{sender}", config.senderName || "Your Friend");
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = text(value);
  }

  function applyTheme() {
    const theme = config.theme || {};
    const vars = {
      "--bg": theme.background,
      "--bg-alt": theme.backgroundAlt,
      "--text": theme.text,
      "--muted": theme.mutedText,
      "--primary": theme.primary,
      "--primary-dark": theme.primaryDark,
      "--secondary": theme.secondary,
      "--accent": theme.accent,
      "--mint": theme.mint,
      "--card": theme.card,
      "--shadow": theme.shadow
    };

    Object.entries(vars).forEach(([key, value]) => {
      if (value) document.documentElement.style.setProperty(key, value);
    });

    if (theme.background) {
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", theme.background);
    }
  }

  function setFavicon(emoji) {
    if (!emoji) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    document.head.appendChild(link);
  }

  function buildIntro() {
    document.title = text(config.pageTitle || "Birthday Surprise ✨");
    setFavicon(config.faviconEmoji || "🎂");
    setText("#intro-eyebrow", config.intro?.eyebrow || "a tiny surprise");
    setText("#gift-button-text", config.intro?.buttonText || "Open your surprise 🎁");

    const lines = $("#intro-lines");
    lines.innerHTML = "";
    (config.intro?.lines || []).forEach((line, index) => {
      const p = document.createElement("p");
      p.className = "intro-line";
      p.textContent = text(line);
      p.style.animationDelay = `${150 + index * 420}ms`;
      lines.appendChild(p);
    });
  }

  function buildHero() {
    setText("#hero-badge", config.hero?.badge || "birthday mode: on");
    setText("#hero-title", config.hero?.title || "Happy Birthday, {name}!");
    setText("#hero-subtitle", config.hero?.subtitle || "Hope today is a really good one.");
    setText("#hero-note", config.hero?.note || "You deserve a lovely day 💛");
    setText("#hero-scroll", config.hero?.scrollHint || "there's more ↓");
  }

  function buildMemories() {
    const section = $("#memories");
    const data = config.memories || {};
    if (data.enabled === false || !Array.isArray(data.items) || data.items.length === 0) {
      section.classList.add("is-section-hidden");
      return;
    }

    setText("#memories-eyebrow", data.eyebrow);
    setText("#memories-title", data.title);
    setText("#memories-subtitle", data.subtitle);

    const grid = $("#memory-grid");
    grid.innerHTML = "";

    data.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-card reveal";
      button.style.setProperty("--delay", `${Math.min(index * 80, 320)}ms`);
      button.setAttribute("aria-label", `Open memory: ${text(item.caption || `Memory ${index + 1}`)}`);

      const photoWrap = document.createElement("span");
      photoWrap.className = "memory-photo-wrap";

      const image = document.createElement("img");
      image.className = "memory-photo";
      image.src = item.image || "";
      image.alt = text(item.alt || item.caption || `Memory ${index + 1}`);
      image.loading = "lazy";

      const tape = document.createElement("span");
      tape.className = "memory-tape";
      tape.setAttribute("aria-hidden", "true");

      const caption = document.createElement("span");
      caption.className = "memory-caption";
      caption.textContent = text(item.caption || `Memory ${index + 1}`);

      const note = document.createElement("span");
      note.className = "memory-note";
      note.textContent = text(item.note || "");

      photoWrap.append(image, tape);
      button.append(photoWrap, caption, note);
      button.addEventListener("click", () => openMemory(item));
      grid.appendChild(button);
    });
  }

  function buildReasons() {
    const section = $("#reasons");
    const data = config.reasons || {};
    if (data.enabled === false || !Array.isArray(data.items) || data.items.length === 0) {
      section.classList.add("is-section-hidden");
      return;
    }

    setText("#reasons-eyebrow", data.eyebrow);
    setText("#reasons-title", data.title);
    setText("#reasons-subtitle", data.subtitle);

    const grid = $("#reasons-grid");
    grid.innerHTML = "";

    data.items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "reason-card reveal";
      article.style.setProperty("--delay", `${Math.min(index * 70, 280)}ms`);
      article.style.setProperty("--card-tilt", `${index % 2 ? 0.7 : -0.7}deg`);

      const emoji = document.createElement("div");
      emoji.className = "reason-emoji";
      emoji.textContent = item.emoji || "✨";
      emoji.setAttribute("aria-hidden", "true");

      const title = document.createElement("h3");
      title.textContent = text(item.title || "You're awesome");

      const body = document.createElement("p");
      body.textContent = text(item.text || "");

      article.append(emoji, title, body);
      grid.appendChild(article);
    });
  }

  function buildCake() {
    const section = $("#cake-section");
    const data = config.cake || {};
    if (data.enabled === false) {
      section.classList.add("is-section-hidden");
      return;
    }

    setText("#cake-eyebrow", data.eyebrow);
    setText("#cake-title", data.title);
    setText("#cake-subtitle", data.subtitle);
    setText("#wish-bubble", data.wishPrompt);
    setText("#blow-button", data.buttonText || "Blow out the candles 💨");

    const candleCount = Math.max(1, Math.min(Number(data.candleCount) || 5, 9));
    const candles = $("#candles");
    candles.innerHTML = "";

    for (let i = 0; i < candleCount; i += 1) {
      const candle = document.createElement("button");
      candle.type = "button";
      candle.className = "candle";
      candle.setAttribute("aria-label", `Blow out candle ${i + 1}`);
      candle.innerHTML = '<span class="flame" aria-hidden="true"></span>';
      candle.addEventListener("click", () => extinguishCandle(candle));
      candles.appendChild(candle);
    }

    $("#blow-button").addEventListener("click", extinguishAllCandles);
  }

  function buildFinalMessage() {
    const section = $("#final-message");
    const data = config.finalMessage || {};
    if (data.enabled === false) {
      section.classList.add("is-section-hidden");
      return;
    }

    setText("#final-eyebrow", data.eyebrow);
    setText("#final-title", data.title);
    setText("#final-signoff", data.signoff);
    setText("#final-signature", data.signature);

    const holder = $("#final-paragraphs");
    holder.innerHTML = "";
    (data.paragraphs || []).forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = text(paragraph);
      holder.appendChild(p);
    });
  }

  function buildFooter() {
    setText("#replay-button", config.footer?.replayText || "Replay the surprise ↻");
    setText("#footer-text", config.footer?.tinyText || "made with vanilla JavaScript");
  }

  function setupMusic() {
    const settings = config.music || {};
    const toggle = $("#music-toggle");
    const audio = $("#background-music");

    if (!settings.enabled || !settings.src) {
      toggle.classList.add("is-hidden");
      return;
    }

    audio.src = settings.src;
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, Number(settings.volume) || 0.45));
    $(".music-label", toggle).textContent = settings.label || "Music";
    toggle.classList.remove("is-hidden");

    toggle.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
          state.musicPlaying = true;
          toggle.setAttribute("aria-pressed", "true");
          toggle.setAttribute("aria-label", "Pause background music");
        } catch (error) {
          showToast("Your browser blocked audio. Try tapping the music button again 🎵");
        }
      } else {
        audio.pause();
        state.musicPlaying = false;
        toggle.setAttribute("aria-pressed", "false");
        toggle.setAttribute("aria-label", "Play background music");
      }
    });
  }

  async function tryStartMusicAfterOpen() {
    const settings = config.music || {};
    const audio = $("#background-music");
    const toggle = $("#music-toggle");
    if (!settings.enabled || !settings.startAfterGiftOpens || !settings.src) return;

    try {
      await audio.play();
      state.musicPlaying = true;
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Pause background music");
    } catch (_) {
      // Some browsers still block this; the visible music button remains available.
    }
  }

  function setupRevealObserver() {
    const nodes = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -5% 0px" });

    nodes.forEach((node) => observer.observe(node));
  }

  function openSurprise() {
    if (state.opened) return;
    state.opened = true;

    const button = $("#gift-button");
    const intro = $("#intro");
    const content = $("#site-content");

    button.classList.add("is-opening");
    button.disabled = true;
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.56, 90);

    window.setTimeout(() => {
      intro.classList.add("is-leaving");
      content.classList.add("is-open");
      content.setAttribute("aria-hidden", "false");
      document.body.classList.remove("is-locked");
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      $$(".hero-section .reveal").forEach((node) => node.classList.add("is-visible"));
      tryStartMusicAfterOpen();
    }, prefersReducedMotion ? 40 : 650);
  }

  function replaySurprise() {
    state.opened = false;
    state.candlesOut = 0;

    const intro = $("#intro");
    const content = $("#site-content");
    const gift = $("#gift-button");

    window.scrollTo({ top: 0, behavior: "auto" });
    content.classList.remove("is-open");
    content.setAttribute("aria-hidden", "true");
    intro.classList.remove("is-leaving");
    document.body.classList.add("is-locked");
    gift.classList.remove("is-opening");
    gift.disabled = false;

    $$(".candle").forEach((candle) => candle.classList.remove("is-out"));
    $("#blow-button").disabled = false;
    $("#wish-result").innerHTML = "";
    $("#wish-result").dataset.completed = "false";
  }

  function extinguishCandle(candle) {
    if (candle.classList.contains("is-out")) return;
    candle.classList.add("is-out");
    state.candlesOut += 1;

    if (state.candlesOut >= $$(".candle").length) {
      completeWish();
    }
  }

  function extinguishAllCandles() {
    const lit = $$(".candle:not(.is-out)");
    if (lit.length === 0) return;

    lit.forEach((candle, index) => {
      window.setTimeout(() => extinguishCandle(candle), prefersReducedMotion ? 0 : index * 110);
    });
  }

  function completeWish() {
    const result = $("#wish-result");
    if (result.dataset.completed === "true") return;
    result.dataset.completed = "true";

    const title = document.createElement("h3");
    title.textContent = text(config.cake?.successTitle || "WISH SENT ✨");
    const paragraph = document.createElement("p");
    paragraph.textContent = text(config.cake?.successText || "The universe has been notified.");
    result.append(title, paragraph);
    $("#blow-button").disabled = true;

    if (!prefersReducedMotion) {
      burstConfetti(window.innerWidth * 0.5, window.innerHeight * 0.48, Number(config.effects?.confettiPieces) || 170);
      window.setTimeout(() => burstConfetti(window.innerWidth * 0.26, window.innerHeight * 0.44, 85), 250);
      window.setTimeout(() => burstConfetti(window.innerWidth * 0.74, window.innerHeight * 0.44, 85), 430);
    } else {
      burstConfetti(window.innerWidth * 0.5, window.innerHeight * 0.48, 45);
    }
  }

  function openMemory(item) {
    const dialog = $("#memory-dialog");
    $("#dialog-image").src = item.image || "";
    $("#dialog-image").alt = text(item.alt || item.caption || "Memory photo");
    $("#dialog-title").textContent = text(item.caption || "Memory");
    $("#dialog-note").textContent = text(item.note || "");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  function closeMemory() {
    const dialog = $("#memory-dialog");
    if (dialog.open) dialog.close();
  }

  function setupDoodles() {
    const effects = config.effects || {};
    if (effects.floatingDoodles === false) return;

    const layer = $("#doodle-layer");
    const decorativeSymbols = ["✦", "♡", "✿", "☆", "☁", "✧", "❀", "⋆"];
    const secretMessages = config.easterEggs?.enabled ? (config.easterEggs.messages || []) : [];
    const count = window.innerWidth < 650 ? 8 : 14;

    for (let i = 0; i < count; i += 1) {
      const isInteractive = secretMessages.length > 0 && i % 4 === 1;
      const node = document.createElement(isInteractive ? "button" : "span");
      node.className = `doodle${isInteractive ? " is-interactive" : ""}`;
      node.textContent = decorativeSymbols[i % decorativeSymbols.length];
      node.style.left = `${4 + ((i * 31) % 91)}%`;
      node.style.top = `${4 + ((i * 47) % 88)}%`;
      node.style.setProperty("--float-time", `${5 + (i % 5) * 1.25}s`);
      node.style.animationDelay = `${-(i % 6) * 0.8}s`;

      if (isInteractive) {
        node.type = "button";
        node.setAttribute("aria-label", config.easterEggs?.label || "Open a tiny secret");
        const message = secretMessages[i % secretMessages.length];
        node.addEventListener("click", () => {
          showToast(text(message));
          burstConfetti(node.getBoundingClientRect().left, node.getBoundingClientRect().top, 18);
        });
      }

      layer.appendChild(node);
    }
  }

  function setupCursorGlow() {
    if (config.effects?.cursorGlow === false || window.matchMedia("(hover: none)").matches) return;
    const glow = $(".cursor-glow");
    window.addEventListener("pointermove", (event) => {
      glow.style.transform = `translate(${event.clientX - 120}px, ${event.clientY - 120}px)`;
      glow.classList.add("is-active");
    }, { passive: true });
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3300);
  }

  function setupConfettiCanvas() {
    const canvas = $("#confetti-canvas");
    const ctx = canvas.getContext("2d");
    const pieces = [];
    const palette = [
      config.theme?.primary || "#ff7fa8",
      config.theme?.secondary || "#9b8cff",
      config.theme?.accent || "#ffd166",
      config.theme?.mint || "#9be7c4",
      "#ffffff"
    ];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createPiece(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        gravity: 0.17 + Math.random() * 0.08,
        drag: 0.992,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.28,
        width: 5 + Math.random() * 7,
        height: 3 + Math.random() * 5,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 0,
        maxLife: 95 + Math.random() * 65,
        shape: Math.random() > 0.8 ? "circle" : "rect"
      };
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = pieces.length - 1; i >= 0; i -= 1) {
        const p = pieces[i];
        p.life += 1;
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.width * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();

        if (p.life >= p.maxLife || p.y > window.innerHeight + 50) {
          pieces.splice(i, 1);
        }
      }

      if (pieces.length > 0) {
        requestAnimationFrame(animate);
      } else {
        state.confettiRunning = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }

    window.burstConfetti = (x, y, count = 100) => {
      const total = Math.max(1, Math.min(Number(count) || 100, 420));
      for (let i = 0; i < total; i += 1) pieces.push(createPiece(x, y));
      if (!state.confettiRunning) {
        state.confettiRunning = true;
        requestAnimationFrame(animate);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
  }

  function setupDialog() {
    $("#dialog-close").addEventListener("click", closeMemory);
    $("#memory-dialog").addEventListener("click", (event) => {
      const dialog = event.currentTarget;
      const rect = dialog.getBoundingClientRect();
      const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (clickedOutside) dialog.close();
    });
  }

  function resetWishState() {
    state.candlesOut = 0;
    $("#wish-result").dataset.completed = "false";
  }

  function init() {
    applyTheme();
    setupConfettiCanvas();
    buildIntro();
    buildHero();
    buildMemories();
    buildReasons();
    resetWishState();
    buildCake();
    buildFinalMessage();
    buildFooter();
    setupMusic();
    setupDoodles();
    setupCursorGlow();
    setupDialog();
    setupRevealObserver();

    $("#gift-button").addEventListener("click", openSurprise);
    $("#replay-button").addEventListener("click", replaySurprise);

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMemory();
    });
  }

  // Expose only the confetti function through setupConfettiCanvas; everything else stays scoped.
  let burstConfetti = (...args) => window.burstConfetti?.(...args);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
