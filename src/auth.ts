import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import connectDb from "./lib/db"
import User from "./models/user.model"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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

        const user = await User.findOne({ email }).lean()
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
          id: (user as any)._id.toString(),
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
    async signIn() {
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const email = user.email?.trim().toLowerCase()
        if (email) {
          await connectDb()
          let dbUser = await User.findOne({ email })
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || "User",
              email: email,
              image: user.image || "",
              role: "user"
            })
          }
          token.id = dbUser._id.toString()
          token.role = dbUser.role || "user"
          token.name = dbUser.name
          token.email = dbUser.email
        }
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id || token.sub) as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = (token.role || "user") as string
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
})
