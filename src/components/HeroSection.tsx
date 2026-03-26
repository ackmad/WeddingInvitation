"use client";

import { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

const WEDDING_DATE = new Date("2025-04-26T08:00:00+07:00");

interface FlipCardProps {
  value: number;
  label: string;
}

function FlipCard({ value, label }: FlipCardProps) {
  const [current, setCurrent] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== current) {
      setPrev(current);
      setFlipping(true);
      const t = setTimeout(() => {
        setCurrent(value);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, current]);

  const display = String(current).padStart(2, "0");
  const prevDisplay = String(prev).padStart(2, "0");

  return (
    <div className={styles.flipUnit}>
      <div className={styles.flipCard}>
        <div className={styles.flipTop}>
          <span>{display}</span>
        </div>
        {flipping && (
          <div className={styles.flipTopFlip}>
            <span>{prevDisplay}</span>
          </div>
        )}
        <div className={styles.flipBottom}>
          <span>{display}</span>
        </div>
        {flipping && (
          <div className={styles.flipBottomFlip}>
            <span>{display}</span>
          </div>
        )}
      </div>
      <span className={styles.flipLabel}>{label}</span>
    </div>
  );
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return time;
}

export default function HeroSection() {
  const countdown = useCountdown(WEDDING_DATE);
  // Stars for twinkle effect
  const stars = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    top: Math.random() * 80 + 10,
    left: Math.random() * 80 + 10,
    delay: Math.random() * 2,
  }));

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Rizky+%26+Aulia&dates=20250426T010000Z/20250426T090000Z&details=Akad+Nikah+%26+Resepsi+Pernikahan+Rizky+dan+Aulia&location=Gedung+Serbaguna,+Jakarta`;
  const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Pernikahan Rizky %26 Aulia%0ADTSTART:20250426T080000%0ADTEND:20250426T160000%0ALOCATION:Jakarta%0ADESCRIPTION:Akad Nikah %26 Resepsi%0AEND:VEVENT%0AEND:VCALENDAR`;

  return (
    <div className={`${styles.hero} parallax-section`}>
      {/* Background with parallax class applied globally in App */}
      <div 
        className={styles.bgArch} 
        style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} 
      />

      {/* Twinkly stars */}
      {stars.map((s) => (
        <img
          key={s.id}
          src="/assets/sparkle-star.svg"
          alt=""
          className="sparkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: "30px",
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Floating Castle */}
      <img src="/assets/castle-pink.png" alt="" className={`${styles.castle} castle-float`} />

      <div className={styles.inner}>
        <p className={`${styles.label} reveal reveal-up`}>— The Wedding of —</p>

        <h1 className={`${styles.names} reveal reveal-up reveal-delay-1`}>
          <span className={styles.nameBride}>Rizky</span>
          <span className={styles.nameAnd}>&</span>
          <span className={styles.nameBride}>Aulia</span>
        </h1>

        <blockquote className={`${styles.verse} reveal reveal-up reveal-delay-2`}>
          <p>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
            isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram
            kepadanya.&rdquo;
          </p>
          <cite>— QS. Ar-Rum: 21 —</cite>
        </blockquote>

        <div className={`${styles.countdownWrap} reveal reveal-up reveal-delay-3`}>
          <p className={styles.countdownLabel}>Menuju Hari Bahagia</p>
          <div className={styles.countdown}>
            <FlipCard value={countdown.days} label="Hari" />
            <span className={styles.colon}>:</span>
            <FlipCard value={countdown.hours} label="Jam" />
            <span className={styles.colon}>:</span>
            <FlipCard value={countdown.minutes} label="Menit" />
            <span className={styles.colon}>:</span>
            <FlipCard value={countdown.seconds} label="Detik" />
          </div>
        </div>

        <div className={`${styles.calBtns} reveal reveal-up reveal-delay-4`}>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.calBtn}
          >
            <span className={styles.calIcon}>📅</span>
            Google Calendar
          </a>
          <a
            href={appleCalendarUrl}
            download="pernikahan-rizky-aulia.ics"
            className={styles.calBtn}
          >
            <span className={styles.calIcon}>🍎</span>
            Apple Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
