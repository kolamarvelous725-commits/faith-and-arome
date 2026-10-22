/* ============================================================
   FAITH & AROME — PREMIUM WEDDING INVITATION
   JavaScript
   ============================================================ */

'use strict';



// ── FADE-UP INTERSECTION OBSERVER ────────────────────────
(function initFadeUp() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// ── COUNTDOWN TIMER ───────────────────────────────────────
(function initCountdown() {
  // Wedding: Saturday 21 November 2026, 10:00 AM (WAT = UTC+1)
  const WEDDING_DATE = new Date('2026-11-21T10:00:00+01:00');

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  if (!cdDays) return;

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function tick(el, newVal) {
    if (el.textContent !== newVal) {
      el.classList.remove('tick');
      // Force reflow
      void el.offsetWidth;
      el.classList.add('tick');
      el.textContent = newVal;
    }
  }

  function update() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      cdDays.textContent  = '00';
      cdHours.textContent = '00';
      cdMins.textContent  = '00';
      cdSecs.textContent  = '00';
      const card = document.getElementById('countdown-grid');
      const done = document.getElementById('cd-done');
      if (card) card.hidden = true;
      if (done) done.hidden = false;
      clearInterval(timer);
      return;
    }

    const totalSecs  = Math.floor(diff / 1000);
    const days       = Math.floor(totalSecs / 86400);
    const hours      = Math.floor((totalSecs % 86400) / 3600);
    const mins       = Math.floor((totalSecs % 3600) / 60);
    const secs       = totalSecs % 60;

    tick(cdDays,  pad(days));
    tick(cdHours, pad(hours));
    tick(cdMins,  pad(mins));
    tick(cdSecs,  pad(secs));
  }

  const timer = setInterval(update, 1000);
  update();
})();

// ── SAVE THE DATE: .ics download (Apple / Outlook) ───────
(function initCalendar() {
  const btn = document.getElementById('cal-ics');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Faith and Arome//Wedding//EN',
      'BEGIN:VEVENT',
      'UID:faith-arome-wedding-20261121@faithandarome',
      'DTSTAMP:20261001T000000Z',
      'DTSTART:20261121T090000Z',
      'DTEND:20261121T170000Z',
      "SUMMARY:Faith & Arome's Wedding",
      'LOCATION:Kingdom Rise International Gospel Center\\, WorldGate Plaza\\, Koroduma\\, One Man Village',
      'DESCRIPTION:Church service at 10:00 AM (Nigeria time). Reception follows immediately at Roseville Hotel\\, opposite Aunty Alice School\\, One Man Village. Colours of the day: Lilac\\, Purple & White. #FaithAndArome2026',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      "DESCRIPTION:Faith & Arome's wedding is tomorrow!",
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Faith-and-Arome-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();

// ── GALLERY LIGHTBOX ──────────────────────────────────────
(function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;

  // Collect image src and alt from each gallery item
  const images = galleryItems.map(item => {
    const img = item.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });

  function openLightbox(index) {
    currentIndex = ((index % images.length) + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
    lbImg.alt = images[currentIndex].alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function showPrev() { openLightbox(currentIndex - 1); }
  function showNext() { openLightbox(currentIndex + 1); }

  // Open on click
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
})();

// ── SMOOTH SCROLL OFFSET FOR FIXED NAV ───────────────────
(function initSmoothScrollOffset() {
  const NAV_HEIGHT = 78;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── HERO VIDEO — AUTOPLAY FALLBACK ───────────────────────
(function initHeroVideo() {

  // Force hero text visible immediately (no need to wait for video)
  document.querySelectorAll('.hero-content .fade-up').forEach(el => {
    el.classList.add('visible');
  });

  // Video src is injected lazily by the gate click handler below
  // to avoid blocking LCP with a 2.9 MB asset on page load.

})();

// ── BACKGROUND MUSIC ─────────────────────────────────────
(function initMusic() {
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-toggle');
  if (!audio || !btn) return;

  audio.volume = 0.6;
  let userPaused = false;
  let readyToPlay = false;
  const EVENTS = ['click', 'touchstart', 'scroll', 'keydown'];

  function setUI(playing) {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

  function tryPlay() {
    if (userPaused) return Promise.resolve();
    return audio.play().then(() => setUI(true)).catch(() => setUI(false));
  }

  // Wait for enough audio to buffer before playing
  function onReady() {
    readyToPlay = true;
    tryPlay();
  }

  if (audio.readyState >= 3) {
    // Already buffered enough
    onReady();
  } else {
    audio.addEventListener('canplaythrough', onReady, { once: true });
    // Fallback: try anyway after 3s if canplaythrough never fires
    setTimeout(() => { if (!readyToPlay) tryPlay(); }, 3000);
  }

  // Set audio src before loading — avoids preloading 941KB on page load
  const AUDIO_SRC = 'assets/obim-compressed.mp3';

  // Force the browser to start loading the audio only after src is set
  function loadAudio() {
    if (!audio.src || !audio.src.includes('obim')) {
      audio.src = AUDIO_SRC;
      audio.load();
    }
  }

  // Welcome gate: clicking "Open Invitation" reveals the site
  // and starts the music (the click counts as user interaction).
  const gate = document.getElementById('welcome-gate');
  const openBtn = document.getElementById('open-invitation');
  if (gate && openBtn) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    openBtn.addEventListener('click', () => {
      userPaused = false;

      // ── Lazy-load hero video (saves ~2.9MB on initial page load) ──
      const v = document.getElementById('hero-video');
      if (v && !v.src) {
        const source = document.createElement('source');
        source.src  = 'assets/storyexport-compressed.mp4';
        source.type = 'video/mp4';
        v.appendChild(source);
        v.muted = true;
        v.load();
        v.play().catch(() => {});
      } else if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }

      // ── Lazy-load audio (saves ~941KB on initial page load) ──
      loadAudio();
      tryPlay();

      gate.classList.add('gate-hidden');
      document.body.classList.remove('gate-locked');
      setTimeout(() => gate.remove(), 1000);
    });
  }

  // Browsers block sound until the visitor interacts, so
  // start on the very first tap / click / scroll / key press.
  function kick(e) {
    if (e && e.target && e.target.closest && e.target.closest('#music-toggle')) return;
    if (!userPaused && audio.paused) tryPlay();
    EVENTS.forEach(ev => window.removeEventListener(ev, kick));
  }
  EVENTS.forEach(ev => window.addEventListener(ev, kick, { passive: true }));

  btn.addEventListener('click', () => {
    if (audio.paused) { userPaused = false; tryPlay(); }
    else { userPaused = true; audio.pause(); setUI(false); }
  });
})();


