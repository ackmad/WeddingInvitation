import type { Metadata } from "next";
import { Cormorant_Garamond, Quicksand } from "next/font/google";
import "./globals.css";
import configData from "../data/weddingConfig.json";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `The Wedding of ${configData.bride.nickname} & ${configData.groom.nickname}`,
  description:
    "Dengan penuh rasa syukur dan kebahagiaan, kami mengundang Anda untuk hadir dan merayakan hari istimewa kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${cormorant.variable} ${quicksand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
