import { env } from '../config/env.js'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not defined')
}

const sql = neon(env.databaseUrl)
export const db = drizzle(sql)
