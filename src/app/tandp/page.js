// src/app/tandp/page.js

import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";

export default function TermsAndPrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top bar */}
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title + intro */}
        <section className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--foreground)]/50 mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            Terms of Use, Privacy Policy & AI Usage
          </h1>
          <p className="text-sm sm:text-base text-[var(--foreground)]/70 max-w-2xl">
            These pages explain how StoryVerse works, what’s expected from
            you as a reader or writer, and how we handle your data and the
            use of AI tools. This is a draft / placeholder – replace with
            your real legal copy before going to production.
          </p>
        </section>

        {/* Quick navigation */}
        <nav className="mb-10 sm:mb-12">
          <div className="inline-flex flex-wrap gap-2 text-xs sm:text-sm">
            <a
              href="#terms"
              className="px-3 py-1.5 rounded-full border border-[var(--foreground)]/20 text-[var(--foreground)]/80 hover:border-[var(--foreground)]/40 hover:bg-[var(--foreground)]/5 transition"
            >
              Terms of Use
            </a>
            <a
              href="#privacy"
              className="px-3 py-1.5 rounded-full border border-[var(--foreground)]/20 text-[var(--foreground)]/80 hover:border-[var(--foreground)]/40 hover:bg-[var(--foreground)]/5 transition"
            >
              Privacy Policy
            </a>
            <a
              href="#ai-policy"
              className="px-3 py-1.5 rounded-full border border-[var(--foreground)]/20 text-[var(--foreground)]/80 hover:border-[var(--foreground)]/40 hover:bg-[var(--foreground)]/5 transition"
            >
              AI Usage Policy
            </a>
          </div>
        </nav>

        {/* TERMS OF USE */}
        <section id="terms" className="mb-16 sm:mb-20 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-4">
            Terms of Use
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground)]/60 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-sm sm:text-base text-[var(--foreground)]/80 leading-relaxed">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                1. Your agreement with StoryVerse
              </h3>
              <p>
                By creating an account or using StoryVerse in any way, you
                are agreeing to these Terms of Use. If you do not agree,
                please do not use the platform.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                2. Eligibility
              </h3>
              <p>
                You must be old enough to use online services under the laws
                of your country (typically 13+). If you’re under the required
                age, you may only use StoryVerse with permission and
                supervision from a parent or guardian.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                3. Your content
              </h3>
              <p className="mb-2">
                StoryVerse lets you publish stories, comments, and other
                content. You keep ownership of anything you create. However,
                by posting on StoryVerse you grant us a worldwide,
                non-exclusive license to store, display, and distribute your
                content in order to operate the platform.
              </p>
              <p className="mb-1">
                You agree that your content will not contain:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Illegal content or content that promotes illegal activity</li>
                <li>Harassment, hate speech, or threats</li>
                <li>Sexually explicit or highly graphic violent material</li>
                <li>Spam, scams, or misleading promotions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                4. Our rights over your account
              </h3>
              <p>
                We may suspend or remove accounts and content that break
                these Terms, harm other users, or put the platform at risk.
                We may also update or modify features without notice as the
                product evolves.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                5. No guarantees
              </h3>
              <p>
                StoryVerse is provided “as is”. We do not guarantee that the
                service will be always available, error-free, or suitable for
                any specific purpose. You use the platform at your own risk.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                6. Changes to these Terms
              </h3>
              <p>
                We may update these Terms periodically. When that happens,
                we will change the “Last updated” date above. If you continue
                using StoryVerse after changes go live, you are agreeing to
                the updated Terms.
              </p>
            </div>
          </div>
        </section>

        {/* PRIVACY POLICY */}
        <section id="privacy" className="mb-16 sm:mb-20 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-4">
            Privacy Policy
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground)]/60 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-sm sm:text-base text-[var(--foreground)]/80 leading-relaxed">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                1. What we collect
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Email, username, and profile details</li>
                <li>Usage data (stories read, likes, saves)</li>
                <li>Content you publish</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                2. How we use your data
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Operate and improve StoryVerse</li>
                <li>Secure accounts and prevent abuse</li>
                <li>Provide recommendations</li>
                <li>Analytics and performance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                3. Sharing of information
              </h3>
              <p>
                We do not sell personal information. Data may be shared with
                trusted services for infrastructure, analytics, or legal
                compliance.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                4. Cookies & local storage
              </h3>
              <p>
                Used for login sessions, preferences, and analytics. You can
                disable cookies in your browser, but some features may stop
                working.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                5. Data retention and deletion
              </h3>
              <p>
                You may request account deletion. Some data may be retained
                for legal and security compliance.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                6. Contact
              </h3>
              <p>
                For any privacy or legal concerns, contact us at:{" "}
                <a
                  href="mailto:madisettydharmadeep@gmail.com"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  madisettydharmadeep@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* AI USAGE POLICY */}
        <section id="ai-policy" className="mb-10 sm:mb-16 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-4">
            AI Usage Policy
          </h2>

          <p className="text-sm sm:text-base text-[var(--foreground)]/60 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-sm sm:text-base text-[var(--foreground)]/80 leading-relaxed">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                1. Our stance on AI
              </h3>
              <p>
                StoryVerse supports the responsible use of artificial
                intelligence (AI) as a creative assistance tool — not as a
                full replacement for human creativity. Stories on StoryVerse
                should always reflect meaningful human input, imagination, and
                intent.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                2. AI-generated cover images
              </h3>
              <p className="mb-2">
                You may use AI-generated images as cover art for your stories,
                provided that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You have the legal right to use those images</li>
                <li>
                  The images do not infringe on copyrights, trademarks, or
                  other intellectual property rights
                </li>
                <li>
                  The images do not contain illegal, explicit, hateful, or
                  otherwise harmful material
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                3. AI-assisted story writing
              </h3>
              <p className="mb-2">
                You may use AI tools to assist with:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Brainstorming and idea generation</li>
                <li>Editing, grammar, and clarity</li>
                <li>Rewriting or expanding specific sections</li>
                <li>Structuring and organizing your story</li>
              </ul>
              <p>
                However, the core idea, creative direction, and final
                responsibility for the story must belong to you. AI should
                support your writing, not replace it entirely.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                4. Prohibited AI usage
              </h3>
              <p className="mb-2">
                The following types of AI usage are not allowed on StoryVerse:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fully automated, mass-generated stories with minimal effort</li>
                <li>Spammy or repetitive AI-generated content</li>
                <li>Deceptive or misleading content created using AI</li>
                <li>
                  Content whose primary purpose is to game the platform or
                  ranking systems rather than tell a genuine story
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                5. User responsibility
              </h3>
              <p className="mb-2">
                By submitting content that involves AI assistance, you confirm
                that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You have the right to use the AI tools involved</li>
                <li>You take full responsibility for all published content</li>
                <li>Your content does not violate any laws or third-party rights</li>
                <li>Your work reflects meaningful human creative contribution</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-1.5">
                6. Enforcement
              </h3>
              <p>
                StoryVerse may remove AI-assisted content or restrict accounts
                if AI is used in a way that results in spam, low-quality
                output, copyright risk, or harm to the integrity and
                experience of the platform.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
