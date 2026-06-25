import { LoggedOutBahamutoBackground } from "@/components/logged-out-bahamuto-background";
import { LoginForm } from "@/components/login-form";
import { PageContainer } from "@/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <>
      <LoggedOutBahamutoBackground />
      <main className="relative z-10 flex w-full flex-1 flex-col justify-center py-16">
        <PageContainer className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <section className="max-w-xl text-center lg:max-w-2xl lg:text-left">
          <p className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Coder Bahamuto
          </p>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Practice your front end skills!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            In the age of AI, agents will be writing code for you, so how can you
            be the Reviewer in the middle if you forgot how to code? Use Coder
            Bahamuto to keep your coding skills intact!
          </p>
        </section>

        <Card className="w-full max-w-md shrink-0">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Sign in with GitHub to start practicing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        </PageContainer>
      </main>
    </>
  );
}
