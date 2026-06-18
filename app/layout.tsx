import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Habits 30 — трекер привычек",
  description:
    "Простой трекер привычек на 30 дней. Без регистрации — данные хранятся в браузере.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-smoky font-sans text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
