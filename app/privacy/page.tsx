import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy — EngyNation',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="privacy-page">
          <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <p className="privacy-updated">Last updated: June 2026</p>

            <p>EngyNation (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our platform at engynation.com.</p>

            <h2>1. Information We Collect</h2>
            <h3>Account Information</h3>
            <p>When you sign up, we collect your name, email address, and optionally your username and profile photo. Authentication is handled by Clerk, a third-party identity provider. We do not store your password.</p>

            <h3>Profile Information</h3>
            <p>You may optionally provide your engineering discipline, graduation year, and job title. This information is used to personalize your experience and is visible to other users in the forum.</p>

            <h3>Forum Content</h3>
            <p>Posts and comments you create are stored on our servers and visible to all registered users. We retain this content as long as your account is active or as needed to provide the service.</p>

            <h3>Salary Data</h3>
            <p>If you submit salary information, it is stored anonymously. We do not associate submitted salary records with your name, email, or profile in any publicly visible way. Aggregate statistics derived from submissions are shown publicly.</p>

            <h3>Usage Data</h3>
            <p>We collect standard server logs including IP addresses, browser type, and pages visited to maintain security and performance. This data is not sold or shared with third parties.</p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide, operate, and improve the EngyNation platform</li>
              <li>To personalize your experience based on your engineering discipline</li>
              <li>To send transactional emails (account confirmation, password reset)</li>
              <li>To generate anonymous aggregate salary statistics for the community</li>
              <li>To detect and prevent spam, abuse, and violations of our community guidelines</li>
            </ul>

            <h2>3. AI-Generated Content</h2>
            <p>EngyNation uses Google&apos;s Gemini AI to generate advisory replies in the forum. AI-generated posts are clearly labeled. Content you submit may be used as context for generating these replies, but is not used to train AI models.</p>

            <h2>4. Sharing of Information</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul>
              <li><strong>Clerk</strong> — identity and authentication management</li>
              <li><strong>Supabase</strong> — database hosting (data is stored in US-East)</li>
              <li><strong>Vercel</strong> — web hosting and edge infrastructure</li>
              <li><strong>Google AI</strong> — AI-generated forum replies (post content only, no PII)</li>
            </ul>
            <p>All third-party providers are contractually required to protect your data.</p>

            <h2>5. Data Retention</h2>
            <p>We retain your account information and forum content for as long as your account remains active. You may request deletion of your account and associated data at any time by emailing us.</p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your forum posts and comments</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:mohammad.nj@uky.edu">mohammad.nj@uky.edu</a>.</p>

            <h2>7. Cookies</h2>
            <p>We use essential cookies for authentication (session tokens via Clerk) and user preferences (theme setting). We do not use advertising or tracking cookies.</p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>EngyNation is intended for users 13 years of age and older. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes via email or an in-app notice. Continued use of the platform after changes constitutes your acceptance of the updated policy.</p>

            <h2>10. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>General inquiries: <a href="mailto:mohammad.nj@uky.edu">mohammad.nj@uky.edu</a></li>
              <li>University partnerships: <a href="mailto:nikhil.akula@uky.edu">nikhil.akula@uky.edu</a></li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
