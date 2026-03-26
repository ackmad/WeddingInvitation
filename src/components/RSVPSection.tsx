"use client";
import { useState } from "react";
import styles from "./RSVPSection.module.css";

const WA_NUMBER = "6281234567890"; // Ganti dengan nomor asli, gunakan 62 di depan

export default function RSVPSection() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("1"); // 1, 2, atau no
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim()) {
      alert("Mohon isi nama Anda");
      setLoading(false);
      return;
    }

    let message = "";
    if (attendance === "no") {
      message = `Halo, saya ${name}. Mohon maaf, saya belum bisa hadir di acara pernikahan kalian. Selamat berbahagia ya, semoga lancar acaranya!`;
    } else {
      const porsi = attendance === "1" ? "1 orang" : "2 orang";
      message = `Halo! Saya ${name}, insyaAllah saya akan hadir ke acara pernikahan kalian (${porsi}). Tidak sabar merayakan hari bahagia kalian!`;
    }

    const encodeUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    // Simulasi loading sebentar
    setTimeout(() => {
      setLoading(false);
      window.open(encodeUrl, "_blank");
    }, 600);
  };

  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Kehadiran</p>
        <h2 className="section-title reveal reveal-up">RSVP</h2>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <p className={`${styles.desc} reveal reveal-up`}>
          Kehadiran dan doa restu Anda adalah anugerah terindah bagi kami.
          Mohon konfirmasi kehadiran Anda melalui form di bawah ini.
        </p>

        <form onSubmit={handleSubmit} className={`${styles.form} reveal reveal-up reveal-delay-2`}>
          <div className={styles.formGroup}>
            <label htmlFor="rsvpName" className={styles.label}>
              Nama Tamu
            </label>
            <input
              id="rsvpName"
              type="text"
              placeholder="Masukkan nama Anda..."
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Konfirmasi Kehadiran</label>
            <div className={styles.radioGroup}>
              <label className={`${styles.radioCard} ${attendance === "1" ? styles.selected : ""}`}>
                <input type="radio" value="1" checked={attendance === "1"} onChange={(e) => setAttendance(e.target.value)} />
                <span className={styles.radioIcon}>🍽️</span>
                <span className={styles.radioText}>Hadir (1 Orang)</span>
              </label>

              <label className={`${styles.radioCard} ${attendance === "2" ? styles.selected : ""}`}>
                <input type="radio" value="2" checked={attendance === "2"} onChange={(e) => setAttendance(e.target.value)} />
                <span className={styles.radioIcon}>🥂</span>
                <span className={styles.radioText}>Hadir (2 Orang)</span>
              </label>

              <label className={`${styles.radioCard} ${attendance === "no" ? styles.selected : ""}`}>
                <input type="radio" value="no" checked={attendance === "no"} onChange={(e) => setAttendance(e.target.value)} />
                <span className={styles.radioIcon}>🙏</span>
                <span className={styles.radioText}>Maaf, Tidak Bisa Hadir</span>
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Konfirmasi via WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
