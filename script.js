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

// ── GALLERY LIGHTBOX SLIDER (All 20 Photos) ───────────────
(function initLightbox() {
  const ALL_PHOTOS = [
    { src: 'assets/photo1.jpeg',  alt: 'Faith and Arome — romantic portrait' },
    { src: 'assets/photo2.jpeg',  alt: 'Faith and Arome — tender moment' },
    { src: 'assets/photo3.jpeg',  alt: 'Faith and Arome — portrait' },
    { src: 'assets/photo4.jpeg',  alt: 'Faith and Arome — warm portrait' },
    { src: 'assets/photo5.jpeg',  alt: 'Faith and Arome — in traditional attire' },
    { src: 'assets/photo6.jpeg',  alt: 'Faith and Arome — celebration' },
    { src: 'assets/photo7.jpeg',  alt: 'Faith and Arome — together' },
    { src: 'assets/photo8.jpeg',  alt: 'Faith and Arome — joyful moment' },
    { src: 'assets/photo9.jpeg',  alt: 'Faith and Arome — romance' },
    { src: 'assets/photo10.jpeg', alt: 'Faith and Arome — elegance' },
    { src: 'assets/photo11.jpeg', alt: 'Faith and Arome — loving smile' },
    { src: 'assets/photo12.jpeg', alt: 'Faith and Arome — cherished memory' },
    { src: 'assets/photo13.jpeg', alt: 'Faith and Arome — beautiful couple' },
    { src: 'assets/photo14.jpeg', alt: 'Faith and Arome — holding hands' },
    { src: 'assets/photo15.jpeg', alt: 'Faith and Arome — together forever' },
    { src: 'assets/photo16.jpeg', alt: 'Faith and Arome — radiant' },
    { src: 'assets/photo17.jpeg', alt: 'Faith and Arome — laughter and joy' },
    { src: 'assets/photo18.jpeg', alt: 'Faith and Arome — embrace' },
    { src: 'assets/photo19.jpeg', alt: 'Faith and Arome — wedding journey' },
    { src: 'assets/photo20.jpeg', alt: 'Faith and Arome — forever love' }
  ];

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbWrap       = document.getElementById('lightbox-wrap');
  const lbCounter    = document.getElementById('lightbox-counter');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');
  const lbFilmstrip  = document.getElementById('lightbox-filmstrip');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;

  // Build thumbnail filmstrip
  if (lbFilmstrip) {
    ALL_PHOTOS.forEach((photo, idx) => {
      const thumb = document.createElement('button');
      thumb.className = 'lb-thumb';
      thumb.setAttribute('aria-label', `Go to photo ${idx + 1}`);
      thumb.setAttribute('type', 'button');
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.appendChild(img);
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        updatePhoto(idx, idx > currentIndex ? 1 : -1);
      });
      lbFilmstrip.appendChild(thumb);
    });
  }

  function updateActiveThumb(index) {
    if (!lbFilmstrip) return;
    const thumbs = lbFilmstrip.querySelectorAll('.lb-thumb');
    thumbs.forEach((t, i) => t.classList.toggle('lb-thumb-active', i === index));
    // Scroll active thumb into view
    if (thumbs[index]) {
      thumbs[index].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  function updatePhoto(index, direction = 0) {
    currentIndex = ((index % ALL_PHOTOS.length) + ALL_PHOTOS.length) % ALL_PHOTOS.length;
    const photo = ALL_PHOTOS[currentIndex];

    if (lbWrap) {
      lbWrap.style.opacity = '0';
      lbWrap.style.transform = direction !== 0
        ? `translateX(${direction * 30}px) scale(0.97)`
        : 'scale(0.95)';
    }

    setTimeout(() => {
      lbImg.src = photo.src;
      lbImg.alt = photo.alt;
      if (lbCounter) {
        lbCounter.textContent = `${currentIndex + 1} / ${ALL_PHOTOS.length}`;
      }
      if (lbWrap) {
        lbWrap.style.opacity = '1';
        lbWrap.style.transform = 'translateX(0) scale(1)';
      }
      updateActiveThumb(currentIndex);
    }, 120);

    // Preload adjacent images
    const nextIdx = (currentIndex + 1) % ALL_PHOTOS.length;
    const prevIdx = (currentIndex - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length;
    new Image().src = ALL_PHOTOS[nextIdx].src;
    new Image().src = ALL_PHOTOS[prevIdx].src;
  }

  function openLightbox(index) {
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    // Force the lightbox to always anchor to the viewport top
    lightbox.scrollTop = 0;
    // Small delay so hidden→visible transition works
    requestAnimationFrame(() => {
      lightbox.classList.add('lb-open');
    });
    updatePhoto(index, 0);
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    setTimeout(() => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }, 320);
    const origin = galleryItems[Math.min(currentIndex, galleryItems.length - 1)];
    if (origin) origin.focus();
  }

  function showPrev() { updatePhoto(currentIndex - 1, -1); }
  function showNext() { updatePhoto(currentIndex + 1,  1); }

  // Open lightbox from any of the 4 grid photos using data-index attribute
  galleryItems.forEach((item) => {
    const dataIdx = parseInt(item.getAttribute('data-index'), 10);
    const openIdx = isNaN(dataIdx) ? 0 : dataIdx;
    item.addEventListener('click', () => openLightbox(openIdx));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(openIdx);
      }
    });
  });

  if (lbClose) lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  if (lbPrev)  lbPrev.addEventListener('click',  (e) => { e.stopPropagation(); showPrev(); });
  if (lbNext)  lbNext.addEventListener('click',  (e) => { e.stopPropagation(); showNext(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Click the dark backdrop to close (but not the image or controls)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe gestures for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (!e.changedTouches.length) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
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


