"use client";
import { useState } from "react";
import styles from "./GallerySection.module.css";
import Image from "next/image";

const PHOTOS = [
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
  "/images/gallery6.jpg",
  "/images/gallery7.jpg",
  "/images/gallery8.jpg",
  "/images/gallery9.jpg",
];

export default function GallerySection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      {/* Sparkles */}
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ top: "15%", left: "5%", width: "22px" }} />
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ bottom: "5%", right: "8%", width: "30px", animationDelay: "1s" }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Galeri</p>
        <h2 className="section-title reveal reveal-up">Momen Bahagia</h2>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <div className={styles.grid}>
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`${styles.item} reveal reveal-up reveal-delay-${Math.min((i % 3) + 1, 5)}`}
              onClick={() => setSelected(src)}
            >
              <div className={styles.imageWrap}>
                {/* Fallback pattern for placeholder */}
                <div className={styles.placeholder}>
                  <span>Foto {i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className={styles.lightbox} onClick={() => setSelected(null)}>
          <button className={styles.closeBtn}>&times;</button>
          <div className={styles.lightboxContent}>
            <div className={styles.lightboxPlaceholder}>
              <span>Preview Foto</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
