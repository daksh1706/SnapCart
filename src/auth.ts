import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { supabase } from "./lib/supabase"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single()

        if (error || !user) {
          throw new Error("user doesn't exist")
        }
        if (!user.password) {
          throw new Error("Please use Google sign-in for this account")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          throw new Error("incorrect password")
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (!dbUser) {
          const { data: newUser } = await supabase
            .from("users")
            .insert({
              name: user.name,
              email: user.email,
              image: user.image
            })
            .select()
            .single()
          if (newUser) {
            user.id = newUser.id
            user.role = newUser.role
          }
        } else {
          user.id = dbUser.id
          user.role = dbUser.role
        }
      }
      return true
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60
  },
  secret: process.env.AUTH_SECRET
})
