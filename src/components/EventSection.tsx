"use client";
import styles from "./EventSection.module.css";

const EVENTS = [
  {
    name: "Akad Nikah",
    date: "Sabtu, 26 April 2025",
    time: "08.00 – 10.00 WIB",
    venue: "Masjid Al-Ikhlas",
    address: "Jl. Kemanggisan No. 12, Jakarta Barat, DKI Jakarta",
    maps: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta+Barat",
    emoji: "🕌",
    color: "#a895c4",
    bg: "rgba(224, 213, 240, 0.3)",
  },
  {
    name: "Resepsi Pernikahan",
    date: "Sabtu, 26 April 2025",
    time: "11.00 – 16.00 WIB",
    venue: "Gedung Serbaguna Baroque",
    address: "Jl. Harmoni No. 8, Jakarta Pusat, DKI Jakarta",
    maps: "https://maps.google.com/?q=Gedung+Serbaguna+Harmoni+Jakarta+Pusat",
    emoji: "🕊️",
    color: "#d4849b",
    bg: "rgba(245, 208, 220, 0.3)",
  },
];

export default function EventSection() {
  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />
      
      {/* Sparkles */}
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ top: "15%", left: "10%", width: "22px" }} />
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ bottom: "10%", right: "15%", width: "28px", animationDelay: "1s" }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Detail Acara</p>
        <h2 className="section-title reveal reveal-up">Tanggal Pernikahan</h2>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <p className={`${styles.tagline} reveal reveal-up`}>
          Dengan penuh rasa syukur, kami mengundang Anda untuk hadir dan turut mendoakan kami.
        </p>

        <div className={styles.cards}>
          {EVENTS.map((event, i) => (
            <div
              key={i}
              className={`${styles.card} reveal ${i === 0 ? "reveal-left" : "reveal-right"} reveal-delay-${i + 1}`}
              style={{ "--accent": event.color, "--bg": event.bg } as React.CSSProperties}
            >
              <div className={styles.cardEmoji}>{event.emoji}</div>
              <div className={styles.cardBadge}>{event.name}</div>

              <div className={styles.row}>
                <span>📅</span>
                <div>
                  <span className={styles.rowLabel}>Tanggal</span>
                  <span className={styles.rowVal}>{event.date}</span>
                </div>
              </div>
              <div className={styles.row}>
                <span>🕐</span>
                <div>
                  <span className={styles.rowLabel}>Waktu</span>
                  <span className={styles.rowVal}>{event.time}</span>
                </div>
              </div>
              <div className={styles.row}>
                <span>🏛️</span>
                <div>
                  <span className={styles.rowLabel}>Venue</span>
                  <span className={styles.rowVal}>{event.venue}</span>
                </div>
              </div>
              <div className={styles.row}>
                <span>📍</span>
                <div>
                  <span className={styles.rowLabel}>Alamat</span>
                  <span className={styles.rowVal}>{event.address}</span>
                </div>
              </div>

              <a
                href={event.maps}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapsBtn}
              >
                <span>🗺️</span>
                Buka Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
