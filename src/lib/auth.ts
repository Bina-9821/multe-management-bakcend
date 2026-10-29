import { env } from '../config/env.js'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '../db/index.js'
import * as schema from '../db/schema/index.js'
import { DEFAULT_ROLE, USER_ROLES } from '../config/constants/role.js'
import { APIError, createAuthMiddleware } from 'better-auth/api'

const signupCode = process.env.SIGNUP_CODE
if (!signupCode) throw new Error('SIGNUP_CODE is not set in .env file')

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.frontendUrl],
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      lastName: { type: 'string', required: true, input: true },
      role: {
        type: [...USER_ROLES],
        required: false,
        defaultValue: DEFAULT_ROLE,
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // l'hook gira su tutti gli endpoint: ci interessa solo la registrazione
      if (ctx.path !== '/sign-up/email') return

      if (ctx.body?.inviteCode !== signupCode) {
        throw new APIError('FORBIDDEN', {
          message: 'Codice di registrazione non valido',
        })
      }
    }),
  },
})
