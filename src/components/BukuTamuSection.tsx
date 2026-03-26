"use client";
import { useState, useEffect } from "react";
import styles from "./BukuTamuSection.module.css";

interface CommentItem {
  id: number;
  name: string;
  attendance: string;
  message: string;
  date: string;
}

export default function BukuTamuSection() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Load existing mock comments
  useEffect(() => {
    setComments([
      {
        id: 1,
        name: "Arif & Keluarga",
        attendance: "Hadir",
        message: "Selamat menempuh hidup baru Rizky & Aulia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
        date: "2 jam yang lalu",
      },
      {
        id: 2,
        name: "Sarah (SMP 1)",
        attendance: "Hadir",
        message: "Auliaaa!! Akhirnya nyusul juga. Lancar-lancar sampai hari H yaa. Can't wait for your big day!",
        date: "6 jam yang lalu",
      },
      {
        id: 3,
        name: "Bima",
        attendance: "Tidak Hadir",
        message: "Bro, maaf banget nggak bisa hadir karena lagi di luar kota. Tapi doa terbaik buat kalian berdua. Happy wedding!",
        date: "1 hari yang lalu",
      },
      {
        id: 4,
        name: "Keluarga Besar Bapak Sudirman",
        attendance: "Hadir",
        message: "Teriring doa dari kami sekeluarga, semoga pernikahan kalian selalu dilimpahi keberkahan dan kebahagiaan.",
        date: "2 hari yang lalu",
      },
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newComment: CommentItem = {
      id: Date.now(),
      name,
      attendance,
      message,
      date: "Baru saja",
    };

    setComments([newComment, ...comments]);
    setName("");
    setMessage("");
    setAttendance("Hadir");
    setSubmitted(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Doa & Harapan</p>
        <h2 className="section-title reveal reveal-up">Buku Tamu</h2>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <div className={styles.contentWrap}>
          {/* Form */}
          <div className={`${styles.formSection} reveal reveal-left`}>
            <div className={styles.formCard}>
              <h3 className={styles.cardInfo}>Kirimkan Doa Restu</h3>
              <p className={styles.cardDesc}>
                Terima kasih atas doa dan harapan baik untuk pernikahan kami.
              </p>

              {submitted && (
                <div className={styles.successMsg}>
                  Terima kasih! Pesan Anda telah ditambahkan ke buku tamu.
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="guestName" className={styles.label}>Nama</label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="Nama Anda"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="guestAttendance" className={styles.label}>Kehadiran</label>
                  <select
                    id="guestAttendance"
                    className={styles.select}
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="guestMessage" className={styles.label}>Ucapan & Doa</label>
                  <textarea
                    id="guestMessage"
                    required
                    placeholder="Tulis ucapan dan doa Anda..."
                    className={styles.textarea}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Kirim Ucapan
                </button>
              </form>
            </div>
          </div>

          {/* Comment List */}
          <div className={`${styles.listSection} reveal reveal-right`}>
            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h3 className={styles.cardInfo}>Daftar Harapan</h3>
                <span className={styles.counter}>{comments.length} Pesan</span>
              </div>

              <div className={styles.commentList}>
                {comments.length === 0 ? (
                  <p className={styles.emptyMsg}>Belum ada ucapan. Jadilah yang pertama!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <div className={styles.commentAvatar}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.commentMeta}>
                          <h4 className={styles.commentName}>
                            {c.name}
                            <span className={c.attendance === "Hadir" ? styles.badgeHadir : styles.badgeTidakHadir}>
                              {c.attendance === "Hadir" ? "✓ Hadir" : "✕ Tidak Hadir"}
                            </span>
                          </h4>
                          <span className={styles.commentDate}>{c.date}</span>
                        </div>
                      </div>
                      <p className={styles.commentBody}>{c.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
