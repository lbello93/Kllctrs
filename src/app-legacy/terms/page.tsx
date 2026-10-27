import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | KLLCTRS",
  description:
    "KLLCTRS terms of service — rules and guidelines for using the platform.",
};

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance" },
  { id: "description", title: "2. Description of Service" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "content", title: "4. User-Submitted Content" },
  { id: "ai-content", title: "5. AI-Generated Content" },
  { id: "prohibited", title: "6. Prohibited Conduct" },
  { id: "ip", title: "7. Intellectual Property" },
  { id: "warranties", title: "8. Disclaimer of Warranties" },
  { id: "liability", title: "9. Limitation of Liability" },
  { id: "termination", title: "10. Termination" },
  { id: "changes", title: "11. Changes" },
  { id: "law", title: "12. Governing Law" },
  { id: "contact", title: "13. Contact" },
];

export default function TermsPage() {
  return (
  <div className="min-h-screen bg-[#faf8ff] pb-16 pt-24 text-[#15162b]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="mt-7 rounded-3xl border border-violet-100 bg-white px-6 py-8 shadow-[0_14px_50px_rgba(41,25,80,0.06)] sm:px-10 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">KLLCTRS · Legal</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#171936] sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-sm text-violet-800">
            Last updated: May 2, 2026
          </p>
          </div>
        </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
          {/* Section nav */}
          <nav className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-500">
              On this page
            </p>
            <ul className="grid max-h-[55vh] grid-cols-1 gap-1 overflow-y-auto text-sm">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-zinc-600 transition hover:bg-violet-50 hover:text-violet-800"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <article className="min-w-0 space-y-3 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-9">
            <Section id="acceptance" title="1. Acceptance">
              <p>
                By accessing or using KLLCTRS, you agree to these Terms of
                Service. If you do not agree, do not use the platform.
              </p>
            </Section>

            <Section id="description" title="2. Description of Service">
              <p>
                KLLCTRS is a discovery platform for sports card collectors. We
                provide a directory of card shows, card shops, and industry
                sponsors across the United States. We also offer AI-powered
                tools including a chatbot assistant and automated blog content.
              </p>
            </Section>

            <Section id="accounts" title="3. User Accounts">
              <p>
                You must provide a valid email address to create an account. You
                are responsible for maintaining the confidentiality of your
                credentials and for all activity under your account. You must be
                at least 13 years old to use KLLCTRS.
              </p>
            </Section>

            <Section id="content" title="4. User-Submitted Content">
              <p>
                You may submit card show and shop listings for inclusion on the
                platform. By submitting, you represent that the information is
                accurate and that you have the right to share it. All
                submissions are subject to review and approval by our team. We
                reserve the right to reject, edit, or remove any submission at
                our discretion.
              </p>
              <p>
                You retain ownership of content you submit but grant KLLCTRS a
                non-exclusive, royalty-free license to display, distribute, and
                promote your submissions on the platform.
              </p>
            </Section>

            <Section id="ai-content" title="5. AI-Generated Content">
              <p>
                Our chatbot and blog generation features use artificial
                intelligence. AI responses may contain inaccuracies. We display
                a disclaimer on all AI-powered features. Users should verify
                important information independently, especially regarding event
                dates, locations, pricing, and card valuations.
              </p>
              <p>
                eBay price data shown through our chatbot represents current
                asking prices or recent sold listings and should not be
                considered appraisals or guaranteed valuations.
              </p>
            </Section>

            <Section id="prohibited" title="6. Prohibited Conduct">
              <p>
                You agree not to: submit false or misleading event or shop
                information, use automated tools to scrape or harvest data from
                the platform, attempt to gain unauthorized access to other
                accounts or platform infrastructure, use the platform for
                illegal purposes, or interfere with the normal operation of the
                service.
              </p>
            </Section>

            <Section id="ip" title="7. Intellectual Property">
              <p>
                The KLLCTRS name, logo, design, and original content are owned
                by KLLCTRS. Third-party trademarks (PSA, Beckett, eBay, Topps,
                etc.) belong to their respective owners and are used for
                identification purposes only.
              </p>
            </Section>

            <Section id="warranties" title="8. Disclaimer of Warranties">
              <p>
                KLLCTRS is provided as-is without warranties of any kind. We do
                not guarantee the accuracy, completeness, or timeliness of event
                listings, shop information, or AI-generated content. We are not
                responsible for the actions of event organizers, shop owners, or
                other users.
              </p>
            </Section>

            <Section id="liability" title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, KLLCTRS shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising from your use of the platform, including but not
                limited to losses from attending events, purchasing cards based
                on AI-provided valuations, or relying on user-submitted
                information.
              </p>
            </Section>

            <Section id="termination" title="10. Termination">
              <p>
                We may suspend or terminate your account at any time for
                violation of these terms or for any reason at our discretion.
                You may delete your account at any time through your profile
                settings.
              </p>
            </Section>

            <Section id="changes" title="11. Changes">
              <p>
                We may modify these terms at any time. Material changes will be
                communicated via email to registered users. Continued use after
                changes constitutes acceptance.
              </p>
            </Section>

            <Section id="law" title="12. Governing Law">
              <p>
                These terms are governed by the laws of the United States. Any
                disputes shall be resolved in the courts of the State of
                Delaware.
              </p>
            </Section>

            <Section id="contact" title="13. Contact">
              <p>
                For questions about these terms, contact us at{" "}
                <a
                  href="mailto:legal@kllctbls.com"
                  className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700"
                >
                  legal@kllctbls.com
                </a>
                .
              </p>
            </Section>
          </article>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="border-b border-violet-100 pb-3 text-lg font-semibold tracking-tight text-[#171936] sm:text-xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 border-b border-zinc-100 pb-6 text-[15px] leading-7 text-zinc-600 last:border-0">
        {children}
      </div>
    </section>
  );
}
