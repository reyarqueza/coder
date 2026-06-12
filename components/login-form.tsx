"use client";

import { Button } from "@/components/ui/button";
import { loginWithGitHub } from "@/app/actions/auth";

export function LoginForm() {
  return (
    <form action={loginWithGitHub}>
      <Button type="submit" className="w-full">
        Sign in with GitHub
      </Button>
    </form>
  );
}
