import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function HomeRedirect(): Promise<null> {
  const session = await auth();
  redirect(session ? "/dashboard" : "/login");
  return null;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeRedirect />
    </Suspense>
  );
}
