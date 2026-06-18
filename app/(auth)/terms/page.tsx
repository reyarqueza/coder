import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By accessing or using Coder Bahamuto, you agree to these Terms of
        Service. If you do not agree, do not use the service.
      </p>

      <h2>Use of the service</h2>
      <p>
        Coder Bahamuto provides a platform to practice front-end development
        skills. You must use the service lawfully and in accordance with these
        terms. You are responsible for activity that occurs under your account.
      </p>

      <h2>Accounts</h2>
      <p>
        You sign in through GitHub. You are responsible for maintaining the
        security of your GitHub account and for all activity conducted through
        your Coder Bahamuto account.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The service, including its design, branding, and software, is owned by
        Coder Bahamuto. You retain ownership of content you create while using
        the service, subject to any licenses needed to operate the platform.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any
        kind. We do not guarantee uninterrupted or error-free operation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Coder Bahamuto is not liable
        for indirect, incidental, or consequential damages arising from your use
        of the service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        service after changes take effect constitutes acceptance of the updated
        terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:legal@coderbahamuto.com">legal@coderbahamuto.com</a>.
      </p>
    </LegalPage>
  );
}
