"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";
import configData from "../data/weddingConfig.json";
import SplashSection from "../components/SplashSection";
import confetti from "canvas-confetti";

export default function WeddingPage() {
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");

  const CONFIG = {
    groomName: configData.groom.nickname,
    brideName: configData.bride.nickname,
    weddingDate: configData.weddingInfo.date,
    waNumber: configData.contact.waNumber,
  };

  /* ── SPARKLE ── */
  const createSparkle = (container: HTMLElement) => {
    const s = document.createElement('img');
    s.src = '/assets/sparkle-star.svg';
    s.className = 'sparkle';
    const size = Math.random() * 22 + 10;
    s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 94 + 2}%;top:${Math.random() * 94 + 2}%;opacity:0;animation:sparkleTwinkle ${Math.random() * 2 + 1.5}s ease-in-out ${Math.random() * 4}s infinite;`;
    container.appendChild(s);
  };

  /* ── PETAL ── */
  const createPetal = (container: HTMLElement) => {
    const p = document.createElement('div');
    p.classList.add('petal');
    const size = Math.random() * 22 + 14;
    const startX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const dur = Math.random() * 5 + 6;
    const delay = Math.random() * 5;
    const sway = (Math.random() - 0.5) * 180;
    p.style.cssText = `position:fixed;top:-60px;left:${startX}px;width:${size}px;height:${size}px;background-image:url('/assets/petal-single.svg');background-size:contain;background-repeat:no-repeat;pointer-events:none;z-index:998;animation:petalFall ${dur}s ease-in ${delay}s forwards;--sway:${sway}px;`;
    container.appendChild(p);
    setTimeout(() => {
      p.remove();
      if (document.getElementById('petal-container')) createPetal(container);
    }, (dur + delay) * 1000 + 500);
  };

  /* ── CONFETTI ── */
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B4A58', '#C8A882', '#FAF7F4', '#8BAE8C', '#A89DC0', '#E8C5CC']
    });
  };
  (globalThis as any).launchConfetti = launchConfetti;



  /* ── COUNT UP ── */
  const animateCountUp = (el: HTMLElement, target: number, duration = 1800) => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = String(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ── FLOATING ORNAMENTS ── */
  const addFloatOrnaments = (section: HTMLElement) => {
    const svgs = [
      `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 1 L13.5 9.5 L22 11 L13.5 12.5 L12 21 L10.5 12.5 L2 11 L10.5 9.5Z" fill="#C8A882"/></svg>`,
      `<svg width="20" height="30" viewBox="0 0 20 30"><path d="M10 1 Q16 7 14 17 Q12 25 10 29 Q8 25 6 17 Q4 7 10 1Z" fill="#E8C5CC"/></svg>`
    ];
    for (let i = 0; i < 1; i++) { // Diminimalkan menjadi 1 dari 3 untuk performa
      const o = document.createElement('div');
      o.className = 'float-ornament';
      o.innerHTML = svgs[i % svgs.length];
      o.style.cssText = `left:${[8, 80, 15, 75][i % 4]}%;top:${[15, 25, 65, 50][i % 4]}%;--float-dur:${7 + i * 2}s;--float-delay:${i * 1.5}s;`;
      section.appendChild(o);
    }
  };

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (!isOpened) {
      document.body.classList.add('locked');
    }

    const params = new URLSearchParams(window.location.search);
    const nama = params.get('tamu');
    if (nama) { 
      setGuestName(decodeURIComponent(nama));
      const el = document.getElementById('guest-name'); 
      if (el) el.textContent = nama; 
    }

    /* Scroll Reveal */
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

    /* Sparkles */
    document.querySelectorAll('.has-sparkles').forEach(s => {
      (s as HTMLElement).style.position = 'relative';
      for (let i = 0; i < 5; i++) createSparkle(s as HTMLElement); // Diminimalkan dari 14
    });

    /* Petal rain */
    const pc = document.createElement('div');
    pc.id = 'petal-container';
    pc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:997;overflow:hidden;';
    document.body.appendChild(pc);
    for (let i = 0; i < 5; i++) createPetal(pc); // Diminimalkan dari 12

    /* Float ornaments in each section */
    document.querySelectorAll('section').forEach(s => addFloatOrnaments(s as HTMLElement));

    /* Parallax (Optimized with rAF) */
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    const flowerEls = document.querySelectorAll('.section-flowers');
    let ticking = false;

    const updateParallax = () => {
      if (!isOpened) return;
      const scrollY = window.scrollY;
      
      parallaxEls.forEach(el => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.15');
        (el as HTMLElement).style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });

      flowerEls.forEach((el, i) => {
        const drift = Math.sin(scrollY * 0.002 + i) * 15;
        const parentRect = el.parentElement?.getBoundingClientRect();
        const yOffset = parentRect ? parentRect.top * 0.15 : scrollY * -0.15;
        (el as HTMLElement).style.transform = `translate3d(${drift}px, ${yOffset}px, 0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Float data-float elements */
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      const dur = parseFloat((el as HTMLElement).dataset.float || '4');
      (el as HTMLElement).style.animation = `floatUpDown ${dur}s ease-in-out ${i * 0.5}s infinite`;
    });

    /* Flower entrance */
    const fl = document.querySelector('.flowers-left');
    const fr = document.querySelector('.flowers-right');
    if (fl) setTimeout(() => fl.classList.add('flowers-entered'), 350);
    if (fr) setTimeout(() => fr.classList.add('flowers-entered'), 600);

    /* Flip clock */
    const target = new Date(CONFIG.weddingDate).getTime();
    const clockInt = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      Object.entries({ days, hours, minutes, seconds }).forEach(([u, v]) => {
        const els = document.querySelectorAll(`.flip-${u}`);
        const vs = String(v).padStart(2, '0');
        els.forEach(el => {
          const cur = el.querySelector('.flip-value');
          if (cur && cur.textContent !== vs) {
            el.classList.add('flipping');
            setTimeout(() => { if (cur) cur.textContent = vs; el.classList.remove('flipping'); }, 250);
          }
        });
      });
    }, 1000);

    /* Dot nav */
    const sections = ['hero', 'profil', 'love-story', 'acara', 'galeri', 'rsvp', 'amplop', 'buku-tamu', 'closing'];
    const dots = document.querySelectorAll('.dot-item');
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = sections.indexOf(e.target.id);
          if (idx > -1) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[idx]) dots[idx].classList.add('active');
          }
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) secObs.observe(el); });

    /* Count-up on buku-tamu */
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.counter-number[data-count]').forEach(el => {
            animateCountUp(el as HTMLElement, parseInt((el as HTMLElement).dataset.count || '0'));
          });
          countObs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    const bukuTamu = document.getElementById('buku-tamu');
    if (bukuTamu) countObs.observe(bukuTamu);

    /* Confetti on closing section */
    const closingObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { launchConfetti(); closingObs.disconnect(); } });
    }, { threshold: 0.35 });
    const closing = document.getElementById('closing');
    if (closing) closingObs.observe(closing);



    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(clockInt);
      revealObs.disconnect();
      secObs.disconnect();
      countObs.disconnect();
      closingObs.disconnect();
      document.getElementById('petal-container')?.remove();
    };
  }, [isOpened]);

  const openInvitation = () => {
    setIsOpened(true);
    document.body.classList.remove('locked');
    document.getElementById('splash')?.classList.add('hide');
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) { audio.play().catch(() => { }); document.getElementById('music-btn')?.classList.add('playing'); }
    setTimeout(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
      const splashEl = document.getElementById('splash');
      if (splashEl) splashEl.style.display = 'none';
      launchConfetti();
    }, 900);
  };

  const openLightbox = (src: string) => {
    const img = document.getElementById('lightbox-img') as HTMLImageElement;
    if (img) img.src = src;
    document.getElementById('lightbox')?.classList.add('open');
  };
  const closeLightbox = () => document.getElementById('lightbox')?.classList.remove('open');

  const submitRSVPForm = () => {
    const name = (document.getElementById('rsvp-name') as HTMLInputElement)?.value.trim();
    if (!name) { alert('Mohon isi nama terlebih dahulu.'); return; }
    if (!selectedAttendance) { alert('Mohon pilih konfirmasi kehadiran.'); return; }
    const msg = encodeURIComponent(`Halo, saya ${name} ingin konfirmasi kehadiran: ${selectedAttendance}. Terima kasih!`);
    window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
  };

  const copyRekening = (nomor: string) => {
    navigator.clipboard.writeText(nomor).then(() => alert('Nomor rekening ' + nomor + ' tersalin!'));
  };

  const confirmGiftWA = () => {
    const msg = encodeURIComponent(`Halo, saya ingin mengkonfirmasi pengiriman hadiah pernikahan untuk ${CONFIG.brideName} & ${CONFIG.groomName} 💍`);
    window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
  };

  const submitWishForm = () => {
    const name = (document.getElementById('wish-name') as HTMLInputElement)?.value.trim();
    const text = (document.getElementById('wish-text') as HTMLTextAreaElement)?.value.trim();
    if (!name || !text) { alert('Mohon isi nama dan ucapan.'); return; }
    const msg = encodeURIComponent(`💌 Ucapan dari ${name}:\n\n${text}`);
    window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
  };

  const shareInvitation = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `The Wedding of ${CONFIG.brideName} & ${CONFIG.groomName}`, text: `Kamu diundang ke pernikahan ${CONFIG.brideName} & ${CONFIG.groomName} 🌸`, url }).catch(() => { });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link undangan berhasil disalin!'));
    }
  };

  const dummyPhotos = configData.gallery;

  /* SVGs inline */
  const FloralDividerSVG = () => (
    <svg viewBox="0 0 300 30" width="280" height="30" className="floral-divider" aria-hidden="true">
      <line x1="0" y1="15" x2="95" y2="15" stroke="#C8A882" strokeWidth="0.6" strokeOpacity="0.45" />
      <path d="M115 15 Q125 5 135 15 Q145 25 155 15 Q165 5 175 15" stroke="#8B4A58" strokeWidth="0.9" fill="none" strokeOpacity="0.5" />
      <circle cx="135" cy="15" r="2.5" fill="#C8A882" fillOpacity="0.7" />
      <circle cx="105" cy="15" r="1.5" fill="#8B4A58" fillOpacity="0.3" />
      <circle cx="185" cy="15" r="1.5" fill="#8B4A58" fillOpacity="0.3" />
      <line x1="205" y1="15" x2="300" y2="15" stroke="#C8A882" strokeWidth="0.6" strokeOpacity="0.45" />
    </svg>
  );

  return (
    <>
      <div onClick={(e) => {
        const t = e.target as HTMLElement;
        const action = t.getAttribute('data-onclick') || t.parentElement?.getAttribute('data-onclick');
        if (!action) return;
        if (action.includes('openInvitation()')) openInvitation();
        else if (action.includes('closeLightbox()')) closeLightbox();
        else if (action.includes('submitRSVPForm()')) submitRSVPForm();
        else if (action.includes('confirmGiftWA()')) confirmGiftWA();
        else if (action.includes('submitWishForm()')) submitWishForm();
        else if (action.includes('shareInvitation()')) shareInvitation();
        else if (action.includes('openLightbox')) { const m = action.match(/'([^']+)'/); if (m?.[1]) openLightbox(m[1]); }
        else if (action.includes('copyRekening')) { const m = action.match(/'([^']+)'/); if (m?.[1]) copyRekening(m[1]); }
        else if (action.includes('scrollToSection')) { const m = action.match(/'([^']+)'/); if (m?.[1]) document.getElementById(m[1])?.scrollIntoView({ behavior: 'smooth' }); }
        else if (action.includes('selectAttendance')) {
          const m = action.match(/'([^']+)'/);
          if (m?.[1]) {
            document.querySelectorAll('.att-option').forEach(o => o.classList.remove('selected'));
            t.classList.add('selected');
            setSelectedAttendance(m[1]);
          }
        }
      }}>

        <button id="music-btn" aria-label="Play/Pause musik" title="Musik" style={{ opacity: isOpened ? 1 : 0, transition: 'opacity 1s ease 0.8s', pointerEvents: isOpened ? 'auto' : 'none' }}>♪</button>
        <audio id="bg-music" loop preload="none">
          <source src="/music/music-background.mp3" type="audio/mpeg" />
        </audio>

        <nav id="dot-nav" aria-label="Section navigation" style={{ opacity: isOpened ? 1 : 0, pointerEvents: isOpened ? 'auto' : 'none', transition: 'opacity 1s ease 0.8s' }}>
          {['hero', 'profil', 'love-story', 'acara', 'galeri', 'rsvp', 'amplop', 'buku-tamu', 'closing'].map((id, i) => (
            <div key={id} className={`dot-item${i === 0 ? ' active' : ''}`} data-onclick={`scrollToSection('${id}')`} title={id} />
          ))}
        </nav>

        <div className="corner-ornament corner-tl baroque-corner" />
        <div className="corner-ornament corner-tr baroque-corner" />
        <div className="corner-ornament corner-bl baroque-corner" />
        <div className="corner-ornament corner-br baroque-corner" />

        {/* ══════════ SPLASH ══════════ */}
        {!isOpened ? (
          <SplashSection 
            guestName={guestName} 
            onOpen={openInvitation} 
            brideName={CONFIG.brideName}
            groomName={CONFIG.groomName}
          />
        ) : null}

        {/* ══════════ HERO ══════════ */}
        <section id="hero" className="has-sparkles" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1543165365-0723ec09bbfa?auto=format&fit=crop&w=1200&q=80" alt="" className="story-parallax-bg" data-parallax="0.2" />
          <div className="story-overlay" style={{ background: 'linear-gradient(to bottom, rgba(250,247,244,0.85), rgba(240,232,224,0.95))' }}></div>
          <img src="/assets/castle-pink.png" alt="Kastil" className="castle-hero" data-reveal="fade" style={{ position: 'relative', zIndex: 4 }} />
          <div className="castle-shadow" style={{ position: 'relative', zIndex: 4 }} />

          <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: '820px' }}>
            <h1 className="hero-names shimmer-name" data-reveal="up">{configData.bride.nickname} &amp; {configData.groom.nickname}</h1>

            <div className="hero-quote-box" data-reveal="fade" data-delay="1">
              <p className="hero-quote">
                {configData.hero.quote}
              </p>
              <p className="hero-verse">{configData.hero.verse}</p>
            </div>

            <div className="countdown-wrapper" data-reveal="up" data-delay="2">
              {['days', 'hours', 'minutes', 'seconds'].map(u => (
                <div key={u} className={`flip-unit flip-${u}`}>
                  <div className="flip-card"><span className="flip-value">00</span></div>
                  <span className="flip-label">{u}</span>
                </div>
              ))}
            </div>

            <div className="calendar-btns" data-reveal="fade" data-delay="3">
              <a href={configData.weddingInfo.calendarGoogleLink}
                target="_blank" rel="noreferrer" className="btn-calendar">📅 Google Calendar</a>
              <a href={configData.weddingInfo.calendarIcsDownload}
                download="wedding.ics" className="btn-calendar">🗓 Save to Calendar</a>
            </div>
          </div>
        </section>

        {/* ══════════ PROFIL ══════════ */}
        <section id="profil" className="has-sparkles">
          <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{ width: '220px', marginBottom: '2rem' }} data-reveal="fade" />
          <h2 className="section-title" data-reveal="up">Mempelai Berbahagia</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '3.5rem', textAlign: 'center' }} data-reveal="fade" data-delay="1">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>

          <div className="profil-grid">
            {/* BRIDE */}
            <div className="profil-card" data-reveal="left">
              <div className="profil-photo-wrap">
                {/* Flower crown SVG */}
                <svg className="flower-crown" viewBox="0 0 80 40" aria-hidden="true">
                  <path d="M40 35 Q20 20 10 10 Q20 5 30 15 Q35 2 40 8 Q45 2 50 15 Q60 5 70 10 Q60 20 40 35Z" fill="#E8C5CC" opacity="0.8" />
                  <path d="M40 35 Q20 20 10 10 Q20 5 30 15 Q35 2 40 8 Q45 2 50 15 Q60 5 70 10 Q60 20 40 35Z" fill="none" stroke="#C8A882" strokeWidth="0.8" opacity="0.6" />
                </svg>
                <div className="profil-photo-inner">
                  <img src={configData.bride.photoUrl} alt={configData.bride.nickname} />
                </div>
              </div>
              <h3 className="profil-name">{configData.bride.fullName}</h3>
              <p className="profil-parent" style={{ whiteSpace: 'pre-line' }}>{configData.bride.parents}</p>
              <a href={configData.bride.instagramLink} className="profil-ig">📸 {configData.bride.instagram}</a>
            </div>

            {/* AMPERSAND */}
            <div className="profil-divider" data-reveal="scale" data-delay="2">&amp;</div>

            {/* GROOM */}
            <div className="profil-card" data-reveal="right">
              <div className="profil-photo-wrap">
                <svg className="flower-crown" viewBox="0 0 80 40" aria-hidden="true">
                  <path d="M40 35 Q20 20 10 10 Q20 5 30 15 Q35 2 40 8 Q45 2 50 15 Q60 5 70 10 Q60 20 40 35Z" fill="#E8C5CC" opacity="0.8" />
                  <path d="M40 35 Q20 20 10 10 Q20 5 30 15 Q35 2 40 8 Q45 2 50 15 Q60 5 70 10 Q60 20 40 35Z" fill="none" stroke="#C8A882" strokeWidth="0.8" opacity="0.6" />
                </svg>
                <div className="profil-photo-inner">
                  <img src={configData.groom.photoUrl} alt={configData.groom.nickname} />
                </div>
              </div>
              <h3 className="profil-name">{configData.groom.fullName}</h3>
              <p className="profil-parent" style={{ whiteSpace: 'pre-line' }}>{configData.groom.parents}</p>
              <a href={configData.groom.instagramLink} className="profil-ig">📸 {configData.groom.instagram}</a>
            </div>
          </div>
          <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{ width: '220px', marginTop: '3.5rem' }} data-reveal="fade" />
        </section>

        {/* ══════════ LOVE STORY ══════════ */}
        <section id="love-story" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80" alt="" className="story-parallax-bg" data-parallax="0.25" />
          <div className="story-overlay" style={{ background: 'linear-gradient(to bottom, rgba(240,232,224,0.8), rgba(240,232,224,0.95))' }}></div>

          <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title" data-reveal="up">Kisah Cinta Kami</h2>
            <p className="love-story-intro" data-reveal="fade" data-delay="1">
              Bagaimana takdir mempertemukan dua hati yang selalu mencari satu sama lain...
            </p>

            <div className="timeline" style={{ maxWidth: '800px', width: '100%', zIndex: 5, position: 'relative' }}>
              {configData.loveStory.map((item, i) => (
                <div key={i} className="timeline-item" data-reveal={item.dir}>
                  <div className="timeline-dot" style={{ fontSize: '1.2rem' }}>{item.icon}</div>
                  <div className="timeline-content">
                    <div className="year-bg">{item.year}</div>
                    <p className="timeline-date">{item.date}</p>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ ACARA ══════════ */}
        <section id="acara" className="has-sparkles" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1465495910483-0d6745778274?auto=format&fit=crop&w=1200&q=80" alt="" className="story-parallax-bg" data-parallax="0.15" />
          <div className="story-overlay" style={{ background: 'linear-gradient(to bottom, rgba(250,247,244,0.8), rgba(250,247,244,0.95))' }}></div>

          <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title" data-reveal="up">Waktu &amp; Tempat</h2>
            <FloralDividerSVG />

            <div className="countdown-wrapper" data-reveal="fade" style={{ marginBottom: '4rem' }}>
              {['days', 'hours', 'minutes', 'seconds'].map(u => (
                <div key={u} className={`flip-unit flip-${u}`}>
                  <div className="flip-card"><span className="flip-value">00</span></div>
                  <span className="flip-label">{u}</span>
                </div>
              ))}
            </div>

            <div className="event-cards">
              {configData.events.map((ev, i) => (
                <React.Fragment key={i}>
                  <div className="event-card" data-reveal={ev.dir}>
                    <div className="event-card-header">
                      <svg className="event-icon-svg" viewBox="0 0 60 60" aria-hidden="true">
                        {ev.iconStyle === 'akad' ? (
                          <>
                            <path d="M30 5 L36 20 L52 20 L39 30 L44 46 L30 36 L16 46 L21 30 L8 20 L24 20Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                            <circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.25)" />
                            <path d="M26 30 Q30 20 34 30 Q30 40 26 30Z" fill="rgba(255,255,255,0.5)" />
                          </>
                        ) : (
                          <>
                            <path d="M10 45 Q10 25 20 20 Q30 15 30 10 Q30 15 40 20 Q50 25 50 45Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                            <path d="M20 45 Q20 32 30 28 Q40 32 40 45" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                            <line x1="10" y1="45" x2="50" y2="45" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                          </>
                        )}
                      </svg>
                      <h3 className="event-name">{ev.type}</h3>
                    </div>
                    <div className="event-card-body">
                      <p className="event-datetime">{ev.dateStr}</p>
                      <div className="event-time-ornaments">
                        <span>✦</span> {ev.timeStr} <span>✦</span>
                      </div>
                      <p className="event-venue" style={{ whiteSpace: 'pre-line' }}>
                        <strong>{ev.venueName}</strong><br />
                        {ev.venueAddress}
                      </p>
                      <a href={ev.mapsLink} target="_blank" rel="noreferrer" className="btn-maps">
                        <span className="pin-pulse">📍</span> Lihat Lokasi
                      </a>
                    </div>
                  </div>

                  {i < configData.events.length - 1 && (
                    <div className="event-baroque-divider" data-reveal="fade">
                      <svg viewBox="0 0 30 120" width="30" height="120" aria-hidden="true">
                        <line x1="15" y1="0" x2="15" y2="45" stroke="#C8A882" strokeWidth="0.8" strokeOpacity="0.5" />
                        <circle cx="15" cy="60" r="6" fill="none" stroke="#C8A882" strokeWidth="1" strokeOpacity="0.6" />
                        <circle cx="15" cy="60" r="2.5" fill="#C8A882" fillOpacity="0.5" />
                        <line x1="15" y1="75" x2="15" y2="120" stroke="#C8A882" strokeWidth="0.8" strokeOpacity="0.5" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ GALERI ══════════ */}
        <section id="galeri">
          <h2 className="section-title" data-reveal="up">Galeri Bahagia</h2>
          <p className="galeri-caption" data-reveal="fade" data-delay="1">
            Momen indah yang tertangkap dalam lensa...
          </p>
          <div className="galeri-masonry" style={{ maxWidth: '960px', width: '100%' }}>
            {dummyPhotos.map((src, i) => (
              <div key={i} className="galeri-item" data-reveal="fade" data-delay={i % 3}
                data-onclick={`openLightbox('${src}')`}>
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* Lightbox */}
        <div id="lightbox" role="dialog" aria-modal="true" data-onclick="closeLightbox()">
          <span id="lightbox-close">✕</span>
          <img id="lightbox-img" src={undefined} alt="Foto" />
        </div>

        {/* ══════════ RSVP ══════════ */}
        <section id="rsvp">
          <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{ width: '200px', marginBottom: '2rem' }} data-reveal="fade" />
          <h2 className="section-title" data-reveal="up">Konfirmasi Kehadiran</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0.5rem auto 2.5rem', textAlign: 'center' }} data-reveal="fade" data-delay="1">
            Kehadiran Anda adalah doa terbaik bagi kami
          </p>

          <div className="rsvp-form" data-reveal="up" data-delay="2">
            <div className="form-field">
              <label className="form-label">Nama Tamu</label>
              <input type="text" id="rsvp-name" className="form-input" placeholder="Tulis namamu disini..." />
            </div>
            <div className="form-field">
              <label className="form-label">Konfirmasi Kehadiran</label>
              <div className="attendance-options">
                {['Hadir', 'Tidak Hadir', 'Ragu-ragu'].map(opt => (
                  <div key={opt} className="att-option" data-onclick={`selectAttendance('${opt}')`}>{opt}</div>
                ))}
              </div>
            </div>
            <button className="btn-open" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} data-onclick="submitRSVPForm()">
              💌 Kirim via WhatsApp
            </button>
          </div>
        </section>

        {/* ══════════ AMPLOP ══════════ */}
        <section id="amplop">
          <h2 className="section-title" data-reveal="up">Kado Pernikahan</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0.5rem auto 1rem', textAlign: 'center' }} data-reveal="fade" data-delay="1">
            Doa restu Anda adalah hadiah terindah. Namun jika ingin berbagi kebaikan:
          </p>
          <FloralDividerSVG />

          <div className="rekening-cards">
            {configData.bankAccounts.map((acc, i) => (
              <React.Fragment key={i}>
                <div className="rekening-card" data-reveal={acc.dir}>
                  <p className="bank-name">{acc.bank}</p>
                  <p className="rek-number">{acc.numberFormatted}</p>
                  <p className="rek-owner">{acc.owner}</p>
                  <button className="btn-copy" data-onclick={`copyRekening('${acc.number}')`}>📋 Salin Rekening</button>
                </div>
                {i < configData.bankAccounts.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.5rem' }}>
                    <svg viewBox="0 0 30 80" width="30" height="80" aria-hidden="true">
                      <line x1="15" y1="0" x2="15" y2="28" stroke="#C8A882" strokeWidth="0.8" strokeOpacity="0.5" />
                      <circle cx="15" cy="40" r="5" fill="none" stroke="#C8A882" strokeWidth="1" strokeOpacity="0.6" />
                      <circle cx="15" cy="40" r="2" fill="#C8A882" fillOpacity="0.5" />
                      <line x1="15" y1="52" x2="15" y2="80" stroke="#C8A882" strokeWidth="0.8" strokeOpacity="0.5" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }} data-reveal="up">
            <button className="btn-open" data-onclick="confirmGiftWA()">
              💚 Konfirmasi via WhatsApp
            </button>
          </div>
        </section>

        {/* ══════════ BUKU TAMU ══════════ */}
        <section id="buku-tamu" className="has-sparkles">
          <h2 className="section-title" data-reveal="up">Ucapan &amp; Doa</h2>
          <FloralDividerSVG />

          <div className="wish-counter" data-reveal="fade" data-delay="1">
            <div className="counter-item">
              <p className="counter-number" data-count={configData.guestBookStats.invited}>0</p>
              <p className="counter-label">Tamu Diundang</p>
            </div>
            <div className="counter-item">
              <p className="counter-number" data-count={configData.guestBookStats.attending}>0</p>
              <p className="counter-label">Konfirmasi Hadir</p>
            </div>
            <div className="counter-item">
              <p className="counter-number" data-count={configData.guestBookStats.wishes}>0</p>
              <p className="counter-label">Ucapan &amp; Doa</p>
            </div>
          </div>

          <div className="wish-form" data-reveal="up" data-delay="2">
            <input type="text" id="wish-name" className="form-input" placeholder="Nama kamu..." />
            <textarea id="wish-text" className="form-input" placeholder="Tulis ucapan dan doa terbaikmu di sini..." />
            <button className="btn-open" style={{ width: '100%', justifyContent: 'center' }} data-onclick="submitWishForm()">
              ✉ Kirim Ucapan
            </button>
          </div>

          <div className="wishes-list" data-reveal="up">
            {configData.initialWishes.map((w, i) => (
              <div key={i} className="wish-bubble" data-reveal="up" data-delay={i % 3 as number}>
                <p className="wish-bubble-name">{w.name}</p>
                <p className="wish-bubble-text">"{w.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ CLOSING ══════════ */}
        <section id="closing" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80" alt="" className="story-parallax-bg" data-parallax="0.2" />
          <div className="story-overlay" style={{ background: 'linear-gradient(to bottom, rgba(240,232,224,0.7), rgba(240,232,224,0.92))' }}></div>

          <img src="/assets/frame-baroque.png" alt="" className="closing-frame" style={{ zIndex: 3 }} />
          <img src="/assets/flowers-left.png" alt="" className="section-flowers" data-reveal="left"
            style={{ position: 'absolute', bottom: '0', left: '-8%', width: 'clamp(200px,38%,380px)', zIndex: 4, opacity: 0.8 }} />
          <img src="/assets/flowers-right.png" alt="" className="section-flowers" data-reveal="right"
            style={{ position: 'absolute', bottom: '0', right: '-8%', width: 'clamp(200px,35%,350px)', zIndex: 4, opacity: 0.8 }} />

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '4rem' }}>
            <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{ width: '180px', marginBottom: '1.5rem' }} data-reveal="fade" />
            <p className="closing-message" data-reveal="up" style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
            </p>
            <h2 className="closing-couple shimmer-name" data-reveal="scale" data-delay="1" style={{ fontSize: '3.8rem', margin: '0.2rem 0' }}>
              {configData.bride.nickname} &amp; {configData.groom.nickname}
            </h2>
            <FloralDividerSVG />

            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '2.5rem' }} data-reveal="fade" data-delay="2">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh
            </p>

            <button className="btn-open" style={{ margin: '0 auto' }} data-onclick="shareInvitation()" data-reveal="up" data-delay="3">
              <span style={{ marginRight: '8px' }}>🔗</span> Bagikan Undangan
            </button>
          </div>

          <footer className="watermark-footer" data-reveal="fade" data-delay="4" style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', textAlign: 'center', zIndex: 10 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#C8A882', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>
              Created with <span style={{ color: '#8B4A58' }}>♥</span> by <strong style={{ color: '#8B4A58', fontWeight: '700' }}>Ackmad Elfan Purnama</strong>
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(200, 168, 130, 0.7)', margin: '0' }}>
              Digital Wedding Invitation © 2026
            </p>
          </footer>
        </section>

      </div>
    </>
  );
}
