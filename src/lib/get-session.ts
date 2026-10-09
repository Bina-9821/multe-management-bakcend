// src/lib/get-session.ts
import type { Response } from 'express'
import type { auth } from './auth.js'

export type AuthSession = typeof auth.$Infer.Session

export const getSession = (res: Response): AuthSession => {
  const session = res.locals.session as AuthSession | undefined
  if (!session) {
    throw new Error('Session missing: requireAuth is not applied on this route')
  }
  return session
}
