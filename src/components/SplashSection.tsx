"use client";

import { useEffect, useState } from "react";
import styles from "./SplashSection.module.css";

interface Props {
  guestName: string;
  onOpen: () => void;
  brideName: string;
  groomName: string;
}

export default function SplashSection({ guestName, onOpen, brideName, groomName }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Delay sedikit agar transisi fade-in terlihat mulus di awal
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenClick = () => {
    setIsClosing(true);
    // Beri waktu 850ms untuk animasi menghilang sebelum unmount
    setTimeout(() => {
      onOpen();
    }, 850);
  };

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.bgPhotoWrapper}>
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80" 
          alt="Wedding Backdrop" 
          className={styles.bgPhoto} 
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.glassWrapper}>
          <div className={styles.initialsContainer}>
            <span className={styles.initial}>{brideName[0]}</span>
            <span className={styles.ampersand}>&</span>
            <span className={styles.initial}>{groomName[0]}</span>
          </div>
          
          <p className={styles.weddingOf}>The Wedding Of</p>
          
          <h1 className={styles.fullNames}>
            {brideName} & {groomName}
          </h1>
          
          <div className={styles.openBtnContainer}>
            {guestName && (
               <p className={styles.guestGreet}>
                 Dear : <span>{guestName}</span>
               </p>
            )}
            <button onClick={handleOpenClick} className={styles.openBtn}>
               📧 Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
