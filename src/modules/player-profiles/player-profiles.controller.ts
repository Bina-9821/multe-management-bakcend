import type { Request, Response } from 'express'
import { db } from '../../db/index.js'
import { playerProfiles } from '../../db/schema/player-profile.js'

export async function getAllPlayerProfilesController(req: Request, res: Response) {
  const players = await db.select().from(playerProfiles)

  res.json(players)
}
