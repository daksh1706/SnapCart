import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import connectDb from "./lib/db"
import User from "./models/user.model"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDb()
        const email = (credentials?.email as string)?.trim().toLowerCase()
        const password = credentials?.password as string

        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        const user = await User.findOne({ email })
        if (!user) {
          throw new Error("User doesn't exist")
        }
        if (!user.password) {
          throw new Error("Please use Google sign-in for this account")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          throw new Error("Incorrect password")
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user"
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
        await connectDb()
        const email = user.email?.trim().toLowerCase()
        if (!email) return false

        let dbUser = await User.findOne({ email })
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "User",
            email: email,
            image: user.image || "",
            role: "user"
          })
        }
        user.id = dbUser._id.toString()
        user.role = dbUser.role || "user"
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = (user as any).role || "user"
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
