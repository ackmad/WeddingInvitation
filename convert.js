const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const bodyStart = html.indexOf('<body>') + 6;
const jsStart = html.indexOf('<script src="animation.js"></script>');
let body = html.substring(bodyStart, jsStart);

body = body.replace(/class=/g, 'className=');
body = body.replace(/for=/g, 'htmlFor=');
body = body.replace(/onclick="([^"]+)"/g, (match, p1) => {
  return `data-onclick="${p1.replace(/"/g, '&quot;')}"`;
});

body = body.replace(/style="([^"]+)"/g, (match, p1) => {
  const styles = p1.split(';').filter(s => s.trim().length > 0);
  const styleObj = {};
  styles.forEach(s => {
    let [key, val] = s.split(':');
    if(key && val) {
       key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
       val = val.trim();
       if (!isNaN(val)) val = Number(val);
       else val = `"${val}"`;
       styleObj[key] = val;
    }
  });
  return 'style={{' + Object.entries(styleObj).map(([k,v]) => `${k}: ${v}`).join(', ') + '}}';
});

body = body.replace(/src=""/g, 'src={null}');
body = body.replace(/<img(.*?[^\/])>/g, '<img$1 />');
body = body.replace(/<source(.*?[^\/])>/g, '<source$1 />');
body = body.replace(/<input(.*?[^\/])>/g, '<input$1 />');
body = body.replace(/<br>/g, '<br />');

body = body.replace(/<!--[\s\S]*?-->/g, '');

const finalReact = `
"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import "./globals.css";

export default function WeddingPage() {
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const CONFIG = {
    groomName:   'Usamah',
    brideName:   'Naira',
    weddingDate: '2026-03-29T08:00:00',
    waNumber:    '6281234567890',
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nama = params.get('tamu');
      if (nama) {
        setGuestName(nama);
        const el = document.getElementById('guest-name');
        if (el) el.textContent = nama;
      }
    }
  }, []);

  const openInvitation = () => {
    const splash = document.getElementById('splash');
    if(splash) splash.classList.add('hide');
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.play().catch(() => {});
      document.getElementById('music-btn')?.classList.add('playing');
    }
    setTimeout(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
      if(splash) splash.style.display = 'none';
      if(window.launchConfetti) window.launchConfetti();
    }, 850);
  };

  const openLightbox = (src) => {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
  };

  const closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('open');
  };

  const submitRSVPForm = () => {
    const name = document.getElementById('rsvp-name').value.trim();
    if (!name) { alert('Mohon isi nama terlebih dahulu.'); return; }
    if (!selectedAttendance) { alert('Mohon pilih konfirmasi kehadiran.'); return; }
    const msg = encodeURIComponent(\`Halo, saya \${name} ingin konfirmasi kehadiran: \${selectedAttendance}. Terima kasih!\`);
    window.open(\`https://wa.me/\${CONFIG.waNumber}?text=\${msg}\`, '_blank');
  };

  const copyRekening = (nomor) => {
    navigator.clipboard.writeText(nomor).then(() => {
      alert('Nomor rekening ' + nomor + ' tersalin!');
    });
  };

  const confirmGiftWA = () => {
    const msg = encodeURIComponent(\`Halo, saya ingin mengkonfirmasi pengiriman hadiah pernikahan untuk \${CONFIG.brideName} & \${CONFIG.groomName} 💍\`);
    window.open(\`https://wa.me/\${CONFIG.waNumber}?text=\${msg}\`, '_blank');
  };

  const submitWishForm = () => {
    const name = document.getElementById('wish-name').value.trim();
    const text = document.getElementById('wish-text').value.trim();
    if (!name || !text) { alert('Mohon isi nama dan ucapan.'); return; }
    const msg = encodeURIComponent(\`💌 Ucapan dari \${name}:\\n\\n\${text}\`);
    window.open(\`https://wa.me/\${CONFIG.waNumber}?text=\${msg}\`, '_blank');
  };

  const shareInvitation = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title : \`The Wedding of \${CONFIG.brideName} & \${CONFIG.groomName}\`,
        text  : \`Kamu diundang ke pernikahan \${CONFIG.brideName} & \${CONFIG.groomName} 🌸\`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link undangan berhasil disalin!');
      });
    }
  };

  return (
    <>
      <div onClick={(e) => {
        const action = e.target.getAttribute("data-onclick");
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
               e.target.classList.add('selected');
               setSelectedAttendance(m[1]);
             }
           }
        }
      }}>
        ${body}
      </div>

      <Script src="/assets/animation.js" strategy="lazyOnload" />
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', finalReact);
console.log("Written to src/app/page.tsx");
