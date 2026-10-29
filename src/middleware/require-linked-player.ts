import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/app-error.js'
import { db } from '../db/index.js'
import { playerProfiles } from '../db/schema/player-profile.js'
import { eq } from 'drizzle-orm'

export async function requireLinkedPlayer(_req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user
  if (!user) throw new AppError(401, 'Utente non autenticato')

  const [player] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, user.id))
  if (!player) throw new AppError(403, 'In attesa di approvazione')
  if (!player.isActive) throw new AppError(403, 'Il tuo profile è stato disattivato')

  res.locals.player = player
  next()
}
