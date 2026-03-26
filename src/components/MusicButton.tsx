"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./MusicButton.module.css";

export default function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auto-attempt play on mount (will succeed after user interaction from Buka Undangan click)
    const tryPlay = async () => {
      if (!audioRef.current) {
        audioRef.current = new Audio("/music/background.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      }
      try {
        await audioRef.current.play();
        setPlaying(true);
        setStarted(true);
      } catch {
        // Autoplay blocked — user must interact
        setPlaying(false);
      }
    };
    tryPlay();

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/background.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      setStarted(true);
    }
  };

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      title={playing ? "Hentikan Musik" : "Putar Musik"}
      aria-label={playing ? "Hentikan Musik" : "Putar Musik"}
    >
      <span className={playing ? styles.iconSpin : styles.iconStatic}>🎵</span>
      {!started && <span className={styles.badge}>♫</span>}
    </button>
  );
}
