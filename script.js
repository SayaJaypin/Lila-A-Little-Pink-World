"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  timezone: "Europe/Paris",
  birthdayMonth: 7,
  birthdayDay: 27,
  photos: [
    "assets/photo-1.jpg",
    "assets/photo-2.jpg",
    "assets/photo-3.jpg",
    "assets/photo-4.jpg",
    "assets/photo-5.jpg"
  ],
  cities: [
    "Paris",
    "Lyon",
    "Marseille",
    "Nice",
    "Toulouse",
    "Bordeaux",
    "Lille",
    "Strasbourg"
  ]
};

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

function pad(number) {
  return String(number).padStart(2, "0");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createElement(tag, className, parent) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (parent) {
    parent.appendChild(element);
  }

  return element;
}

/* =========================================================
   DOGGY FACTORY
========================================================= */

function createDoggy(container, options = {}) {
  if (!container) return null;

  container.innerHTML = "";

  const dog = createElement("div", "doggy", container);

  const leftEar = createElement("div", "dog-ear left", dog);
  const rightEar = createElement("div", "dog-ear right", dog);

  const body = createElement("div", "dog-body", dog);

  createElement("div", "dog-leg left", dog);
  createElement("div", "dog-leg right", dog);

  createElement("div", "dog-tail", dog);

  const head = createElement("div", "dog-head", dog);

  createElement("div", "dog-eye left", head);
  createElement("div", "dog-eye right", head);

  createElement("div", "dog-muzzle", head);
  createElement("div", "dog-nose", head);
  createElement("div", "dog-mouth", head);

  createElement("div", "dog-collar", dog);
  createElement("div", "dog-tag", dog);

  if (options.hat !== false) {
    createElement("div", "dog-hat", dog);
  }

  if (options.heart !== false) {
    createElement("div", "dog-heart", dog);
  }

  return dog;
}

const dogs = {};

function setupDogs() {
  const dogTargets = {
    intro: $("#introDogStage"),
    hero: $("#heroDog"),
    story: $("#storyDog"),
    cake: $("#cakeDog"),
    wish: $("#wishDog"),
    love: $("#loveDog"),
    surprise: $("#surpriseDog"),
    final: $("#finalDog"),
    secret: $("#secretDog")
  };

  Object.entries(dogTargets).forEach(([key, target]) => {
    if (target) {
      dogs[key] = createDoggy(target, {
        hat: ["intro", "cake", "surprise"].includes(key),
        heart: true
      });
    }
  });
}

/* =========================================================
   DOGGY SPEECH
========================================================= */

const dogDialogues = {
  intro: [
    "bonjour, lila.",
    "j'ai préparé quelque chose pour toi.",
    "viens, j'ai encore quelque chose à te montrer."
  ],

  hero: [
    "bienvenue dans ton petit monde rose.",
    "tout ceci est pour toi.",
    "on commence le voyage ?"
  ],

  story: [
    "some stories deserve to be remembered.",
    "les petits moments peuvent devenir immenses.",
    "continue, lila..."
  ],

  memory: [
    "regarde bien...",
    "cette photo mérite un petit moment.",
    "encore une ?"
  ],

  letter: [
    "j'ai une lettre pour toi.",
    "elle vient directement du coeur.",
    "ouvre-la doucement..."
  ],

  cake: [
    "quelque chose de sucré arrive.",
    "ferme les yeux.",
    "fais un voeu..."
  ],

  wish: [
    "écris ton petit secret.",
    "les étoiles savent garder les voeux.",
    "fais confiance à ton souhait."
  ],

  final: [
    "à bientôt, lila.",
    "n'oublie jamais à quel point tu es précieuse."
  ]
};

let dialogueIndex = {};

function setupDogInteractions() {
  const interactionMap = [
    {
      key: "hero",
      element: $("#heroDog"),
      speech: null
    },
    {
      key: "story",
      element: $("#storyDog"),
      speech: $("#storySpeech")
    }
  ];

  interactionMap.forEach(({ key, element, speech }) => {
    if (!element) return;

    element.style.cursor = "pointer";

    element.addEventListener("click", () => {
      interactWithDog(key, element, speech);
    });
  });

  const allClickableDogs = [
    "cake",
    "wish",
    "love",
    "surprise",
    "final"
  ];

  allClickableDogs.forEach((key) => {
    const container = document.getElementById(`${key}Dog`);

    if (!container) return;

    container.style.cursor = "pointer";

    container.addEventListener("click", () => {
      interactWithDog(key, container);
    });
  });
}

function interactWithDog(key, container, speech = null) {
  const dog = container.querySelector(".doggy");

  if (!dog) return;

  if (!dialogueIndex[key]) {
    dialogueIndex[key] = 0;
  }

  const list = dogDialogues[key] || dogDialogues.hero;

  const text = list[dialogueIndex[key] % list.length];

  dialogueIndex[key]++;

  dog.classList.remove(
    "dog-happy",
    "dog-surprised",
    "dog-celebrate"
  );

  void dog.offsetWidth;

  dog.classList.add("dog-happy");

  if (speech) {
    speech.textContent = text;
    speech.animate(
      [
        {
          opacity: 0,
          transform: "translateY(10px) scale(.9)"
        },
        {
          opacity: 1,
          transform: "translateY(0) scale(1)"
        }
      ],
      {
        duration: 450,
        easing: "cubic-bezier(.22,1,.36,1)"
      }
    );
  } else {
    showToast(text);
  }

  createHeartBurst(
    container.getBoundingClientRect().left +
      container.getBoundingClientRect().width / 2,
    container.getBoundingClientRect().top +
      container.getBoundingClientRect().height / 2
  );
}

/* =========================================================
   INTRO
========================================================= */

const intro = $("#intro");
const app = $("#app");
const startExperience = $("#startExperience");

function setupIntro() {
  const introSpeech = $("#introSpeech");

  setTimeout(() => {
    introSpeech.innerHTML =
      "<span>j'ai préparé quelque chose pour toi.</span>";
  }, 2200);

  startExperience.addEventListener("click", startJourney);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      !intro.classList.contains("hide")
    ) {
      startJourney();
    }
  });
}

function startJourney() {
  intro.classList.add("hide");
  app.classList.remove("hidden");

  document.body.classList.add("experience-started");

  startMusic();

  setTimeout(() => {
    setupRevealObserver();
  }, 200);

  showToast("bienvenue dans le petit monde de Lila.");
}

/* =========================================================
   MUSIC
========================================================= */

const music = $("#music");
const musicToggle = $("#musicToggle");
const musicPlayer = $("#musicPlayer");
const musicProgress = $("#musicProgress");
const currentTime = $("#currentTime");
const duration = $("#duration");
const volumeBtn = $("#volumeBtn");
const miniPlayer = $("#miniPlayer");

let musicStarted = false;

function startMusic() {
  if (!music) return;

  music.volume = 0.55;

  const promise = music.play();

  if (promise && typeof promise.catch === "function") {
    promise
      .then(() => {
        musicStarted = true;
        musicPlayer.classList.add("playing");
      })
      .catch(() => {
        musicStarted = false;
      });
  }
}

function toggleMusic() {
  if (!music) return;

  if (music.paused) {
    music.play()
      .then(() => {
        musicStarted = true;
        musicPlayer.classList.add("playing");
      })
      .catch(() => {
        showToast("appuie à nouveau pour démarrer la musique.");
      });
  } else {
    music.pause();
    musicPlayer.classList.remove("playing");
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${pad(secs)}`;
}

function setupMusic() {
  musicToggle.addEventListener("click", toggleMusic);

  music.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(music.duration);
  });

  music.addEventListener("timeupdate", () => {
    if (!music.duration) return;

    const percent =
      (music.currentTime / music.duration) * 100;

    musicProgress.value = percent;

    currentTime.textContent =
      formatTime(music.currentTime);
  });

  musicProgress.addEventListener("input", () => {
    if (!music.duration) return;

    music.currentTime =
      (Number(musicProgress.value) / 100) *
      music.duration;
  });

  music.addEventListener("play", () => {
    musicPlayer.classList.add("playing");
  });

  music.addEventListener("pause", () => {
    musicPlayer.classList.remove("playing");
  });

  volumeBtn.addEventListener("click", () => {
    music.muted = !music.muted;
    volumeBtn.classList.toggle("muted", music.muted);
  });

  miniPlayer.addEventListener("click", () => {
    musicPlayer.classList.toggle("minimized");
  });
}

/* =========================================================
   FRANCE TIME
========================================================= */

const franceTime = $("#franceTime");
const franceDate = $("#franceDate");
const franceOffset = $("#franceOffset");

function getFranceParts() {
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat(
    "fr-FR",
    {
      timeZone: CONFIG.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }
  );

  const dateFormatter = new Intl.DateTimeFormat(
    "fr-FR",
    {
      timeZone: CONFIG.timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

  const zoneFormatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: CONFIG.timezone,
      timeZoneName: "longOffset"
    }
  );

  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now),
    zone: zoneFormatter.formatToParts(now)
      .find((part) => part.type === "timeZoneName")
      ?.value || "GMT"
  };
}

function updateFranceClock() {
  const parts = getFranceParts();

  franceTime.textContent = parts.time;
  franceDate.textContent = capitalize(parts.date);
  franceOffset.textContent =
    parts.zone.replace("GMT", "UTC");
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* =========================================================
   CITY CLOCKS
========================================================= */

function setupCities() {
  const grid = $("#citiesGrid");

  CONFIG.cities.forEach((city) => {
    const card = createElement("div", "city", grid);

    const name = createElement(
      "span",
      "city-name",
      card
    );

    const time = createElement(
      "strong",
      "city-time",
      card
    );

    name.textContent = city;
    time.dataset.city = city;
  });
}

function updateCities() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat(
    "fr-FR",
    {
      timeZone: CONFIG.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }
  );

  const value = formatter.format(now);

  $$(".city-time").forEach((element) => {
    element.textContent = value;
  });
}

/* =========================================================
   COUNTDOWN
========================================================= */

function getNextBirthday() {
  const now = new Date();

  const parisNowParts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: CONFIG.timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric"
    }
  ).formatToParts(now);

  const year = Number(
    parisNowParts.find(
      (part) => part.type === "year"
    ).value
  );

  let target = new Date(
    Date.UTC(
      year,
      CONFIG.birthdayMonth,
      CONFIG.birthdayDay,
      0,
      0,
      0
    )
  );

  /*
    The target is interpreted using Paris local time.
    Using a DateTimeFormat-based comparison avoids
    relying on the user's device timezone.
  */

  const parisDate = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: CONFIG.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(now);

  const targetDateString =
    `${year}-${pad(CONFIG.birthdayMonth + 1)}-${pad(CONFIG.birthdayDay)}`;

  if (parisDate > targetDateString) {
    target = new Date(
      Date.UTC(
        year + 1,
        CONFIG.birthdayMonth,
        CONFIG.birthdayDay,
        0,
        0,
        0
      )
    );
  }

  return target;
}

function getParisNowAsComparableDate() {
  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: CONFIG.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }
  ).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
  );
}

function updateCountdown() {
  const now = getParisNowAsComparableDate();
  const target = getNextBirthday();

  let difference = target.getTime() - now.getTime();

  if (difference < 0) {
    difference = 0;
  }

  const seconds = Math.floor(difference / 1000);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(
    (seconds % 86400) / 3600
  );
  const minutes = Math.floor(
    (seconds % 3600) / 60
  );
  const secs = seconds % 60;

  $("#countDays").textContent = pad(days);
  $("#countHours").textContent = pad(hours);
  $("#countMinutes").textContent = pad(minutes);
  $("#countSeconds").textContent = pad(secs);
}

/* =========================================================
   REVEAL OBSERVER
========================================================= */

let revealObserver;

function setupRevealObserver() {
  const elements = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: .12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
  const navLinks = $$(".nav-link");
  const mobileMenu = $("#mobileMenu");
  const menuToggle = $("#menuToggle");

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  $$(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) =>
        item.classList.remove("active")
      );

      link.classList.add("active");
    });
  });
}

function setupSectionTracking() {
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");
  const dots = $$(".journey-dot");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });

        dots.forEach((dot) => {
          dot.classList.toggle(
            "active",
            dot.dataset.section === id
          );
        });
      });
    },
    {
      threshold: .35
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const section = document.getElementById(
        dot.dataset.section
      );

      if (section) {
        section.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/* =========================================================
   JOURNEY PROGRESS
========================================================= */

function updateJourneyProgress() {
  const documentHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const scroll =
    document.documentElement.scrollTop ||
    document.body.scrollTop;

  const percent =
    documentHeight > 0
      ? (scroll / documentHeight) * 100
      : 0;

  const safePercent = clamp(percent, 0, 100);

  $("#journeyFill").style.height =
    `${safePercent}%`;

  $("#journeyPercent").textContent =
    `${Math.round(safePercent)}%`;
}

/* =========================================================
   MEMORY LIGHTBOX
========================================================= */

let currentPhoto = 0;

function setupLightbox() {
  const lightbox = $("#lightbox");
  const image = $("#lightboxImage");

  $$(".memory-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentPhoto =
        Number(card.dataset.photo) || 0;

      openLightbox();
    });
  });

  $("#lightboxClose").addEventListener(
    "click",
    closeLightbox
  );

  $("#lightboxPrev").addEventListener(
    "click",
    () => {
      currentPhoto =
        (currentPhoto - 1 + CONFIG.photos.length) %
        CONFIG.photos.length;

      updateLightbox();
    }
  );

  $("#lightboxNext").addEventListener(
    "click",
    () => {
      currentPhoto =
        (currentPhoto + 1) %
        CONFIG.photos.length;

      updateLightbox();
    }
  );

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      currentPhoto =
        (currentPhoto + 1) %
        CONFIG.photos.length;

      updateLightbox();
    }

    if (event.key === "ArrowLeft") {
      currentPhoto =
        (currentPhoto - 1 + CONFIG.photos.length) %
        CONFIG.photos.length;

      updateLightbox();
    }
  });

  function openLightbox() {
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    updateLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function updateLightbox() {
    image.src = CONFIG.photos[currentPhoto];
    image.alt = `Memory ${currentPhoto + 1}`;

    $("#lightboxCurrent").textContent =
      pad(currentPhoto + 1);
  }
}

/* =========================================================
   LETTER
========================================================= */

function setupLetter() {
  const openButton = $("#openLetter");
  const envelope = $("#envelope");
  const letterPaper = $("#letterPaper");
  const envelopeArea = $("#envelopeArea");

  openButton.addEventListener("click", () => {
    envelope.classList.add("open");

    setTimeout(() => {
      envelopeArea.classList.add("hidden");
      letterPaper.classList.remove("hidden");

      requestAnimationFrame(() => {
        letterPaper.classList.add("revealed");
      });

      letterPaper.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      showToast("ta lettre est ouverte.");
    }, 950);
  });
}

/* =========================================================
   CANDLE
========================================================= */

let candleBlown = false;

function setupCandle() {
  const blowButton = $("#blowCandle");
  const resetButton = $("#resetCandle");
  const cake = $(".cake");
  const status = $("#candleStatus");

  blowButton.addEventListener("click", blowCandle);

  resetButton.addEventListener("click", () => {
    candleBlown = false;
    cake.classList.remove("blown");

    const dog = dogs.cake;

    if (dog) {
      dog.classList.remove(
        "dog-celebrate",
        "dog-surprised"
      );
    }

    status.textContent =
      "imagine ton voeu...";

    blowButton.disabled = false;
  });
}

function blowCandle() {
  if (candleBlown) return;

  candleBlown = true;

  const cake = $(".cake");
  const status = $("#candleStatus");

  cake.classList.add("blown");

  status.textContent =
    "le voeu est parti parmi les étoiles.";

  if (dogs.cake) {
    dogs.cake.classList.remove("dog-surprised");
    dogs.cake.classList.add("dog-celebrate");
  }

  createConfetti(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  createHeartBurst(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  showToast("le voeu est maintenant quelque part dans les étoiles.");

  setTimeout(() => {
    const wish = document.getElementById("wish");

    wish.scrollIntoView({
      behavior: "smooth"
    });
  }, 1300);
}

/* =========================================================
   WISH
========================================================= */

function setupWish() {
  const form = $("#wishForm");
  const input = $("#wishInput");
  const result = $("#wishResult");
  const text = $("#wishText");
  const newWish = $("#newWish");

  $("#makeWish").addEventListener("click", () => {
    const value = input.value.trim();

    if (!value) {
      showToast("écris d'abord ton petit voeu.");
      input.focus();
      return;
    }

    localStorage.setItem(
      "lila-birthday-wish",
      value
    );

    text.textContent = value;

    form.classList.add("hidden");
    result.classList.remove("hidden");

    createStarBurst(
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    if (dogs.wish) {
      dogs.wish.classList.add("dog-happy");
    }
  });

  newWish.addEventListener("click", () => {
    form.classList.remove("hidden");
    result.classList.add("hidden");
    input.value = "";
    input.focus();
  });
}

/* =========================================================
   3D HEART
========================================================= */

function setup3DHeart() {
  const heart = $("#heart3d");

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  let rotateX = -8;
  let rotateY = 0;

  function render() {
    heart.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  heart.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;

    heart.setPointerCapture(event.pointerId);
  });

  heart.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    rotateY += dx * .65;
    rotateX -= dy * .65;

    rotateX = clamp(rotateX, -55, 55);

    lastX = event.clientX;
    lastY = event.clientY;

    render();
  });

  heart.addEventListener("pointerup", () => {
    dragging = false;
  });

  heart.addEventListener("pointercancel", () => {
    dragging = false;
  });

  let automaticRotation = 0;

  function autoRotate() {
    if (!dragging) {
      automaticRotation += .12;
      heart.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY + automaticRotation}deg)`;
    }

    requestAnimationFrame(autoRotate);
  }

  autoRotate();

  createHeartOrbitParticles();
}

function createHeartOrbitParticles() {
  const container = $("#heartParticles");

  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = createElement(
      "div",
      "ambient-particle",
      container
    );

    particle.style.left =
      `${random(20,80)}%`;

    particle.style.top =
      `${random(20,80)}%`;

    particle.style.animationDuration =
      `${random(4,8)}s`;

    particle.style.animationDelay =
      `${random(-8,0)}s`;
  }
}

/* =========================================================
   GIFT BOX
========================================================= */

function setupGift() {
  const gift = $("#giftBox");
  const message = $("#surpriseMessage");

  gift.addEventListener("click", () => {
    if (gift.classList.contains("open")) return;

    gift.classList.add("open");

    createGiftParticles(gift);

    setTimeout(() => {
      message.classList.remove("hidden");

      message.animate(
        [
          {
            opacity: 0,
            transform: "translateY(30px) scale(.95)"
          },
          {
            opacity: 1,
            transform: "translateY(0) scale(1)"
          }
        ],
        {
          duration: 700,
          easing: "cubic-bezier(.22,1,.36,1)"
        }
      );

      if (dogs.surprise) {
        dogs.surprise.classList.add("dog-celebrate");
      }

      showToast("tu as trouvé la surprise.");
    }, 750);
  });
}

function createGiftParticles(parent) {
  const parentRect = parent.getBoundingClientRect();

  for (let i = 0; i < 28; i++) {
    const particle = createElement(
      "div",
      "gift-particle",
      document.body
    );

    const startX =
      parentRect.left +
      parentRect.width / 2;

    const startY =
      parentRect.top +
      parentRect.height / 2;

    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    particle.style.setProperty(
      "--x",
      `${random(-180,180)}px`
    );

    particle.style.setProperty(
      "--y",
      `${random(-220,40)}px`
    );

    setTimeout(() => {
      particle.remove();
    }, 1700);
  }
}

/* =========================================================
   SECRET PAW
========================================================= */

function setupSecret() {
  const paw = $("#secretPaw");
  const modal = $("#secretModal");

  paw.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    if (dogs.secret) {
      dogs.secret.classList.add("dog-happy");
    }
  });

  $("#secretClose").addEventListener(
    "click",
    closeSecret
  );

  $(".secret-overlay").addEventListener(
    "click",
    closeSecret
  );

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("open")
    ) {
      closeSecret();
    }
  });

  function closeSecret() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

/* =========================================================
   CLICK BACKGROUND HEARTS
========================================================= */

function setupBackgroundInteraction() {
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest(".music-player") ||
      target.closest(".lightbox") ||
      target.closest(".secret-modal")
    ) {
      return;
    }

    createHeartBurst(
      event.clientX,
      event.clientY,
      2
    );
  });
}

function createHeartBurst(x, y, count = 5) {
  for (let i = 0; i < count; i++) {
    const heart = createElement(
      "div",
      "heart-particle",
      document.body
    );

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    heart.style.setProperty(
      "--x",
      `${random(-90,90)}px`
    );

    heart.style.setProperty(
      "--y",
      `${random(-120,-20)}px`
    );

    setTimeout(() => {
      heart.remove();
    }, 2600);
  }
}

function createConfetti(x, y) {
  const shapes = [
    "circle",
    "circle",
    "square",
    "square"
  ];

  for (let i = 0; i < 50; i++) {
    const particle = createElement(
      "div",
      "confetti-particle",
      document.body
    );

    const size = random(5,10);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    particle.style.borderRadius =
      shapes[Math.floor(Math.random() * shapes.length)] ===
      "circle"
        ? "50%"
        : "2px";

    particle.style.background =
      i % 3 === 0
        ? "#db6f91"
        : i % 3 === 1
          ? "#f4a8bf"
          : "#d5c5ed";

    const dx = random(-400,400);
    const dy = random(-400,150);
    const rotation = random(-720,720);

    particle.animate(
      [
        {
          opacity: 1,
          transform: "translate(0,0) rotate(0)"
        },
        {
          opacity: 0,
          transform:
            `translate(${dx}px,${dy}px) rotate(${rotation}deg)`
        }
      ],
      {
        duration: random(1000,1800),
        easing: "cubic-bezier(.2,.8,.3,1)"
      }
    );

    setTimeout(() => {
      particle.remove();
    }, 1900);
  }
}

function createStarBurst(x, y) {
  for (let i = 0; i < 35; i++) {
    const star = createElement(
      "div",
      "gift-particle",
      document.body
    );

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    star.style.setProperty(
      "--x",
      `${random(-350,350)}px`
    );

    star.style.setProperty(
      "--y",
      `${random(-350,350)}px`
    );

    star.style.width = `${random(3,7)}px`;
    star.style.height = star.style.width;

    setTimeout(() => {
      star.remove();
    }, 1700);
  }
}

/* =========================================================
   AMBIENT PARTICLES
========================================================= */

function setupAmbientParticles() {
  const container = $("#ambientParticles");

  for (let i = 0; i < 55; i++) {
    const particle = createElement(
      "div",
      "ambient-particle",
      container
    );

    particle.style.left =
      `${random(0,100)}%`;

    particle.style.top =
      `${random(0,100)}%`;

    particle.style.animationDuration =
      `${random(8,18)}s`;

    particle.style.animationDelay =
      `${random(-18,0)}s`;

    const size = random(2,5);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
  }
}

/* =========================================================
   DECORATIONS
========================================================= */

function setupDecorations() {
  const container = $("#floatingDecorations");

  for (let i = 0; i < 12; i++) {
    const heart = createElement(
      "div",
      "floating-heart",
      container
    );

    heart.style.left =
      `${random(5,95)}%`;

    heart.style.top =
      `${random(5,95)}%`;

    heart.style.transform =
      `rotate(-45deg) scale(${random(.35,.8)})`;

    heart.style.animationDelay =
      `${random(-5,0)}s`;
  }
}

/* =========================================================
   PARALLAX
========================================================= */

function setupParallax() {
  const heroVisual = $(".hero-visual");

  if (!heroVisual) return;

  window.addEventListener(
    "scroll",
    () => {
      const scroll =
        window.scrollY;

      if (scroll > window.innerHeight * 1.2) {
        return;
      }

      const rings =
        $$(".hero-ring", heroVisual);

      rings.forEach((ring, index) => {
        const movement =
          scroll * (index + 1) * .035;

        ring.style.marginTop =
          `${movement}px`;
      });
    },
    {
      passive: true
    }
  );
}

/* =========================================================
   REPLAY
========================================================= */

function setupReplay() {
  $("#replay").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (music) {
      music.currentTime = 0;

      music.play()
        .then(() => {
          musicPlayer.classList.add("playing");
        })
        .catch(() => {});
    }

    setTimeout(() => {
      intro.classList.remove("hide");
    }, 500);
  });
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

function setupAccessibility() {
  $$(".memory-card").forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        card.click();
      }
    });
  });
}

/* =========================================================
   INITIALIZE
========================================================= */

function initialize() {
  setupDogs();
  setupIntro();
  setupMusic();

  setupCities();
  updateFranceClock();
  updateCities();
  updateCountdown();

  setupNavigation();
  setupSectionTracking();
  setupRevealObserver();

  setupLightbox();
  setupLetter();
  setupCandle();
  setupWish();
  setup3DHeart();
  setupGift();
  setupSecret();

  setupBackgroundInteraction();
  setupAmbientParticles();
  setupDecorations();
  setupParallax();
  setupReplay();
  setupDogInteractions();
  setupAccessibility();

  updateJourneyProgress();

  setInterval(updateFranceClock, 1000);
  setInterval(updateCities, 1000);
  setInterval(updateCountdown, 1000);

  window.addEventListener(
    "scroll",
    updateJourneyProgress,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateJourneyProgress
  );

  /*
    Restore the wish only as local browser data.
    It never leaves the device.
  */

  const savedWish = localStorage.getItem(
    "lila-birthday-wish"
  );

  if (savedWish) {
    const input = $("#wishInput");

    if (input) {
      input.placeholder =
        "écris ton voeu ici...";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initialize
  );
} else {
  initialize();
}