import { LegalPage } from "@/components/legal-page";

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        This Cookie Policy explains how Coder Bahamuto uses cookies and similar
        technologies when you visit our website.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. They help websites
        remember your preferences and keep you signed in.
      </p>

      <h2>Cookies we use</h2>
      <p>
        <strong>Essential cookies</strong> are required for the site to
        function. They include authentication and session cookies that keep you
        signed in securely. These cannot be disabled while using the service.
      </p>
      <p>
        <strong>Preference cookies</strong> remember choices you make, such as
        your cookie consent selection, so we do not ask you again on every
        visit.
      </p>
      <p>
        <strong>Analytics cookies</strong> (optional) help us understand how
        visitors use the site so we can improve the product. These are only set
        if you choose &quot;Accept all&quot; in the cookie banner.
      </p>

      <h2>Managing your preferences</h2>
      <p>
        When you first visit, you can accept all cookies or choose essential
        cookies only. To change your preference, clear site data in your browser
        or delete the <code>coder-bahamuto-cookie-consent</code> entry from
        local storage, then reload the page.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        When you sign in with GitHub, GitHub may set its own cookies as part of
        the authentication flow. Please refer to GitHub&apos;s privacy and
        cookie policies for details.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href="mailto:privacy@coder.bahamuto.com">privacy@coder.bahamuto.com</a>
        .
      </p>
    </LegalPage>
  );
}
