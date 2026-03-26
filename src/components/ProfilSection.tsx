"use client";
import styles from "./ProfilSection.module.css";

interface Person {
  nickname: string;
  fullName: string;
  father: string;
  mother: string;
  instagram?: string;
  emoji: string;
}

const GROOM: Person = {
  nickname: "Rizky",
  fullName: "Muhammad Rizky Pratama, S.T.",
  father: "Bapak Ahmad Fauzi",
  mother: "Ibu Siti Rahayu",
  instagram: "@rizky.pratama",
  emoji: "🤵",
};

const BRIDE: Person = {
  nickname: "Aulia",
  fullName: "Aulia Rahma Dewi, S.Pd.",
  father: "Bapak Hendra Kusuma",
  mother: "Ibu Dewi Lestari",
  instagram: "@aulia.dewi",
  emoji: "👰",
};

function PersonCard({ person, delay }: { person: Person; delay: string }) {
  return (
    <div className={`${styles.card} reveal reveal-up ${delay}`}>
      {/* Avatar with luxury border */}
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>
          <div className={styles.avatarBg} />
          <span className={styles.avatarEmoji}>{person.emoji}</span>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.nickname}>{person.nickname}</h3>
        <p className={styles.fullName}>{person.fullName}</p>

        <div className={styles.parents}>
          <p>
            <span className={styles.parentLabel}>Putra/Putri dari:</span>
          </p>
          <p className={styles.parentName}>{person.father}</p>
          <p className={styles.parentAnd}>&amp; {person.mother}</p>
        </div>

        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igLink}
          >
            <span>📸</span> {person.instagram}
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProfilSection() {
  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      {/* Twinkly stars */}
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ top: "20%", left: "15%", width: "25px" }} />
      <img src="/assets/sparkle-star.svg" alt="" className="sparkle" style={{ top: "60%", right: "20%", width: "35px", animationDelay: "1s" }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Mempelai</p>
        <h2 className={`section-title reveal reveal-up`}>Dua Hati Yang Bersatu</h2>
        <div className={`section-divider reveal reveal-up`}>
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <div className={styles.cards}>
          <PersonCard person={GROOM} delay="reveal-delay-1" />

          <div className={`${styles.heartCenter} reveal reveal-up reveal-delay-2`}>
            <div className={styles.heartIcon}>💗</div>
            <div className={styles.heartLine} />
          </div>

          <PersonCard person={BRIDE} delay="reveal-delay-3" />
        </div>
      </div>
    </div>
  );
}
