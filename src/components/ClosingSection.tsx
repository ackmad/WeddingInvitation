"use client";
import styles from "./ClosingSection.module.css";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export default function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Baroque luxury celebration: gold and dusty pink confetti
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#d4849b", "#a895c4", "#D4AF37", "#f5d0dc"],
            disableForReducedMotion: true,
          });
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Undangan Pernikahan Rizky & Aulia",
          text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara pernikahan kami.",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan undangan berhasil disalin!");
    }
  };

  return (
    <div ref={sectionRef} className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      <div className={styles.inner}>
        <h2 className="section-title reveal reveal-up">Terima Kasih</h2>

        <p className={`${styles.message} reveal reveal-up reveal-delay-1`}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir dan memberikan doa restu kepada kami.
        </p>
        <p className={`${styles.greetings} reveal reveal-up reveal-delay-2`}>
          Wassalamu’alaikum Warahmatullahi Wabarakatuh.
        </p>

        <p className={`${styles.signOff} reveal reveal-up reveal-delay-3`}>
          Kami yang berbahagia
        </p>

        <h3 className={`${styles.names} reveal reveal-up reveal-delay-3`}>
          Rizky &amp; Aulia
        </h3>
        <p className={`${styles.familyText} reveal reveal-up reveal-delay-3`}>
          Beserta seluruh keluarga besar
        </p>

        <div className={`${styles.shareWrap} reveal reveal-up reveal-delay-4`}>
          <button onClick={handleShare} className={styles.shareBtn}>
            <span>📤</span> Bagikan Undangan
          </button>
        </div>
      </div>

      {/* Decorative Bottom Layer */}
      <img src="/assets/castle-pink.png" alt="" className={`${styles.castle} castle-float`} />
      <div className={styles.flowerBottom} style={{ backgroundImage: `url('/assets/flowers-bottom.png')` }} />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Created with M·O·R·E</p>
        <p className={styles.footerSub}>Luxury Wedding Invitation</p>
      </footer>
    </div>
  );
}
