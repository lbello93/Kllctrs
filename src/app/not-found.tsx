import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found | KLLCTRS",
  description: "This page could not be found. Explore KLLCTRS events, shops, and collector stories.",
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-[#FEF9FF] px-5 py-16 sm:min-h-[680px] sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-[#EDE5FF] blur-3xl sm:right-0 sm:top-[-9rem]" />
        <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#FFF1CC] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DED2FF] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B18BE] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#F0C040]" />
            KLLCTRS · Page not found
          </p>
          <h1 className="font-unica-one text-7xl leading-[0.9] tracking-[-0.04em] text-[#151E3C] sm:text-8xl md:text-[10rem]">
            404<span className="text-[#8B5CF6]">.</span>
          </h1>
          <h2 className="mt-6 max-w-lg font-space text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#151E3C] sm:text-4xl">
            Looks like this one slipped out of the collection.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#596078] sm:text-lg">
            The page may have moved, or the link may be off. The hobby is still here—find a show, discover a shop, or head back to KLLCTRS.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#8B5CF6] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(91,24,190,0.2)] transition hover:bg-[#7137DA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B18BE]"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/maps"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#D8C9FF] bg-white/80 px-5 text-sm font-semibold text-[#151E3C] transition hover:border-[#8B5CF6] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B18BE]"
            >
              <MapPin size={17} aria-hidden="true" />
              Explore the map
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label="Popular KLLCTRS destinations" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#5B18BE]">
            <Link className="underline decoration-[#CBBEFB] underline-offset-4 hover:text-[#151E3C]" href="/events">Events</Link>
            <Link className="underline decoration-[#CBBEFB] underline-offset-4 hover:text-[#151E3C]" href="/shops">Shops</Link>
            <Link className="underline decoration-[#CBBEFB] underline-offset-4 hover:text-[#151E3C]" href="/blog">Collector stories</Link>
          </nav>
        </div>

        <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-[390px] sm:block">
          <div className="absolute inset-[7%] rounded-full border border-dashed border-[#BDA7F8]" />
          <div className="absolute inset-[19%] rounded-full border border-[#E6DCFF] bg-white/45" />
          <div className="absolute left-1/2 top-1/2 h-[76%] w-[54%] -translate-x-1/2 -translate-y-1/2 rotate-[7deg] rounded-[1.5rem] border-[7px] border-white bg-gradient-to-br from-[#D9CBFF] via-[#F6F1FF] to-[#F0C040] p-3 shadow-[0_30px_70px_rgba(42,27,84,0.2)]">
            <div className="flex h-full flex-col items-center justify-between rounded-[0.9rem] border border-white/80 bg-white/55 px-4 py-5 text-center">
              <div className="flex w-full items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-[#5B18BE]">
                <span>Collector card</span><span>404</span>
              </div>
              <div className="flex h-[54%] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#B9A2FF] to-[#F0C040]">
                <Search className="h-16 w-16 text-white/90" strokeWidth={1.2} />
              </div>
              <div className="w-full text-left">
                <div className="h-2 w-2/3 rounded-full bg-[#151E3C]/15" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-[#151E3C]/10" />
                <div className="mt-4 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5B18BE]">
                  <span>Not in the set</span><span>★ ★ ★</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-[3%] top-[18%] rounded-lg border border-[#EEE7FF] bg-white px-4 py-3 shadow-lg shadow-[#26104D]/10">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8FA3]">Collection status</span>
            <span className="mt-1 block font-space text-sm font-bold text-[#151E3C]">Still exploring</span>
          </div>
          <div className="absolute bottom-[14%] left-[1%] rounded-lg bg-[#151E3C] px-4 py-3 text-white shadow-lg shadow-[#151E3C]/20">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">Next stop</span>
            <span className="mt-1 flex items-center gap-2 font-space text-sm font-semibold"><MapPin size={14} /> The hobby near you</span>
          </div>
        </div>
      </div>
    </section>
  );
}
