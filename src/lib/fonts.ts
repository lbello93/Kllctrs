import localFont from "next/font/local";

export const spaceGrotesk = localFont({
  src: "../app/fonts/space-grotesk-latin.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});

export const inter = localFont({
  src: "../app/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const unica = localFont({
  src: "../app/fonts/unica-one-latin.woff2",
  variable: "--font-unica",
  weight: "400",
  display: "swap",
});
