// src/types/express.d.ts
import { playerProfiles } from '../db/schema/player-profile.ts'
import type { auth } from '../lib/auth.js'

type SessionUser = typeof auth.$Infer.Session.user
type Player = typeof playerProfiles.$inferSelect

declare global {
  namespace Express {
    interface Locals {
      user?: SessionUser
      player?: Player
    }
  }
}
