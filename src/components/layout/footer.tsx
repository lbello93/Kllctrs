"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { motion } from "framer-motion";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#D9D9D9] bg-[#151E3C]">
      <Container>
        <div className="flex flex-row flex-wrap items-center justify-between gap-10 py-8 px-0 md:px-[60px]">
          {/* Title block: logo + socials + description */}
          <div className="flex w-[262px] min-w-[240px] flex-col items-start gap-4">
            <div className="flex h-12 w-[124px] items-center justify-center">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="relative h-12 w-[124px]"
              >
                <Image
                  src="/footer/Gem_Pink.png"
                  alt="KLLCTRS"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <IconBtn icon={FaXTwitter} />
              <IconBtn icon={FaInstagram} />
              <IconBtn icon={FaLinkedin} />
            </div>

            <p className="font-['Inter'] text-sm font-normal leading-[140%] text-[#FEF9FF]">
              The operating system for collectors. Discover shows, track shops,
              analyze sponsors, and get real-time insights powered by AI.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex max-w-[512px] flex-row items-start gap-8">
            <FooterColumn
              title="Platform"
              items={[
                { href: "/events", label: "Event Calendar" },
                { href: "/shops", label: "Card Shops" },
                { href: "/sponsors", label: "Sponsors" },
                { href: "/blog", label: "Blog" },
              ]}
            />
            <FooterColumn
              title="Resources"
              items={[
                { href: "#", label: "AI Chatbot" },
                { href: "#", label: "Email Alerts" },
                { href: "#", label: "Newsletter" },
              ]}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ---------- Components ---------- */

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="flex w-60 flex-col items-start gap-2">
      <div className="w-60 pb-2">
        <span className="font-['Inter'] text-sm font-semibold leading-[140%] text-[#FEF9FF]">
          {title}
        </span>
      </div>
      <div className="flex w-48 flex-col items-start gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-['Inter'] text-sm font-normal leading-[140%] text-[#FEF9FF] transition hover:opacity-70"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon }: { icon: any }) {
  return (
    <motion.div whileHover={{ scale: 1.2 }}>
      <Icon className="h-5 w-5 cursor-pointer text-[#FEF9FF]" />
    </motion.div>
  );
}
