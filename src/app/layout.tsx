import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/page-components/navbar/Navbar";
import ChatPage from "@/page-components/ChatPage/ChatPage";
import { inter, spaceGrotesk, unica } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "KLLCTRS",
  description: "The KLLCTRS application is being rebuilt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
    >
      <body
        className={`${inter.className} ${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
      >
        <Navbar />
        {children}
        <ChatPage />
      </body>
    </html>
  );
}
