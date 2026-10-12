import type { Request, Response } from 'express'
import { db } from '../../db/index.js'
import { playerProfiles } from '../../db/schema/player-profile.js'
import { CreatePlayerProfileInput } from './player-profiles.schema.js'

export async function getAllPlayerProfilesController(req: Request, res: Response) {
  const players = await db.select().from(playerProfiles)

  res.json(players)
}

export async function createPlayerProfileController(req: Request, res: Response) {
  const { firstName, lastName }: CreatePlayerProfileInput = req.body
  const [newPlayer] = await db.insert(playerProfiles).values({ firstName, lastName }).returning()

  res.json(newPlayer)
}
