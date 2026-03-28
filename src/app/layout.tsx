import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Montserrat } from "next/font/google";
import "./globals.css";
import configData from "../data/weddingConfig.json";

const cursiveFont = Dancing_Script({
  variable: "--font-script-family",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-sans-family",
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
      <body className={`${cursiveFont.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
