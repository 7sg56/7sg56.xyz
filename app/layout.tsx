import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const canela = Fraunces({
  variable: "--font-canela",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Sourish Ghosh",
  description: "This is a website of Sourish Ghosh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${canela.variable} antialiased font-mono bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
