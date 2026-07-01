import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import NeonAdapter from "@auth/neon-adapter";
import { getPool } from "@/lib/db/pool";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = getPool();
  return {
    adapter: NeonAdapter(pool),
    providers: [GitHub],
    session: { strategy: "database" },
    pages: { signIn: "/login" },
    trustHost: true,
  };
});
