// src/config/env.ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Variabili d'ambiente non valide:")
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = {
  databaseUrl: parsed.data.DATABASE_URL,
  frontendUrl: parsed.data.FRONTEND_URL,
  authSecret: parsed.data.BETTER_AUTH_SECRET,
  authUrl: parsed.data.BETTER_AUTH_URL,
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
}
