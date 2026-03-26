"use client";
import { useState } from "react";
import styles from "./AmplopSection.module.css";

const BANKS = [
  {
    name: "BCA",
    account: "1234567890",
    holder: "Muhammad Rizky Pratama",
    logoColor: "#005baa", // Just for UI accent
  },
  {
    name: "BSI",
    account: "0987654321",
    holder: "Aulia Rahma Dewi",
    logoColor: "#00a599",
  },
];

const WA_NUMBER = "6281234567890";

export default function AmplopSection() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleConfirm = () => {
    const text = `Halo, saya baru saja mengirimkan hadiah pernikahan untuk Rizky & Aulia via transfer. Semoga berkah ya!`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.section}>
      <div className={styles.bgArch} style={{ backgroundImage: `url('/assets/bg-architecture.jpg')` }} />

      <div className={styles.inner}>
        <p className="section-subtitle reveal reveal-up">Tanda Kasih</p>
        <h2 className="section-title reveal reveal-up">Amplop Digital</h2>
        <div className="section-divider reveal reveal-up">
          <img src="/assets/ornament-scroll.svg" alt="divider" />
        </div>

        <p className={`${styles.desc} reveal reveal-up`}>
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          Namun jika Anda ingin memberikan tanda kasih secara digital,
          Anda dapat mengirimkannya melalui:
        </p>

        <div className={styles.cards}>
          {BANKS.map((bank, i) => (
            <div
              key={i}
              className={`${styles.card} reveal reveal-up reveal-delay-${i + 1}`}
              style={{ "--bank-accent": bank.logoColor } as React.CSSProperties}
            >
              <div className={styles.bankName}>{bank.name}</div>
              <div className={styles.bankRect}>
                <div className={styles.accountName}>A/N {bank.holder}</div>
                <div className={styles.accountNumber}>{bank.account}</div>
              </div>

              <button
                className={`${styles.copyBtn} ${copiedLink === bank.account ? styles.copied : ""}`}
                onClick={() => handleCopy(bank.account)}
              >
                {copiedLink === bank.account ? (
                  <>
                    <span>✅</span> Tersalin
                  </>
                ) : (
                  <>
                    <span>📋</span> Salin Nomor Rekening
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Gift Delivery Section */}
        <div className={`${styles.giftBox} reveal reveal-up reveal-delay-3`}>
          <div className={styles.giftIcon}>📫</div>
          <h3 className={styles.giftTitle}>Kirim Kado Secara Fisik</h3>
          <p className={styles.giftAddress}>
            Jl. Kebahagiaan No. 99, RT 01/RW 02, Kel. Harapan Jaya, Kec. Sukmajaya,
            Kota Depok, Jawa Barat 16411
          </p>
          <button
            className={`${styles.copyBtnGift} ${copiedLink === "alamat" ? styles.copied : ""}`}
            onClick={() => handleCopy("Jl. Kebahagiaan No. 99, RT 01/RW 02, Kel. Harapan Jaya, Kec. Sukmajaya, Kota Depok, Jawa Barat 16411")}
          >
            {copiedLink === "alamat" ? "✅ Alamat Tersalin" : "📋 Salin Alamat"}
          </button>
        </div>

        {/* WhatsApp Confirm */}
        <button className={`${styles.confirmBtn} reveal reveal-up reveal-delay-4`} onClick={handleConfirm}>
          <span>💬</span> Konfirmasi Pengiriman Hadiah
        </button>
      </div>
    </div>
  );
}
