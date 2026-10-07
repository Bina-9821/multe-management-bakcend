import { env } from '../config/env.js'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '../db/index.js'
import * as schema from '../db/schema/index.js'
import { DEFAULT_ROLE, USER_ROLES } from '../config/constants/role.js'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.frontendUrl],
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: false,
        defaultValue: DEFAULT_ROLE,
        input: false,
      },
    },
  },
})
