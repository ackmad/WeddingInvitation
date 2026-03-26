"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";

export default function WeddingPage() {
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  
  const CONFIG = {
    groomName:   'Usamah',
    brideName:   'Naira',
    weddingDate: '2026-03-29T08:00:00',
    waNumber:    '6281234567890',
  };

  const createSparkle = (container: HTMLElement) => {
    const sparkle = document.createElement('img');
    sparkle.src = '/assets/sparkle-star.svg';
    sparkle.classList.add('sparkle');
    const size = Math.random() * 25 + 10;
    const x = Math.random() * 95 + 2;
    const y = Math.random() * 95 + 2;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 1;
    sparkle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      opacity: 0;
      pointer-events: none;
      animation: sparkleTwinkle ${duration}s ease-in-out ${delay}s infinite;
      z-index: 2;
    `;
    container.appendChild(sparkle);
  };

  const createPetal = (container: HTMLElement) => {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = Math.random() * 25 + 15;
    const startX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
    const duration = Math.random() * 5 + 6;
    const delay = Math.random() * 5;
    const sway = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 360;

    petal.style.cssText = `
      position: fixed;
      top: -60px;
      left: ${startX}px;
      width: ${size}px;
      height: ${size}px;
      background-image: url('/assets/petal-single.png');
      background-size: contain;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: 999;
      transform: rotate(${rotation}deg);
      animation: petalFall ${duration}s ease-in ${delay}s forwards;
      --sway: ${sway}px;
    `;
    container.appendChild(petal);
    setTimeout(() => {
      petal.remove();
      if (document.getElementById('petal-container')) createPetal(container);
    }, (duration + delay) * 1000 + 500);
  };

  useEffect(() => {
    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Initial scroll lock
    if (!isOpened) {
      document.body.classList.add('locked');
    }

    // Personalisasi nama tamu
    const params = new URLSearchParams(window.location.search);
    const nama = params.get('tamu');
    if (nama) {
      const el = document.getElementById('guest-name');
      if (el) el.textContent = nama;
    }

    // Scroll Reveal Logic
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });

    // Sparkles
    const initSparkles = () => {
      document.querySelectorAll('.has-sparkles').forEach(section => {
        (section as HTMLElement).style.position = 'relative';
        for (let i = 0; i < 15; i++) {
          createSparkle(section as HTMLElement);
        }
      });
    };
    initSparkles();

    // Petal Rain
    const initPetalRain = () => {
      const container = document.createElement('div');
      container.id = 'petal-container';
      container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;overflow:hidden;';
      document.body.appendChild(container);
      for (let i = 0; i < 15; i++) {
        createPetal(container);
      }
    };
    initPetalRain();

    // Parallax & Flower animations
    const handleParallax = () => {
      if (!isOpened) return;
      const scrollY = window.scrollY;
      
      // Background parallax
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || "0.3");
        (el as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
      });

      // Flower drifting animation based on scroll
      document.querySelectorAll('.section-flowers').forEach((el, i) => {
        const drift = Math.sin(scrollY * 0.002 + i) * 15;
        (el as HTMLElement).style.transform = `translateX(${drift}px) translateY(${scrollY * -0.05}px)`;
      });
    };
    window.addEventListener('scroll', handleParallax, { passive: true });

    // Floating Animations
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      const duration = parseFloat((el as HTMLElement).dataset.float || "4");
      const delay = i * 0.5;
      (el as HTMLElement).style.animation = `floatUpDown ${duration}s ease-in-out ${delay}s infinite`;
    });

    // Flower Entrance (Splash)
    const flowersLeft = document.querySelector('.flowers-left');
    const flowersRight = document.querySelector('.flowers-right');
    if (flowersLeft) setTimeout(() => flowersLeft.classList.add('flowers-entered'), 300);
    if (flowersRight) setTimeout(() => flowersRight.classList.add('flowers-entered'), 500);

    // Flip Clock
    const target = new Date(CONFIG.weddingDate).getTime();
    const clockInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) return;

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const units = { days, hours, minutes, seconds };

      Object.entries(units).forEach(([unit, val]) => {
        const el = document.querySelector(`.flip-${unit}`);
        if (!el) return;
        const valStr = String(val).padStart(2, '0');
        const current = el.querySelector('.flip-value');
        if (current && current.textContent !== valStr) {
          el.classList.add('flipping');
          setTimeout(() => {
            if (current) current.textContent = valStr;
            el.classList.remove('flipping');
          }, 300);
        }
      });
    }, 1000);

    // Dot Nav Dots Sync
    const sections = ['splash','hero','profil','love-story','acara','galeri','rsvp','amplop','buku-tamu','closing'];
    const dots = document.querySelectorAll('.dot-item');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target.id);
          dots.forEach(d => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleParallax);
      clearInterval(clockInterval);
      revealObserver.disconnect();
      sectionObserver.disconnect();
      const pc = document.getElementById('petal-container');
      if (pc) pc.remove();
    };
  }, [isOpened]);

  const openInvitation = () => {
    setIsOpened(true);
    document.body.classList.remove('locked');
    const splash = document.getElementById('splash');
    if(splash) splash.classList.add('hide');
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play().catch(() => {});
      document.getElementById('music-btn')?.classList.add('playing');
    }
    setTimeout(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
      if(splash) splash.style.display = 'none';
      if((window as any).launchConfetti) (window as any).launchConfetti();
    }, 850);
  };

  const openLightbox = (src: string) => {
    const img = document.getElementById('lightbox-img') as HTMLImageElement;
    if (img) img.src = src;
    document.getElementById('lightbox')?.classList.add('open');
  };

  const closeLightbox = () => {
    document.getElementById('lightbox')?.classList.remove('open');
  };

  const submitRSVPForm = () => {
    const name = (document.getElementById('rsvp-name') as HTMLInputElement)?.value.trim();
    if (!name) { alert('Mohon isi nama terlebih dahulu.'); return; }
    if (!selectedAttendance) { alert('Mohon pilih konfirmasi kehadiran.'); return; }
    const msg = encodeURIComponent(`Halo, saya ${name} ingin konfirmasi kehadiran: ${selectedAttendance}. Terima kasih!`);
    window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
  };

  const copyRekening = (nomor: string) => {
    navigator.clipboard.writeText(nomor).then(() => {
      alert('Nomor rekening ' + nomor + ' tersalin!');
    });
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
      navigator.share({
        title : `The Wedding of ${CONFIG.brideName} & ${CONFIG.groomName}`,
        text  : `Kamu diundang ke pernikahan ${CONFIG.brideName} & ${CONFIG.groomName} 🌸`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link undangan berhasil disalin!');
      });
    }
  };

  const dummyPhotos = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465495910483-0d6745778274?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1522673607200-164883eecd4c?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <>
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute("data-onclick") || target.parentElement?.getAttribute("data-onclick");
        if(action) {
           if(action.includes('openInvitation()')) openInvitation();
           else if(action.includes('closeLightbox()')) closeLightbox();
           else if(action.includes('submitRSVPForm()')) submitRSVPForm();
           else if(action.includes('confirmGiftWA()')) confirmGiftWA();
           else if(action.includes('submitWishForm()')) submitWishForm();
           else if(action.includes('shareInvitation()')) shareInvitation();
           else if(action.includes('openLightbox')) {
             const m = action.match(/'([^']+)'/);
             if(m && m[1]) openLightbox(m[1]);
           } else if(action.includes('copyRekening')) {
             const m = action.match(/'([^']+)'/);
             if(m && m[1]) copyRekening(m[1]);
           } else if(action.includes('selectAttendance')) {
             const m = action.match(/'([^']+)'/);
             if(m && m[1]) {
               document.querySelectorAll('.att-option').forEach(o => o.classList.remove('selected'));
               target.classList.add('selected');
               setSelectedAttendance(m[1]);
             }
           }
        }
      }}>
        
        <button id="music-btn" aria-label="Play/Pause musik" title="Musik">♪</button>
        <audio id="bg-music" loop preload="none">
          <source src="/assets/music-background.mp3" type="audio/mpeg"/>
        </audio>

        <nav id="dot-nav" aria-label="Section navigation">
          {['splash','hero','profil','love-story','acara','galeri','rsvp','amplop','buku-tamu','closing'].map((id, i) => (
            <div key={id} className={`dot-item ${i===0?'active':''}`} data-target={id} title={id.toUpperCase()}></div>
          ))}
        </nav>

        <div className="corner-ornament corner-tl baroque-corner"></div>
        <div className="corner-ornament corner-tr baroque-corner"></div>
        <div className="corner-ornament corner-bl baroque-corner"></div>
        <div className="corner-ornament corner-br baroque-corner"></div>


        <section id="splash" className="has-sparkles">
          <img src="/assets/bg-architecture.jpg" alt="" className="bg-architecture" data-parallax="0.15" />
          <img src="/assets/flowers-left.png" alt="" className="flowers-left section-flowers" />
          <img src="/assets/flowers-right.png" alt="" className="flowers-right section-flowers" />

          <div style={{position: "relative", zIndex: 10, textAlign: "center", maxWidth: "900px", padding: '0 20px'}}>
            <p className="wedding-of" data-reveal="fade">The Wedding of</p>
            <h1 className="main-title" data-reveal="up" data-delay="1">
              Naira <span style={{fontSize: "0.5em", color: "var(--gold)"}}>&</span><br />
              Usamah
            </h1>
            <p className="splash-date" data-reveal="up" data-delay="2">29 . 03 . 2026</p>
            
            <p className="splash-for" data-reveal="up" data-delay="4" style={{fontSize: '1.2rem'}}>Dear,</p>
            <p className="splash-guest-name" data-reveal="up" data-delay="4" id="guest-name">Tamu Undangan</p>
            
            <div data-reveal="up" data-delay="5" style={{marginTop: '2rem'}}>
              <button className="btn-open" data-onclick="openInvitation()">
                ✉ Buka &amp; Baca Kisah Kami
              </button>
            </div>
          </div>

          <img src="/assets/flowers-bottom.png" alt="" className="flowers-bottom section-flowers" />
        </section>


        <section id="hero" className="has-sparkles" style={{background: 'linear-gradient(to bottom, var(--warm-cream), var(--off-white))'}}>
          <img src="/assets/castle-pink.png" alt="Kastil" className="castle-hero" data-reveal="fade" data-float="4" style={{width: 'min(650px, 95vw)'}}/>

          <div className="hero-content" style={{textAlign: 'center', maxWidth: '800px'}}>
            <h1 className="hero-names" data-reveal="up" style={{fontSize: 'clamp(4rem, 15vw, 6.5rem)', marginBottom: '1.5rem'}}>Naira & Usamah</h1>
            <p className="hero-quote" data-reveal="up" style={{fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--rose-dark)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.8'}}>
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
            </p>
            <p className="hero-verse" data-reveal="fade" data-delay="1" style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.2em'}}>AR-RUM: 21</p>
          </div>
        </section>


        <section id="profil" className="has-sparkles">
          <img src="/assets/flowers-left.png" alt="" className="section-flowers" style={{position: 'absolute', top: '-10%', left: '-10%', width: '30%', transform: 'rotate(-45deg)'}} />
          <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{width: '200px', marginBottom: "3rem"}} data-reveal="fade"/>
          
          <h2 className="section-title" data-reveal="up">Mempelai Berbahagia</h2>
          <p className="section-subtitle" data-reveal="fade" data-delay="1" style={{textAlign: 'center', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '4rem', color: 'var(--text-muted)'}}>
            Assalamu’alaikum Warahmatullahi Wabarakatuh
          </p>

          <div className="profil-grid" style={{width: '100%', maxWidth: '1000px'}}>
            <div className="profil-card" data-reveal="left" style={{textAlign: 'center'}}>
              <div style={{width: '280px', height: '280px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '8px solid var(--gold-light)', boxShadow: '0 15px 35px rgba(0,0,0,0.1)'}}>
                 <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" alt="Naira" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
              </div>
              <h3 className="profil-name" style={{fontSize: '2.5rem', marginTop: '2rem'}}>Naira Ashalina</h3>
              <p className="profil-parent" style={{fontSize: '1.2rem', margin: '1rem 0'}}>
                Putri tercinta dari Bapak Ahmad <br /> &amp; Ibu Siti Rahma
              </p>
              <a href="#" className="profil-ig" style={{fontSize: '1.1rem', color: 'var(--rose-dark)', fontWeight: 600}}>@naira_ashalina</a>
            </div>

            <div className="profil-divider" data-reveal="fade" data-delay="2" style={{fontSize: '5rem', color: 'var(--pink-light)'}}>&amp;</div>

            <div className="profil-card" data-reveal="right" style={{textAlign: 'center'}}>
              <div style={{width: '280px', height: '280px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '8px solid var(--gold-light)', boxShadow: '0 15px 35px rgba(0,0,0,0.1)'}}>
                <img src="https://images.unsplash.com/photo-1550005816-09246d37748b?auto=format&fit=crop&w=400&q=80" alt="Usamah" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
              </div>
              <h3 className="profil-name" style={{fontSize: '2.5rem', marginTop: '2rem'}}>Usamah Al-Fatih</h3>
              <p className="profil-parent" style={{fontSize: '1.2rem', margin: '1rem 0'}}>
                Putra tercinta dari Bapak Yusuf <br /> &amp; Ibu Laila Noor
              </p>
              <a href="#" className="profil-ig" style={{fontSize: '1.1rem', color: 'var(--rose-dark)', fontWeight: 600}}>@usamah.fatih</a>
            </div>
          </div>
        </section>


        <section id="love-story" style={{background: 'var(--warm-cream)'}}>
          <h2 className="section-title" data-reveal="up">Kisah Cinta Kami</h2>
          <p className="love-story-intro" data-reveal="fade" style={{fontSize: '1.3rem', marginBottom: '4rem'}}>Bagaimana takdir mempertemukan dua hati...</p>

          <div className="timeline" style={{maxWidth: '800px', width: '100%'}}>
            <div className="timeline-item" data-reveal="left">
              <div className="timeline-dot" style={{width: '50px', height: '50px', fontSize: '1.5rem'}}>❤</div>
              <div className="timeline-content" style={{padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', background: 'white'}}>
                <p className="timeline-date" style={{fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700}}>JANUARI 2024</p>
                <h4 className="timeline-title" style={{fontSize: '1.8rem', margin: '0.8rem 0'}}>Pertemuan Pertama</h4>
                <p className="timeline-text" style={{fontSize: '1.1rem'}}>Berawal dari pertemuan tak sengaja di sebuah perpustakaan kota, di mana kami berbagi pandangan yang sama tentang sebuah buku.</p>
              </div>
            </div>

            <div className="timeline-item" data-reveal="right">
              <div className="timeline-dot" style={{width: '50px', height: '50px', fontSize: '1.5rem'}}>💍</div>
              <div className="timeline-content" style={{padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', background: 'white'}}>
                <p className="timeline-date" style={{fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700}}>DESEMBER 2024</p>
                <h4 className="timeline-title" style={{fontSize: '1.8rem', margin: '0.8rem 0'}}>Lamaran</h4>
                <p className="timeline-text" style={{fontSize: '1.1rem'}}>Di depan keluarga besar, kami memutuskan untuk mengukuhkan janji untuk melangkah bersama menuju pelaminan.</p>
              </div>
            </div>
          </div>
        </section>


        <section id="acara" className="has-sparkles">
          <h2 className="section-title" data-reveal="up">Waktu &amp; Tempat</h2>
          
          <div className="countdown-wrapper" data-reveal="fade" style={{gap: '2rem', marginBottom: '5rem'}}>
            {['days','hours','minutes','seconds'].map(u => (
              <div key={u} className={`flip-unit flip-${u}`}>
                <div className="flip-card" style={{width: '90px', height: '110px', fontSize: '3rem'}}>
                  <span className="flip-value">00</span>
                </div>
                <span className="flip-label" style={{fontSize: '1rem', marginTop: '1rem'}}>{u.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="event-cards" style={{width: '100%', maxWidth: '1100px', gap: '3rem'}}>
            <div className="event-card" data-reveal="up" style={{flex: 1, padding: '4rem 2rem', background: 'white', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)'}}>
              <div className="event-icon" style={{fontSize: '4rem', marginBottom: '2rem'}}>💍</div>
              <h3 className="event-name" style={{fontSize: '2.2rem', marginBottom: '1.5rem'}}>AKAD NIKAH</h3>
              <p className="event-datetime" style={{fontSize: '1.2rem', lineHeight: '1.8'}}>Minggu, 29 Maret 2026<br/><strong>08:00 - 10:00 WIB</strong></p>
              <p className="event-venue" style={{fontSize: '1.1rem', margin: '1.5rem 0', color: 'var(--text-muted)'}}>Masjid Raya Al-Barokah<br/>Jl. Kerajaan Indah No. 12, Jakarta</p>
              <a href="https://maps.app.goo.gl/..." target="_blank" className="btn-open" style={{fontSize: '1rem', padding: '12px 30px'}}>📍 Lihat Lokasi</a>
            </div>

            <div className="event-card" data-reveal="up" data-delay="1" style={{flex: 1, padding: '4rem 2rem', background: 'white', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)'}}>
              <div className="event-icon" style={{fontSize: '4rem', marginBottom: '2rem'}}>✨</div>
              <h3 className="event-name" style={{fontSize: '2.2rem', marginBottom: '1.5rem'}}>RESEPSI</h3>
              <p className="event-datetime" style={{fontSize: '1.2rem', lineHeight: '1.8'}}>Minggu, 29 Maret 2026<br/><strong>11:00 - 14:00 WIB</strong></p>
              <p className="event-venue" style={{fontSize: '1.1rem', margin: '1.5rem 0', color: 'var(--text-muted)'}}>Grand Baroque Ballroom<br/>Hotel Royal Palace, Jakarta</p>
              <a href="https://maps.app.goo.gl/..." target="_blank" className="btn-open" style={{fontSize: '1rem', padding: '12px 30px'}}>📍 Lihat Lokasi</a>
            </div>
          </div>
        </section>


        <section id="galeri" style={{background: 'var(--warm-cream)'}}>
          <h2 className="section-title" data-reveal="up">Galeri Bahagia</h2>
          <p className="galeri-intro" data-reveal="fade" style={{fontSize: '1.2rem', marginBottom: '4rem'}}>Momen indah yang tertangkap dalam lensa...</p>

          <div className="galeri-grid" style={{maxWidth: '1200px', gap: '1.5rem'}}>
            {dummyPhotos.map((src, i) => (
              <div key={i} className="galeri-item" data-reveal="fade" data-delay={i%3} data-onclick={`openLightbox('${src}')`} style={{borderRadius: '12px', overflow: 'hidden'}}>
                <img src={src} alt={`Gallery ${i+1}`} style={{width: '100%', aspectRatio: '1', objectFit: 'cover'}}/>
              </div>
            ))}
          </div>
        </section>


        <div id="lightbox" role="dialog" aria-modal="true" data-onclick="closeLightbox()">
          <span id="lightbox-close">✕</span>
          <img id="lightbox-img" src={undefined} alt="Foto"/>
        </div>


        <section id="rsvp">
          <img src="/assets/ornament-scroll.svg" alt="" className="ornament-divider" style={{width: '200px', marginBottom: "3rem"}} />
          <h2 className="section-title" data-reveal="up">Konfirmasi Kehadiran</h2>
          <div className="rsvp-form" style={{maxWidth: '600px', width: '100%', background: 'white', padding: '4rem', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)'}}>
            <div className="form-field" data-reveal="up">
              <label className="form-label" style={{fontSize: '1.2rem'}}>Nama Tamu</label>
              <input type="text" id="rsvp-name" className="form-input" style={{fontSize: '1.1rem', padding: '15px'}} placeholder="Tulis namamu disini..."/>
            </div>

            <div className="form-field" data-reveal="up" data-delay="1">
              <label className="form-label" style={{fontSize: '1.2rem'}}>Konfirmasi Kehadiran</label>
              <div className="attendance-options" style={{gap: '1rem'}}>
                {['Hadir', 'Tidak Hadir', 'Ragu-ragu'].map(opt => (
                  <div key={opt} className="att-option" data-onclick={`selectAttendance('${opt}')`} style={{padding: '12px 20px', fontSize: '1rem'}}>{opt}</div>
                ))}
              </div>
            </div>
            <button className="btn-open" style={{width: '100%', marginTop: '2rem'}} data-onclick="submitRSVPForm()">
              Kirim via WhatsApp
            </button>
          </div>
        </section>


        <section id="amplop" style={{background: 'var(--warm-cream)'}}>
          <h2 className="section-title" data-reveal="up">Kado Pernikahan</h2>
          <div className="rekening-cards" style={{maxWidth: '900px', gap: '2.5rem'}}>
            <div className="rekening-card" data-reveal="left" style={{flex: 1, padding: '3rem', background: 'white', borderRadius: '20px'}}>
              <p className="bank-name" style={{fontSize: '1.3rem', fontWeight: 700}}>BCA</p>
              <p className="rek-number" style={{fontSize: '2rem', margin: '1rem 0', color: 'var(--gold)'}}>123 456 7890</p>
              <p className="rek-owner" style={{fontSize: '1.1rem'}}>a.n Naira Ashalina</p>
              <button className="btn-secondary" style={{marginTop: '1.5rem'}} data-onclick="copyRekening('1234567890')">Salin Rekening</button>
            </div>
            <div className="rekening-card" data-reveal="right" style={{flex: 1, padding: '3rem', background: 'white', borderRadius: '20px'}}>
              <p className="bank-name" style={{fontSize: '1.3rem', fontWeight: 700}}>MANDIRI</p>
              <p className="rek-number" style={{fontSize: '2rem', margin: '1rem 0', color: 'var(--gold)'}}>098 765 4321</p>
              <p className="rek-owner" style={{fontSize: '1.1rem'}}>a.n Usamah Al-Fatih</p>
              <button className="btn-secondary" style={{marginTop: '1.5rem'}} data-onclick="copyRekening('0987654321')">Salin Rekening</button>
            </div>
          </div>
        </section>


        <section id="buku-tamu" className="has-sparkles">
          <h2 className="section-title" data-reveal="up">Ucapan &amp; Doa</h2>
          <div className="wish-form" style={{maxWidth: '700px', width: '100%', marginBottom: '4rem'}}>
            <div className="form-field" style={{marginBottom: '1.5rem'}}>
              <input type="text" id="wish-name" className="form-input" style={{fontSize: '1.1rem', padding: '15px'}} placeholder="Namamu..."/>
            </div>
            <div className="form-field" style={{marginBottom: '2rem'}}>
              <textarea id="wish-text" className="form-input" style={{fontSize: '1.1rem', padding: '15px', height: '120px'}} placeholder="Tulis ucapan disini..."></textarea>
            </div>
            <button className="btn-open" style={{width: '100%'}} data-onclick="submitWishForm()">Kirim Ucapan</button>
          </div>
          <div className="wishes-list" style={{maxWidth: '700px', width: '100%', gap: '1.5rem'}}>
             <div className="wish-bubble" style={{padding: '1.5rem', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)'}}>
               <p style={{fontWeight: 700, fontSize: '1.1rem'}}>Rizky Pratama</p>
               <p style={{fontSize: '1.05rem', marginTop: '0.5rem'}}>Selamat menempuh hidup baru Usamah & Naira! Semoga SAMAWA ya.</p>
             </div>
             <div className="wish-bubble" style={{padding: '1.5rem', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)'}}>
               <p style={{fontWeight: 700, fontSize: '1.1rem'}}>Sarah Amalia</p>
               <p style={{fontSize: '1.05rem', marginTop: '0.5rem'}}>Barakallah untuk kalian berdua. Akhirnya sah juga!</p>
             </div>
          </div>
        </section>


        <section id="closing">
          <img src="/assets/flowers-bottom.png" alt="" className="section-flowers" style={{width: '60%', maxWidth: '600px', marginBottom: '3rem'}} />
          <p className="closing-message" style={{fontSize: '1.5rem', maxWidth: '800px', textAlign: 'center', lineHeight: '2', marginBottom: '3rem'}}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu bagi kami.
          </p>
          <h2 className="hero-names" style={{fontSize: '6rem', margin: '2rem 0'}}>Naira & Usamah</h2>
          <button className="btn-open" style={{marginTop: "3rem"}} data-onclick="shareInvitation()">🔗 Bagikan Undangan</button>
          <p className="closing-credit" style={{marginTop: '5rem', fontSize: '1.1rem', opacity: 0.6}}>Digital Wedding Invitation 2026</p>
        </section>

      </div>
    </>
  );
}
