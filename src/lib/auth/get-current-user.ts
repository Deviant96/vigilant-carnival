import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth-options'

type SessionWithUser = { user?: { id?: string; name?: string | null; email?: string | null } }

export async function getCurrentUser() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
  return session?.user ?? null
}
