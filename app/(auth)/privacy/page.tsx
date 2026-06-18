import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Coder Bahamuto (&quot;we&quot;, &quot;us&quot;) respects your privacy.
        This policy explains what personal data we collect, why we collect it,
        and how we handle it.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you sign in with GitHub, we receive your public profile
        information (such as your name, email address, and avatar) to create and
        maintain your account. We also store session data necessary to keep you
        signed in.
      </p>

      <h2>How we use your information</h2>
      <p>
        We use your information to authenticate you, provide access to the
        service, and maintain the security and integrity of your account. We do
        not sell your personal data.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain account and session data for as long as your account is
        active or as needed to provide the service. You may request deletion of
        your account by contacting us.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, or restrict processing of your personal data. Contact us to
        exercise these rights.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy-related questions, contact us at{" "}
        <a href="mailto:privacy@coderbahamuto.com">privacy@coderbahamuto.com</a>
        .
      </p>
    </LegalPage>
  );
}
