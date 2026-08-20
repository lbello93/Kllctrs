"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { motion } from "framer-motion";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import Image from "next/image";

interface FooterProps {
  onChatClick?: () => void;
}

export function Footer({ onChatClick }: FooterProps) {
  return (
    <footer className="border-t border-[#D9D9D9] bg-[#151E3C]">
      <Container>
        <div className="flex flex-row flex-wrap items-center justify-between gap-10 py-8 px-0 md:px-[60px]">
          {/* Title block: logo + socials + description */}
          <div className="flex w-[262px] min-w-[240px] flex-col items-start gap-4">
            {/* Logo */}
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

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <IconBtn
                icon={FaXTwitter}
                href="https://x.com/kllctrs"
                label="KLLCTRS on X"
              />

              <IconBtn
                icon={FaInstagram}
                href="https://www.instagram.com/kllctrs?igsi=c25iZmRnODhoNDhu"
                label="KLLCTRS on Instagram"
              />

              <IconBtn
                icon={FaLinkedin}
                href="https://www.linkedin.com/company/kllctrs/"
                label="KLLCTRS on LinkedIn"
              />
            </div>

            {/* Description */}
            <p className="font-['Inter'] text-sm font-normal leading-[140%] text-[#FEF9FF]">
              The operating system for collectors. Discover shows, track shops,
              analyze sponsors, and get real-time insights powered by AI.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex max-w-[512px] flex-row items-start gap-8">
            {/* Platform */}
            <FooterColumn
              title="Platform"
              items={[
                { href: "/maps", label: "Event Calendar" },
                { href: "/maps", label: "Card Shops" },
                { href: "/sponsors", label: "Sponsors" },
                { href: "/blog", label: "Blog" },
              ]}
            />

            {/* Resources */}
            <div className="flex w-60 flex-col items-start gap-2">
              <div className="w-60 pb-2">
                <span className="font-['Inter'] text-sm font-semibold leading-[140%] text-[#FEF9FF]">
                  Resources
                </span>
              </div>

              <div className="flex w-48 flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={onChatClick}
                  className="font-['Inter'] text-left text-sm font-normal leading-[140%] text-[#FEF9FF] transition hover:opacity-70"
                >
                  AI Chatbot
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ---------- Footer Column ---------- */

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
            key={item.label}
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

/* ---------- Social Icon Button ---------- */

function IconBtn({
  icon: Icon,
  href,
  label,
}: {
  icon: any;
  href: string;
  label: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.2 }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        <Icon className="h-5 w-5 cursor-pointer text-[#FEF9FF]" />
      </Link>
    </motion.div>
  );
}
