"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "./globals.css";
import configData from "../data/weddingConfig.json";
import SplashSection from "../components/SplashSection";
import confetti from "canvas-confetti";
import { addWish, subscribeToWishes } from "@/lib/firestore";

export default function WeddingPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const pathParams = useParams();
  const searchParams = useSearchParams();

  /* ── GUESTBOOK LOGIC ── */
  const [wishes, setWishes] = useState<any[]>([]);
  const [wishFilter, setWishFilter] = useState("Semua");
  const [wishPage, setWishPage] = useState(1);
  const [isWishesLoading, setIsWishesLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [formAttendance, setFormAttendance] = useState("Hadir");

  const PER_PAGE = 5;

  useEffect(() => {
    // Subscribe to wishes from Firestore in real-time
    const unsubscribe = subscribeToWishes((updatedWishes) => {
      if (updatedWishes.length > 0) {
        setWishes(updatedWishes);
      } else {
        // Fallback to initial wishes if Firestore is empty
        const initialRaw = (configData.initialWishes as any[]).map(w => ({ ...w, timestamp: Date.now() - Math.random() * 100000000 }));
        setWishes(initialRaw);
      }
      setIsWishesLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredWishes = wishes.filter(w => {
    if (wishFilter === "Semua") return true;
    if (wishFilter === "Hadir") return w.attendance === "Hadir";
    if (wishFilter === "Doa") return true; // Show all for "Doa" or specific logic
    return true;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const paginatedWishes = filteredWishes.slice((wishPage - 1) * PER_PAGE, wishPage * PER_PAGE);
  const totalPages = Math.ceil(filteredWishes.length / PER_PAGE);

  const handleSendWish = async () => {
    if (!formName || !formText) return;

    try {
      const newWish = {
        name: formName,
        text: formText,
        attendance: formAttendance,
      };

      // Save to Firestore
      await addWish(newWish);

      setFormName("");
      setFormText("");

      // WhatsApp Redirect
      const text = `Halo, saya ${formName}.\n\n"${formText}"\n\nStatus: ${formAttendance}`;
      window.open(`https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    } catch (error) {
      alert("Gagal mengirim ucapan. Silakan coba lagi.");
    }
  };

  const getRelativeTime = (ts: number) => {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
    return `${Math.floor(diff / 86400)} hari yang lalu`;
  };

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
      colors: ['#0A0A0A', '#6B6B6B', '#FFFFFF', '#ABABAB']
    });
  };

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

  /* ── PARALLAX COMPONENT ── */
  const SectionBackground = ({ src, factor = 0.3, style, overlayStyle }: { src: string, factor?: number, style?: React.CSSProperties, overlayStyle?: React.CSSProperties }) => (
    <div className="section-bg-wrapper">
      <img src={src} alt="" className="section-bg-image js-parallax" data-factor={factor} style={style} />
      <div className="section-overlay" style={overlayStyle}></div>
    </div>
  );

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (!isOpened) {
      document.body.classList.add('locked');
    }

    const namaFromPath = pathParams?.guestName as string;
    const namaFromSearch = searchParams.get('tamu') || searchParams.get('to');

    if (namaFromPath) {
      // Decode and replace common URL separators with spaces
      const formattedName = decodeURIComponent(namaFromPath).replace(/[-_]/g, ' ');
      setGuestName(formattedName);
      setFormName(formattedName);
    } else if (namaFromSearch) {
      const formattedName = decodeURIComponent(namaFromSearch);
      setGuestName(formattedName);
      setFormName(formattedName);
    }

    /* Scroll Reveal - Repeatable animate in and out (Fade In & Fade Out) */
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
        } else {
          // Removes class when element scrolls out of view, triggering fade-out animation
          e.target.classList.remove('revealed');
        }
      });
    }, { threshold: 0.1 });
    
    // Function to observe all elements with [data-reveal]
    const observeAll = () => {
      document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
    };

    observeAll();

    /* Parallax (SCROLL-DRIVEN BACKGROUND MOVEMENT) */
    const parallaxItems = document.querySelectorAll<HTMLElement>('.js-parallax');
    let ticking = false;
    const isMobile = window.innerWidth <= 768;

    const handleParallax = () => {
      if (isMobile || !isOpened) return;

      const scrollY = window.scrollY;
      parallaxItems.forEach(el => {
        const section = el.closest('section');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          const factor = parseFloat(el.dataset.factor || '0.3');
          const sectionTop = section.offsetTop;
          const offset = (scrollY - sectionTop) * factor;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleParallax);
        ticking = true;
      }
    };

    if (!isMobile) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Sparkles & Petal rain (Keep as is) */
    document.querySelectorAll('.has-sparkles').forEach(s => {
      (s as HTMLElement).style.position = 'relative';
      for (let i = 0; i < 5; i++) createSparkle(s as HTMLElement);
    });

    const pc = document.createElement('div');
    pc.id = 'petal-container';
    pc.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:997;overflow:hidden;';
    document.body.appendChild(pc);
    for (let i = 0; i < 5; i++) createPetal(pc);

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
    const sections = ['hero', 'profil', 'love-story', 'acara', 'galeri', 'amplop', 'buku-tamu', 'closing'];
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

    /* Confetti on closing */
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
      closingObs.disconnect();
      document.getElementById('petal-container')?.remove();
    };
  }, [isOpened]);

  // Re-observe dynamic revealed elements whenever wishes or page changes
  useEffect(() => {
    if (!isOpened) return;
    
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, [isOpened, wishPage, wishes, wishFilter]);

  const openInvitation = () => {
    setIsOpened(true);
    document.body.classList.remove('locked');
    document.getElementById('splash')?.classList.add('hide');
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          document.getElementById('music-btn')?.classList.add('playing');
        }).catch(() => { });
      }
    }
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
      <line x1="0" y1="15" x2="95" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      <path d="M115 15 Q125 5 135 15 Q145 25 155 15 Q165 5 175 15" stroke="rgba(255,255,255,0.6)" strokeWidth="0.9" fill="none" />
      <circle cx="135" cy="15" r="2.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="105" cy="15" r="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="185" cy="15" r="1.5" fill="rgba(255,255,255,0.3)" />
      <line x1="205" y1="15" x2="300" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
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
        else if (action.includes('confirmGiftWA()')) confirmGiftWA();
        else if (action.includes('submitWishForm()')) submitWishForm();
        else if (action.includes('shareInvitation()')) shareInvitation();
        else if (action.includes('openLightbox')) { const m = action.match(/'([^']+)'/); if (m?.[1]) openLightbox(m[1]); }
        else if (action.includes('copyRekening')) { const m = action.match(/'([^']+)'/); if (m?.[1]) copyRekening(m[1]); }
        else if (action.includes('toggleMusic()')) {
          const audio = document.getElementById('bg-music') as HTMLAudioElement;
          const btn = document.getElementById('music-btn');
          if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                btn?.classList.add('playing');
              }).catch(() => { });
            }
          } else {
            audio.pause();
            btn?.classList.remove('playing');
          }
        }
        else if (action.includes('scrollToSection')) { const m = action.match(/'([^']+)'/); if (m?.[1]) document.getElementById(m[1])?.scrollIntoView({ behavior: 'smooth' }); }
      }}>

        <button id="music-btn" data-onclick="toggleMusic()" aria-label="Play/Pause musik" title="Musik" style={{ opacity: isOpened ? 1 : 0, transition: 'opacity 1s ease 0.8s', pointerEvents: isOpened ? 'auto' : 'none' }}>♪</button>
        <audio id="bg-music" loop preload="none">
          <source src="/music/music.mp3" type="audio/mpeg" />
        </audio>

        <nav id="dot-nav" aria-label="Section navigation" style={{ opacity: isOpened ? 1 : 0, pointerEvents: isOpened ? 'auto' : 'none', transition: 'opacity 1s ease 0.8s' }}>
          {['hero', 'profil', 'love-story', 'acara', 'galeri', 'amplop', 'buku-tamu', 'closing'].map((id, i) => (
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
        <section id="hero" className="section-with-bg has-sparkles">
          <SectionBackground src="/assets/photo/photo1-trans.png" factor={0.2} />

          <div className="glass-morphism glass-container-content" style={{ position: 'relative', zIndex: 5, textAlign: 'center', width: '92%', maxWidth: '820px' }} data-reveal="fade">
            <h1 className="hero-names text-white text-shadow-premium" style={{ marginBottom: '1rem' }}>{configData.bride.nickname} &amp; {configData.groom.nickname}</h1>

            <div className="hero-quote-box" style={{ background: 'transparent', border: 'none' }}>
              <p className="hero-quote text-white">
                {configData.hero.quote}
              </p>
              <p className="hero-verse text-white" style={{ opacity: 0.8 }}>{configData.hero.verse}</p>
            </div>

            <div className="countdown-wrapper" style={{ margin: '1.5rem 0' }}>
              {['days', 'hours', 'minutes', 'seconds'].map(u => (
                <div key={u} className={`flip-unit flip-${u}`}>
                  <div className="flip-card"><span className="flip-value">00</span></div>
                  <span className="flip-label text-white" style={{ opacity: 0.7 }}>{u}</span>
                </div>
              ))}
            </div>

            <div className="calendar-btns">
              <a href={configData.weddingInfo.calendarGoogleLink}
                target="_blank" rel="noreferrer" className="btn-calendar" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>📅 Google Calendar</a>
              <a href={configData.weddingInfo.calendarIcsDownload}
                download="wedding.ics" className="btn-calendar" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>🗓 Save to Calendar</a>
            </div>
          </div>
        </section>

        {/* ══════════ PROFIL ══════════ */}
        <section id="profil" className="section-with-bg has-sparkles">
          <SectionBackground src="/assets/photo/photo2-trans.png" factor={0.25} style={{ objectPosition: '80% 20%' }} />

          <div style={{ position: 'relative', zIndex: 5, width: '100%' }}>
            <h2 className="section-title text-white text-shadow-premium" data-reveal="up">Mempelai Berbahagia</h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', marginBottom: '3.5rem', textAlign: 'center' }} data-reveal="fade">
              Assalamu'alaikum Warahmatullahi Wabarakatuh
            </p>

            <div className="profil-joint-container" data-reveal="fade">
              <div className="profil-photo-joint-wrap">
                {/* Vintage Rose Top Left */}
                <svg className="cute-vector vector-tl" viewBox="0 0 100 100" style={{ top: '3%', left: '-12%', width: '65px' }}>
                  <path d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z" fill="#E8C5CC" opacity="0.6" />
                  <path d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15 Z" fill="#8B4A58" opacity="0.4" />
                </svg>

                {/* Gold Sparkle Top Right */}
                <svg className="cute-vector vector-tr" viewBox="0 0 100 100" style={{ top: '-8%', right: '-5%', width: '45px' }}>
                  <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="#C8A882" />
                </svg>

                {/* Romantic Heart Bottom Left */}
                <svg className="cute-vector vector-bl" viewBox="0 0 100 100" style={{ bottom: '10%', left: '-10%', width: '50px' }}>
                  <path d="M50 30 C50 10 20 10 20 30 C20 50 50 80 50 80 C50 80 80 50 80 30 C80 10 50 10 50 30 Z" fill="#C07A8A" />
                </svg>

                {/* Soft Sparkle Bottom Right */}
                <svg className="cute-vector vector-br" viewBox="0 0 100 100" style={{ bottom: '-3%', right: '8%', width: '40px' }}>
                  <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="#E8D5B0" />
                </svg>

                <div className="profil-photo-inner joint-frame">
                  <img src="/assets/photo/photo1-trans.png" alt="Mempelai" />
                </div>
              </div>

              <div className="profil-names-joint">
                <div className="profil-card-mini glass-morphism glass-container-content" style={{ borderRadius: '20px' }} data-reveal="left">
                  <h3 className="profil-name-mini text-white">{configData.bride.fullName}</h3>
                  <p className="profil-parent-mini" style={{ whiteSpace: 'pre-line' }}>{configData.bride.parents}</p>
                  <a href={configData.bride.instagramLink} className="profil-ig-mini" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '50px' }}>📸 {configData.bride.instagram}</a>
                </div>

                <div className="profil-divider-mini text-white" style={{ opacity: 0.8 }} data-reveal="scale">&amp;</div>

                <div className="profil-card-mini glass-morphism glass-container-content" style={{ borderRadius: '20px' }} data-reveal="right">
                  <h3 className="profil-name-mini text-white">{configData.groom.fullName}</h3>
                  <p className="profil-parent-mini" style={{ whiteSpace: 'pre-line' }}>{configData.groom.parents}</p>
                  <a href={(configData.groom as any).tiktokLink} className="profil-ig-mini" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '50px' }}>📸 {(configData.groom as any).tiktok}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ LOVE STORY ══════════ */}
        <section id="love-story" className="section-with-bg">
          <SectionBackground src="/assets/photo/photo3-trans.png" factor={0.2} />

          <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title text-white text-shadow-premium" data-reveal="up">Kisah Cinta Kami</h2>
            <p className="love-story-intro text-white" style={{ opacity: 0.9, marginBottom: '4rem' }} data-reveal="fade">
              Bagaimana takdir mempertemukan dua hati yang selalu mencari satu sama lain...
            </p>

            <div className="timeline" style={{ maxWidth: '800px', width: '100%', zIndex: 5, position: 'relative' }}>
              {configData.loveStory.map((item, i) => (
                <div key={i} className="timeline-item" data-reveal={item.dir}>
                  <div className="timeline-dot" style={{ background: 'rgba(255,255,255,0.1)', borderColor: '#FFFFFF', color: '#FFFFFF' }}>{item.icon}</div>
                  <div className="timeline-content glass-morphism glass-container-content" style={{ borderRadius: '16px', borderLeft: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p className="timeline-date text-white" style={{ opacity: 0.8 }}>{item.date}</p>
                    <h4 className="timeline-title text-white">{item.title}</h4>
                    <p className="timeline-text text-white" style={{ opacity: 0.85 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ ACARA ══════════ */}
        <section id="acara" className="section-with-bg has-sparkles">
          <SectionBackground src="/assets/photo/photo4-trans.png" factor={0.15} />

          <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title text-white text-shadow-premium" data-reveal="up">Waktu &amp; Tempat</h2>

            <div className="event-cards">
              {configData.events.map((ev, i) => (
                <React.Fragment key={i}>
                  <div className="event-card glass-morphism glass-container-content" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden' }} data-reveal={ev.dir}>
                    <div className="event-card-header" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <h3 className="event-name text-white">{ev.type}</h3>
                    </div>
                    <div className="event-card-body">
                      <p className="event-datetime text-white" style={{ fontWeight: 600 }}>{ev.dateStr}</p>
                      <div className="event-time-ornaments text-white" style={{ opacity: 0.8 }}>
                        <span>✦</span> {ev.timeStr} <span>✦</span>
                      </div>
                      <p className="event-venue text-white" style={{ whiteSpace: 'pre-line', opacity: 0.9 }}>
                        <strong className="text-white">{ev.venueName}</strong><br />
                        {ev.venueAddress}
                      </p>
                      <a href={ev.mapsLink} target="_blank" rel="noreferrer" className="btn-maps btn-open" style={{ width: '100%', justifyContent: 'center' }}>
                        Lihat Lokasi
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ GALERI ══════════ */}
        <section id="galeri" className="section-with-bg" style={{ background: '#0a0a0a' }}>
          <SectionBackground 
            src="/assets/photo/photo4.jpeg" 
            factor={0.12} 
            overlayStyle={{ background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.8) 0%, rgba(15, 15, 15, 0.95) 100%)' }} 
          />
          <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title text-white text-shadow-premium" data-reveal="up">Galeri Bahagia</h2>
            <p className="galeri-caption text-white" style={{ opacity: 0.75, textAlign: 'center', marginBottom: '3rem' }} data-reveal="fade">
              Momen indah yang tertangkap dalam lensa...
            </p>
            <div className="galeri-masonry" style={{ maxWidth: '960px', width: '100%' }}>
              {dummyPhotos.map((src, i) => (
                <div key={i} className="galeri-item glass-morphism glass-container-content"
                  data-reveal="fade" data-delay={i % 3}
                  data-onclick={`openLightbox('${src}')`}>
                  <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <div id="lightbox" role="dialog" aria-modal="true" data-onclick="closeLightbox()">
          <span id="lightbox-close">✕</span>
          <img id="lightbox-img" src={undefined} alt="Foto" />
        </div>


        {/* ══════════ AMPLOP ══════════ */}
        <section id="amplop" className="section-with-bg">
          <SectionBackground
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=80"
            factor={0.25}
            overlayStyle={{ background: 'linear-gradient(to bottom, rgba(142, 175, 210, 0.92) 0%, rgba(110, 148, 186, 0.96) 100%)' }}
          />

          <div style={{ position: 'relative', zIndex: 5, width: '100%', textAlign: 'center' }}>
            <h2 className="section-title text-white text-shadow-premium">Kado Pernikahan</h2>

            <div className="rekening-cards">
              {configData.bankAccounts.map((acc, i) => (
                <div key={i} className="rekening-card glass-morphism glass-container-content" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }} data-reveal={acc.dir}>
                  <p className="bank-name text-white">{acc.bank}</p>
                  <p className="rek-number text-white" style={{ fontSize: '1.8rem' }}>{acc.numberFormatted}</p>
                  <p className="rek-owner text-white" style={{ opacity: 0.8 }}>{acc.owner}</p>
                  <button className="btn-copy btn-open" style={{ padding: '8px 20px', fontSize: '0.85rem' }} data-onclick={`copyRekening('${acc.number}')`}>📋 Salin</button>
                </div>
              ))}
            </div>

            <button className="btn-open" data-onclick="confirmGiftWA()" data-reveal="up">
              Konfirmasi via WhatsApp
            </button>
          </div>
        </section>

        {/* ══════════ BUKU TAMU ══════════ */}
        <section id="buku-tamu" className="section-with-bg has-sparkles" style={{ padding: '6rem 2rem' }}>
          <SectionBackground src="/assets/photo/photo3-trans.png" factor={0.15} />

          <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-reveal="fade">
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>WEDDING OF {configData.bride.nickname} & {configData.groom.nickname}</p>
              <h2 className="section-title text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: 0 }}>Ucapan & Doa</h2>
            </div>

            <div className="guestbook-grid">
              {/* Panel Kiri: Form */}
              <div className="guestbook-panel" data-reveal="left">
                <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>Tulis Ucapanmu</p>

                <div className="form-field" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, marginBottom: '8px', display: 'block' }}>NAMA</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nama lengkap kamu..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, marginBottom: '8px', display: 'block' }}>UCAPAN & DOA</label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="Tuliskan doa dan harapanmu untuk kami di sini..."
                    maxLength={500}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '140px' }}
                  />
                  <div className="form-char-counter">{formText.length} / 500 karakter</div>
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, marginBottom: '8px', display: 'block', marginTop: '1.5rem' }}>KEHADIRAN</label>
                  <div className="attendance-chips">
                    <div className={`chip ${formAttendance === 'Hadir' ? 'active' : ''}`} onClick={() => setFormAttendance('Hadir')}>
                      <span>✓</span> Hadir
                    </div>
                    <div className={`chip ${formAttendance === 'Tidak Hadir' ? 'active' : ''}`} onClick={() => setFormAttendance('Tidak Hadir')}>
                      <span>✕</span> Tidak Hadir
                    </div>
                  </div>
                </div>

                <button className="btn-open" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={handleSendWish}>
                  ✉ Kirim Ucapan
                </button>
                <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '1.25rem', lineHeight: '1.5' }}>
                  Ucapanmu akan langsung tampil<br />di halaman ini setelah terkirim
                </p>
              </div>

              {/* Panel Kanan: Feed */}
              <div className="guestbook-panel" data-reveal="right" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Ucapan Tamu</p>
                      <div className="live-indicator">
                        <span className="live-dot"></span>
                        LIVE
                      </div>
                    </div>
                    <div className="filter-tabs" style={{ minWidth: '220px', marginBottom: 0 }}>
                      {['Semua', 'Hadir', 'Doa'].map(f => (
                        <div key={f} className={`filter-tab ${wishFilter === f ? 'active' : ''}`} onClick={() => { setWishFilter(f); setWishPage(1); }}>{f}</div>
                      ))}
                    </div>
                  </div>

                  <div className="stat-pills">
                    <div className="stat-pill">
                      <span className="stat-pill-val">{wishes.length}</span>
                      <span className="stat-pill-label">Ucapan</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-pill-val">{wishes.filter(w => w.attendance === 'Hadir').length}</span>
                      <span className="stat-pill-label">Hadir</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-pill-val">{wishes.filter(w => w.attendance !== 'Hadir').length}</span>
                      <span className="stat-pill-label">Tidak Hadir</span>
                    </div>
                  </div>

                  <div className="wishes-feed" style={{ minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                      {isWishesLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {[1, 2, 3].map(i => (
                            <div key={i} className="comment-card skeleton" style={{ height: '120px' }} />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`${wishPage}-${wishFilter}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          {paginatedWishes.map((w, i) => (
                            <div key={i} className="comment-card">
                              <div className="comment-header">
                                <div className="comment-avatar">{(w.name || 'T').substring(0, 2).toUpperCase()}</div>
                                <div className="comment-info">
                                  <h4 className="comment-name text-white">{w.name}</h4>
                                  <span className="comment-time">{getRelativeTime(w.timestamp)}</span>
                                </div>
                                <span className={`comment-badge ${w.attendance === 'Hadir' ? 'hadir' : 'doa'}`}>{w.attendance === 'Hadir' ? 'Hadir' : 'Doa'}</span>
                              </div>
                              <p className="comment-text">"{w.text}"</p>
                            </div>
                          ))}
                          {paginatedWishes.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>Belum ada ucapan untuk kategori ini.</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pagination-container">
                  <span className="pag-info">Hal. {wishPage} dari {totalPages || 1}</span>

                  <div className="pag-dots">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className={`pag-dot ${wishPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setWishPage(i + 1)}
                      />
                    ))}
                    {totalPages > 5 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>...</span>}
                  </div>

                  <div className="pag-btns">
                    <button className="pag-btn" disabled={wishPage === 1} onClick={() => setWishPage(p => p - 1)}>
                      ‹
                    </button>
                    <button className="pag-btn" disabled={wishPage === totalPages || totalPages === 0} onClick={() => setWishPage(p => p + 1)}>
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ CLOSING ══════════ */}
        <section id="closing" className="section-with-bg">
          <SectionBackground src="/assets/photo/photo1-trans.png" factor={0.2} />

          <div className="glass-morphism glass-container-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '92%', maxWidth: '800px', borderRadius: '32px' }} data-reveal="up">
            <p className="closing-message text-white">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
            </p>
            <h2 className="closing-couple text-white text-shadow-premium" style={{ fontSize: '3.8rem', margin: '1rem 0' }}>
              {configData.bride.nickname} &amp; {configData.groom.nickname}
            </h2>

            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
              Wassalamu'alaikum Warahmatullahi Wabarakatuh
            </p>

            <button className="btn-open" style={{ margin: '0 auto' }} data-onclick="shareInvitation()">
              Bagikan Undangan
            </button>
          </div>

          <footer className="watermark-footer" data-reveal="fade" style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', textAlign: 'center', zIndex: 10 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#FFFFFF', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 5px 0', opacity: 0.8 }}>
              Created with ♥ by <a href="https://ackmad.vercel.app" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', color: '#FFF', textDecoration: 'none', borderBottom: '1px dotted rgba(255,255,255,0.5)', paddingBottom: '2px', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={(e) => e.currentTarget.style.color = '#FFF'}>Ackmad Elfan Purnama</a>
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', margin: '0' }}>
              Digital Wedding Invitation © 2026 • v1.2.4
            </p>
          </footer>
        </section>

      </div>
    </>
  );
}
