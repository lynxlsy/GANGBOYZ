import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import { FirestoreAdapter } from "@auth/firebase-adapter"
// import { db } from "@/lib/firebase-config"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  // adapter: FirestoreAdapter(db),
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt' as const,
  },
}

export default NextAuth(authOptions)





