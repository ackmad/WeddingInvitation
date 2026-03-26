"use client";

import { useEffect, useState } from "react";
import styles from "./SplashSection.module.css";
import Image from "next/image";

interface Props {
  guestName: string;
  onOpen: () => void;
}

export default function SplashSection({ guestName, onOpen }: Props) {
  const [mounted, setMounted] = useState(false);
  const [petals, setPetals] = useState<
    { id: number; left: number; duration: number; delay: number; size: number; rotation: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 4,
      size: 15 + Math.random() * 20,
      rotation: Math.random() * 360,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className={styles.splash}>
      {/* Parallax Architecture Background */}
      <div 
        className={styles.bgArch} 
        style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} 
      />

      {/* Frame Baroque Overlay */}
      <div 
        className={`${styles.frameBaroque} frame-reveal`}
        style={{ backgroundImage: `url('/assets/frame-baroque.png')` }}
      />

      {/* Sliding Flowers */}
      <img src="/assets/flowers-left.png" alt="" className={`${styles.flowerLeft} slide-flower-left`} />
      <img src="/assets/flowers-right.png" alt="" className={`${styles.flowerRight} slide-flower-right`} />

      {/* Bottom flower arrangement */}
      <div 
        className={styles.flowerBottom} 
        style={{ backgroundImage: `url('/assets/flowers-bottom.png')` }}
      />

      {/* Petal animation */}
      {petals.map((p) => (
        <img
          key={p.id}
          src="/assets/petal-single.svg"
          alt=""
          className="petal-img"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s, ${p.duration * 0.7}s`,
            animationDelay: `${p.delay}s, ${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      {/* Content */}
      <div className={`${styles.content} ${mounted ? styles.contentVisible : ""}`}>
        <p className={styles.invitation}>— Undangan Pernikahan —</p>

        <h1 className={styles.coupleName}>
          <span className={styles.nameLeft}>Rizky</span>
          <span className={styles.ampersand}>&</span>
          <span className={styles.nameRight}>Aulia</span>
        </h1>

        <div className={styles.date}>26 · April · 2025</div>

        <div className={styles.divider}>
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        {/* Guest greeting */}
        <div className={styles.guestBox}>
          {guestName ? (
            <>
              <p className={styles.guestLabel}>Kepada yang terhormat,</p>
              <p className={styles.guestName}>{guestName}</p>
              <p className={styles.guestNote}>Kehadiranmu adalah bagian dari cerita indah kami.</p>
            </>
          ) : (
            <>
              <p className={styles.guestLabel}>Kepada yang terhormat,</p>
              <p className={styles.guestName}>Tamu Undangan</p>
              <p className={styles.guestNote}>Kehadiranmu adalah bagian dari cerita indah kami.</p>
            </>
          )}
        </div>

        <button onClick={onOpen} className={styles.openBtn}>
          <span>Buka & Baca Kisah Kami</span>
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
}
