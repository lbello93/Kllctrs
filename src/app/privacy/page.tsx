import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | KLLCTBLS",
  description:
    "KLLCTBLS privacy policy — how we collect, use, and protect your data.",
};

const SECTIONS = [
  { id: "collect", title: "1. Information We Collect" },
  { id: "use", title: "2. How We Use Your Information" },
  { id: "ai", title: "3. AI-Powered Features" },
  { id: "sharing", title: "4. Data Sharing" },
  { id: "security", title: "5. Data Security" },
  { id: "cookies", title: "6. Cookies" },
  { id: "rights", title: "7. Your Rights" },
  { id: "children", title: "8. Children" },
  { id: "changes", title: "9. Changes" },
  { id: "contact", title: "10. Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last updated: May 2, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <nav className="lg:sticky lg:top-8 lg:h-fit lg:w-56 lg:shrink-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              On this page
            </p>
            <ul className="space-y-1 text-sm">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-1.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 flex-1 space-y-10">
            <Section id="collect" title="1. Information We Collect">
              <p>
                When you create an account on KLLCTBLS, we collect your email
                address and password. We also store your preferences including
                saved shows, saved shops, alert state selections, and topic
                interests.
              </p>
              <p>
                When you submit a card show or shop listing, we collect the
                event or business details you provide (name, location, contact
                information, website).
              </p>
              <p>
                We automatically collect basic usage data including pages
                visited, features used, and timestamps. We do not use
                third-party tracking pixels or sell your data to advertisers.
              </p>
            </Section>

            <Section id="use" title="2. How We Use Your Information">
              <p>
                We use your information to provide and improve the KLLCTBLS
                platform, including personalizing your experience with saved
                shows and state-based alerts. Your email is used for account
                authentication, event alert notifications you opt into, and
                important service updates.
              </p>
              <p>
                Submitted event and shop listings are reviewed by our team and,
                once approved, displayed publicly on the platform.
              </p>
            </Section>

            <Section id="ai" title="3. AI-Powered Features">
              <p>
                KLLCTBLS uses Google Gemini to power our chatbot assistant and
                blog content generation. When you interact with the chatbot,
                your messages are sent to Google Gemini for processing. We log
                conversations for quality improvement and abuse prevention.
                AI-generated blog posts are reviewed by our editorial team
                before publication.
              </p>
              <p>
                We also query the eBay Browse API to display public sold-listing
                prices when users research card values. No eBay user data is
                collected or stored.
              </p>
            </Section>

            <Section id="sharing" title="4. Data Sharing">
              <p>
                We do not sell, rent, or share your personal information with
                third parties for marketing purposes. We share data only with
                service providers necessary to operate the platform: Supabase
                (database and authentication), Google Cloud (maps, AI services),
                eBay (public listing data), MailerLite (email notifications),
                and Vercel (hosting).
              </p>
            </Section>

            <Section id="security" title="5. Data Security">
              <p>
                We use industry-standard security measures including encrypted
                connections (HTTPS), secure cookie-based authentication,
                row-level security policies on our database, and
                environment-variable storage for all API credentials. Passwords
                are hashed and never stored in plain text.
              </p>
            </Section>

            <Section id="cookies" title="6. Cookies">
              <p>
                We use essential cookies for authentication and session
                management. We do not use advertising or tracking cookies. You
                can manage cookie preferences through our cookie consent banner.
              </p>
            </Section>

            <Section id="rights" title="7. Your Rights">
              <p>
                You can access, update, or delete your account data at any time
                through your dashboard settings. To request complete data
                deletion, contact us at the email below. We respond to all data
                requests within 30 days.
              </p>
            </Section>

            <Section id="children" title="8. Children">
              <p>
                KLLCTBLS is not directed at children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe we have collected such information, please
                contact us immediately.
              </p>
            </Section>

            <Section id="changes" title="9. Changes">
              <p>
                We may update this policy from time to time. We will notify
                registered users of material changes via email. Continued use of
                the platform after changes constitutes acceptance of the updated
                policy.
              </p>
            </Section>

            <Section id="contact" title="10. Contact">
              <p>
                For privacy questions or data requests, contact us at{" "}
                <a
                  href="mailto:privacy@kllctbls.com"
                  className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-700"
                >
                  privacy@kllctbls.com
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
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-600">
        {children}
      </div>
    </section>
  );
}
