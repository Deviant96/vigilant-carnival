import CredentialsProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

type SessionShape = {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
  }
}

type JwtContext = { token: JWT; user?: { id?: string } | null }
type SessionContext = { session: SessionShape; token: JWT }
export const authOptions = {
  session: { strategy: 'jwt' as const },
  providers: [
    CredentialsProvider({
      name: 'Email login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        name: { label: 'Name', type: 'text', placeholder: 'Optional name' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase()
        if (!email) return null

        const user = await prisma.user.upsert({
          where: { email },
          update: { name: credentials?.name?.toString() || undefined },
          create: { email, name: credentials?.name?.toString() || null },
        })

        return { id: user.id, email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: JwtContext): Promise<JWT> {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: SessionContext): Promise<SessionShape> {
      if (token?.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
