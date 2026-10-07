/**
 * PARSA'S BIRTHDAY SCRAPBOOK - INTERACTIVE ENGINE
 * Handcrafted with love by Aryan for Parsa 🌷
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State Management
  const state = {
    musicPlaying: false,
    envelopeOpen: false,
    candleBlown: false,
    currentCamIndex: 0,
    ytPlayerReady: false,
    videoDuration: 276 // ~4:36 in seconds
  };

  // Photo Collection for Retro Digicam & Scrapbook
  const photos = [
    {
      src: 'assets/photos/Screenshot_20260208-004320.webp',
      caption: 'The iconic finger gun duo! Matching black leather jackets & pure laughs 😎',
      date: 'Golden Hour'
    },
    {
      src: 'assets/photos/Screenshot_20260116-201107.webp',
      caption: '“Finally koi mila jiske ye gana denote kr saka 😏” — Woh Din Anthem 🎶',
      date: 'Woh Din Story'
    },
    {
      src: 'assets/photos/IMG_20251211_161338582.webp',
      caption: 'Chasing waterfalls & cool shades! Always matching our frequency 🌊',
      date: 'Dec 11, 2025'
    },
    {
      src: 'assets/photos/IMG_20250926_171016998.webp',
      caption: 'That radiant smile of yours in white lace! One of my favorite pictures of us 🌷',
      date: 'Pure Joy'
    },
    {
      src: 'assets/photos/IMG_20251211_161356805.webp',
      caption: 'Candid smiles by the rocks — never a dull second hanging out with you 😄',
      date: 'Dec 2025'
    },
    {
      src: 'assets/photos/IMG_20260401_201405949.webp',
      caption: 'Late evening walks, moonlit skies & endless banter 🌙',
      date: 'Night Shenanigans'
    },
    {
      src: 'assets/photos/IMG_20251211_165359504.webp',
      caption: 'Unmatched companion for every single adventure under the sun ☀️',
      date: 'Cherished Days'
    },
    {
      src: 'assets/photos/IMG_20260116_172037277.webp',
      caption: 'To another year of celebrating each other’s wins & endless laughter 🥂',
      date: 'Forever Besties'
    }
  ];

  /* ==========================================================================
     1. YOUTUBE IFRAME PLAYER API INTEGRATION ("Woh Din" - xC1cj9zhh6k)
     ========================================================================== */
  let ytPlayer = null;

  // Load YouTube Iframe API script dynamically
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('youtube-player', {
      height: '1',
      width: '1',
      videoId: 'xC1cj9zhh6k',
      playerVars: {
        autoplay: 0,
        controls: 0,
        loop: 1,
        playlist: 'xC1cj9zhh6k',
        playsinline: 1,
        modestbranding: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  function onPlayerReady(event) {
    state.ytPlayerReady = true;
    try {
      ytPlayer.setVolume(85);
      state.videoDuration = ytPlayer.getDuration() || 276;
      updateTimeDisplay(0, state.videoDuration);
    } catch (e) {
      console.log('Player ready handled', e);
    }
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      setMusicVisualState(true);
      startProgressTracker();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      setMusicVisualState(false);
      stopProgressTracker();
    }
  }

  function toggleMusicPlayback() {
    if (!state.ytPlayerReady || !ytPlayer) {
      openYoutubeModal();
      return;
    }

    try {
      if (state.musicPlaying) {
        ytPlayer.pauseVideo();
        setMusicVisualState(false);
      } else {
        ytPlayer.playVideo();
        setMusicVisualState(true);
      }
    } catch (err) {
      console.warn('Playback toggle error:', err);
      setMusicVisualState(!state.musicPlaying);
    }
  }

  function setMusicVisualState(isPlaying) {
    state.musicPlaying = isPlaying;
    const turntableCard = document.querySelector('.turntable-player-card');
    const miniDisc = document.getElementById('mini-disc');
    const mainPlayIcon = document.getElementById('main-play-icon');
    const floatingPlayIcon = document.getElementById('floating-play-icon');

    if (isPlaying) {
      turntableCard?.classList.add('playing');
      miniDisc?.classList.add('spinning');
      if (mainPlayIcon) mainPlayIcon.setAttribute('data-lucide', 'pause');
      if (floatingPlayIcon) floatingPlayIcon.setAttribute('data-lucide', 'pause');
    } else {
      turntableCard?.classList.remove('playing');
      miniDisc?.classList.remove('spinning');
      if (mainPlayIcon) mainPlayIcon.setAttribute('data-lucide', 'play');
      if (floatingPlayIcon) floatingPlayIcon.setAttribute('data-lucide', 'play');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Progress Tracker
  let progressInterval = null;
  function startProgressTracker() {
    stopProgressTracker();
    progressInterval = setInterval(() => {
      if (ytPlayer && state.musicPlaying && ytPlayer.getCurrentTime) {
        try {
          const currentTime = ytPlayer.getCurrentTime() || 0;
          const duration = ytPlayer.getDuration() || state.videoDuration || 276;
          const percentage = Math.min((currentTime / duration) * 100, 100);
          
          const fill = document.getElementById('progress-bar-fill');
          if (fill) fill.style.width = `${percentage}%`;

          updateTimeDisplay(currentTime, duration);
        } catch (e) {}
      }
    }, 500);
  }

  function stopProgressTracker() {
    if (progressInterval) clearInterval(progressInterval);
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  function updateTimeDisplay(current, duration) {
    const curElem = document.getElementById('time-current');
    const durElem = document.getElementById('time-duration');
    if (curElem) curElem.textContent = formatTime(current);
    if (durElem) durElem.textContent = formatTime(duration);
  }

  // Seek bar click
  const progressBarWrap = document.getElementById('progress-bar-wrap');
  if (progressBarWrap) {
    progressBarWrap.addEventListener('click', (e) => {
      const rect = progressBarWrap.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      const targetTime = clickPos * (state.videoDuration || 276);
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(targetTime, true);
        if (!state.musicPlaying) toggleMusicPlayback();
      }
    });
  }

  // Player buttons
  document.getElementById('player-play-btn')?.addEventListener('click', toggleMusicPlayback);
  document.getElementById('floating-play-btn')?.addEventListener('click', toggleMusicPlayback);

  document.getElementById('player-rewind')?.addEventListener('click', () => {
    if (ytPlayer && ytPlayer.getCurrentTime) {
      const cur = ytPlayer.getCurrentTime();
      ytPlayer.seekTo(Math.max(0, cur - 10), true);
    }
  });

  document.getElementById('player-forward')?.addEventListener('click', () => {
    if (ytPlayer && ytPlayer.getCurrentTime) {
      const cur = ytPlayer.getCurrentTime();
      ytPlayer.seekTo(cur + 10, true);
    }
  });

  document.getElementById('player-volume-toggle')?.addEventListener('click', () => {
    if (ytPlayer && ytPlayer.isMuted) {
      const volIcon = document.getElementById('volume-icon');
      if (ytPlayer.isMuted()) {
        ytPlayer.unMute();
        volIcon?.setAttribute('data-lucide', 'volume-2');
      } else {
        ytPlayer.mute();
        volIcon?.setAttribute('data-lucide', 'volume-x');
      }
      if (window.lucide) window.lucide.createIcons();
    }
  });

  /* ==========================================================================
     2. HERO GIFT UNBOXING SURPRISE MODAL
     ========================================================================== */
  const giftModal = document.getElementById('gift-modal');
  const unwrapBtn = document.getElementById('unwrap-gift-btn');
  const giftBoxElement = document.getElementById('gift-box-element');

  function openGiftAndStart() {
    giftBoxElement?.classList.add('opened');

    // Confetti burst
    fireCelebrationConfetti();

    // Start Song
    setTimeout(() => {
      toggleMusicPlayback();
    }, 400);

    // Fade out modal
    setTimeout(() => {
      if (giftModal) {
        giftModal.style.opacity = '0';
        giftModal.style.transform = 'scale(1.05)';
        setTimeout(() => {
          giftModal.classList.add('hidden');
          // Scroll slightly to the greeting hub
          document.getElementById('hub')?.scrollIntoView({ behavior: 'smooth' });
        }, 600);
      }
    }, 1000);
  }

  unwrapBtn?.addEventListener('click', openGiftAndStart);
  giftBoxElement?.addEventListener('click', openGiftAndStart);

  /* ==========================================================================
     3. RETRO DIGICAM PHOTO VIEWER
     ========================================================================== */
  const camImg = document.getElementById('cam-current-img');
  const camCaption = document.getElementById('cam-caption');
  const camCounter = document.getElementById('cam-counter');
  const camFlash = document.getElementById('cam-flash');

  function updateDigicamView(index, triggerFlash = true) {
    state.currentCamIndex = (index + photos.length) % photos.length;
    const photo = photos[state.currentCamIndex];

    if (triggerFlash && camFlash) {
      camFlash.classList.add('flash-active');
      setTimeout(() => camFlash.classList.remove('flash-active'), 350);
    }

    if (camImg) {
      camImg.style.opacity = '0';
      setTimeout(() => {
        camImg.src = photo.src;
        camImg.alt = photo.caption;
        camImg.style.opacity = '1';
      }, 150);
    }

    if (camCaption) camCaption.textContent = photo.caption;
    if (camCounter) camCounter.textContent = `${state.currentCamIndex + 1} / ${photos.length}`;
  }

  document.getElementById('cam-prev')?.addEventListener('click', () => {
    updateDigicamView(state.currentCamIndex - 1);
  });

  document.getElementById('cam-next')?.addEventListener('click', () => {
    updateDigicamView(state.currentCamIndex + 1);
  });

  document.getElementById('cam-shutter-btn')?.addEventListener('click', () => {
    updateDigicamView(state.currentCamIndex + 1, true);
    shootPetalsConfetti();
  });

  document.getElementById('cam-open-lightbox')?.addEventListener('click', () => {
    const photo = photos[state.currentCamIndex];
    openLightbox(photo.src, photo.caption);
  });

  /* ==========================================================================
     4. POLAROID SCRAPBOOK LIGHTBOX
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(src, caption) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-lightbox');
      const caption = card.getAttribute('data-caption');
      if (src) openLightbox(src, caption);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  /* ==========================================================================
     5. INTERACTIVE ENVELOPE & ARYAN'S LETTER
     ========================================================================== */
  const vintageEnvelope = document.getElementById('vintage-envelope');
  const toggleEnvBtn = document.getElementById('toggle-envelope-btn');
  const envBowTrigger = document.getElementById('envelope-bow-trigger');
  const envBtnText = document.getElementById('env-btn-text');

  function toggleEnvelope() {
    state.envelopeOpen = !state.envelopeOpen;
    if (state.envelopeOpen) {
      vintageEnvelope?.classList.add('open');
      if (envBtnText) envBtnText.textContent = 'Fold Back Letter';
      shootHeartConfetti();
      setTimeout(() => {
        vintageEnvelope?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } else {
      vintageEnvelope?.classList.remove('open');
      if (envBtnText) envBtnText.textContent = 'Open Envelope';
    }
  }

  vintageEnvelope?.addEventListener('click', (e) => {
    if (!state.envelopeOpen || e.target.closest('#envelope-bow-trigger') || e.target.closest('#envelope-flap')) {
      toggleEnvelope();
    }
  });

  toggleEnvBtn?.addEventListener('click', toggleEnvelope);
  envBowTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEnvelope();
  });

  /* ==========================================================================
     6. VIDEO VAULT TAB SWITCHER
     ========================================================================== */
  const videoTabs = document.querySelectorAll('.vtab-btn');
  const mainVideo = document.getElementById('main-video-player');
  const videoTitle = document.getElementById('video-display-title');
  const videoDesc = document.getElementById('video-display-desc');

  videoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      videoTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const videoFile = tab.getAttribute('data-video');
      const posterFile = tab.getAttribute('data-poster');
      const title = tab.getAttribute('data-title');
      const desc = tab.getAttribute('data-desc');

      if (mainVideo) {
        mainVideo.pause();
        mainVideo.poster = posterFile;
        mainVideo.src = videoFile;
        mainVideo.load();
      }

      if (videoTitle) videoTitle.textContent = title;
      if (videoDesc) videoDesc.textContent = desc;
    });
  });

  /* ==========================================================================
     7. TULIP GARDEN INTERACTIVE BLOOM & QUOTES
     ========================================================================== */
  const tulipItems = document.querySelectorAll('.tulip-flower-item');
  const tulipQuoteText = document.getElementById('tulip-quote-text');

  tulipItems.forEach((tulip, index) => {
    tulip.addEventListener('click', () => {
      tulipItems.forEach(t => t.classList.remove('bloomed'));
      tulip.classList.add('bloomed');

      const quote = tulip.getAttribute('data-quote');
      if (tulipQuoteText) {
        tulipQuoteText.style.opacity = '0';
        tulipQuoteText.style.transform = 'translateY(8px)';
        setTimeout(() => {
          tulipQuoteText.textContent = quote;
          tulipQuoteText.style.transition = 'all 0.4s ease';
          tulipQuoteText.style.opacity = '1';
          tulipQuoteText.style.transform = 'translateY(0)';
        }, 150);
      }

      shootPetalsConfetti();
    });
  });

  /* ==========================================================================
     8. BIRTHDAY CAKE & BLOW OUT CANDLE
     ========================================================================== */
  const candleFlame = document.getElementById('candle-flame');
  const blowCandleBtn = document.getElementById('blow-candle-btn');
  const wishRevealMsg = document.getElementById('wish-reveal-msg');

  function blowOutCandle() {
    if (state.candleBlown) return;
    state.candleBlown = true;

    if (candleFlame) {
      candleFlame.classList.add('extinguished');
    }

    if (blowCandleBtn) {
      blowCandleBtn.style.display = 'none';
    }

    fireGrandCelebration();

    if (wishRevealMsg) {
      wishRevealMsg.classList.add('visible');
    }
  }

  blowCandleBtn?.addEventListener('click', blowOutCandle);
  candleFlame?.addEventListener('click', blowOutCandle);

  /* ==========================================================================
     9. YOUTUBE VIDEO POPUP MODAL
     ========================================================================== */
  const ytModal = document.getElementById('yt-modal');
  const ytModalIframe = document.getElementById('yt-modal-iframe');
  const ytModalClose = document.getElementById('yt-modal-close');
  const ytBackdrop = document.getElementById('yt-backdrop');

  function openYoutubeModal() {
    if (ytModalIframe) {
      ytModalIframe.src = "https://www.youtube-nocookie.com/embed/xC1cj9zhh6k?autoplay=1&rel=0";
    }
    ytModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeYoutubeModal() {
    if (ytModalIframe) {
      ytModalIframe.src = "";
    }
    ytModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('open-yt-modal-btn')?.addEventListener('click', openYoutubeModal);
  document.getElementById('open-video-modal-btn')?.addEventListener('click', openYoutubeModal);
  ytModalClose?.addEventListener('click', closeYoutubeModal);
  ytBackdrop?.addEventListener('click', closeYoutubeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeYoutubeModal();
    }
  });

  /* ==========================================================================
     10. CONFETTI CANNONS & PARTICLES
     ========================================================================== */
  function fireCelebrationConfetti() {
    if (!window.confetti) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f28b9c', '#7fa988', '#fad479', '#ffffff', '#e87185']
    });
  }

  function shootPetalsConfetti() {
    if (!window.confetti) return;
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f9ab8b', '#f28b9c', '#fde8ed', '#7fa988']
    });
  }

  function shootHeartConfetti() {
    if (!window.confetti) return;
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#d96257', '#f28b9c', '#fad479', '#ffffff']
    });
  }

  function fireGrandCelebration() {
    if (!window.confetti) return;
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 12000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f28b9c', '#fad479', '#7fa988', '#fae4e2', '#d96257']
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f28b9c', '#fad479', '#7fa988', '#fae4e2', '#d96257']
      }));
    }, 250);
  }

  document.getElementById('toggle-tulips-rain')?.addEventListener('click', () => {
    shootPetalsConfetti();
  });

  /* ==========================================================================
     11. GSAP SCROLLTRIGGER GENTLE PARALLAX & ENTRANCES
     ========================================================================== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.polaroid-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none'
        },
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.scrapbook-section').forEach(section => {
      const wrap = section.querySelector('.section-title-wrap');
      if (wrap) {
        gsap.from(wrap, {
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          y: 25,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }

  /* ==========================================================================
     12. BEST FRIEND REPORT CARD INTERACTIONS
     ========================================================================== */
  const starBtn = document.getElementById('award-star-btn');
  const starCounter = document.getElementById('gold-star-counter');
  const printBtn = document.getElementById('print-report-btn');
  const hugBtn = document.getElementById('bestie-hug-btn');
  const reportToast = document.getElementById('report-toast');

  let starCount = 10;
  let toastTimeout = null;

  function showReportToast(msg) {
    if (!reportToast) return;
    reportToast.textContent = msg;
    reportToast.style.opacity = '1';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      reportToast.style.opacity = '0';
    }, 4000);
  }

  starBtn?.addEventListener('click', () => {
    starCount++;
    if (starCounter) starCounter.textContent = starCount;

    // Spawn floating star
    const starEl = document.createElement('span');
    starEl.className = 'floating-gold-star';
    starEl.textContent = '⭐';
    if (starBtn.parentElement) {
      const rect = starBtn.getBoundingClientRect();
      const parentRect = starBtn.parentElement.getBoundingClientRect();
      starEl.style.left = `${(rect.left - parentRect.left) + rect.width / 2 + (Math.random() * 40 - 20)}px`;
      starEl.style.top = `${rect.top - parentRect.top}px`;
      starBtn.parentElement.appendChild(starEl);
      setTimeout(() => starEl.remove(), 1200);
    }

    // Confetti burst
    if (window.confetti) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fde68a', '#f28b9c', '#ffffff']
      });
    }

    const praises = [
      `Awarded! Parsa is officially at ${starCount} Gold Stars! ⭐`,
      `Verified: Certified Greatest Best Friend on Planet Earth! 🌍`,
      `Another Star Added! Summa Cum Laude Status Confirmed! 🎓`,
      `A+++ Bestie! Aryan is proud to have you! 💖`,
      `Gold Star #${starCount}! Queen behavior as always! 👑`
    ];
    showReportToast(praises[Math.floor(Math.random() * praises.length)]);
  });

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  hugBtn?.addEventListener('click', () => {
    shootHeartConfetti();
    showReportToast("✋ High-Five Received! Aryan is sending infinite bestie love your way! 💖");
  });
});
