import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "user"
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string
        session.user.role = (token.role || "user") as string
      }
      return session
    }
  }
}
