"use client";
import styles from "./LoveStorySection.module.css";

const MILESTONES = [
  {
    date: "Januari 2020",
    title: "Pertama Kali Bertemu",
    story:
      "Saat itu, kami pertama kali bertemu di sebuah seminar kampus. Tatapan mata yang singkat, senyum yang tulus — siapa sangka itu adalah awal dari segalanya.",
    emoji: "🕌",
    color: "#d4849b",
  },
  {
    date: "Maret 2020",
    title: "Mulai Dekat",
    story:
      "Berawal dari bertukar nomor karena tugas kelompok, kami mulai sering bercerita hingga larut malam. Tawa dan cerita mengalir begitu saja, tanpa kami sadari.",
    emoji: "💌",
    color: "#a895c4",
  },
  {
    date: "14 Februari 2021",
    title: "Resmi Bersama",
    story:
      "Di bawah langit senja yang kemerahan, Rizky menggenggam tangan Aulia dan mengungkapkan perasaannya. Aulia tersenyum dan berkata 'iya' dengan pipi yang memerah.",
    emoji: "🤍",
    color: "#7bbcaa",
  },
  {
    date: "Agustus 2022",
    title: "Melewati Jarak",
    story:
      "Aulia melanjutkan studi ke luar kota. Kami belajar bahwa jarak bukan halangan — justru membuat kami lebih menghargai setiap momen kebersamaan.",
    emoji: "🕊️",
    color: "#d4849b",
  },
  {
    date: "Desember 2024",
    title: "Lamaran",
    story:
      "Dengan gemetar tapi penuh keyakinan, Rizky berlutut di hadapan Aulia dan keluarganya. Satu kata 'ya' yang mengantar kami menuju babak baru yang paling indah.",
    emoji: "💍",
    color: "#a895c4",
  },
];

export default function LoveStorySection() {
  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      {/* Sparkles */}
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ top: "10%", right: "10%", width: "20px" }} />
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ bottom: "20%", left: "5%", width: "30px", animationDelay: "1.5s" }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Perjalanan Cinta</p>
        <h2 className="section-title reveal reveal-up">Kisah Kami</h2>
        <p className={`${styles.intro} reveal reveal-up`}>
          Setiap cinta punya ceritanya sendiri. Ini cerita kami — dan kamu adalah bagian dari perjalanannya.
        </p>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <div className={styles.timeline}>
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`${styles.item} reveal ${i % 2 === 0 ? "reveal-left" : "reveal-right"} reveal-delay-${Math.min(i + 1, 5)}`}
              style={{ "--accent": m.color } as React.CSSProperties}
            >
              <div className={styles.dot}>
                <span className={styles.dotEmoji}>{m.emoji}</span>
                <div className={styles.dotLine} />
              </div>
              <div className={styles.card}>
                <span className={styles.date}>{m.date}</span>
                <h3 className={styles.title}>{m.title}</h3>
                <p className={styles.story}>{m.story}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
