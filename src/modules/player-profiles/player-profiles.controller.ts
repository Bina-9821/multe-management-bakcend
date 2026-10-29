import type { Request, Response } from 'express'
import {
  CreatePlayerProfileInput,
  LinkPlayerProfileInput,
  ListPlayersQueryInput,
  UpdatePlayerProfileInput,
} from './player-profiles.schema.js'
import {
  createPlayerProfile,
  getAllPlayerProfiles,
  linkPlayerProfile,
  unlinkPlayerProfile,
  updatePlayerProfiles,
} from './player-profiles.service.js'
import { idParamSchema } from '../../lib/schemas.js'
import { listPlayersQuerySchema } from './player-profiles.schema.js'

export async function getAllPlayerProfilesController(req: Request, res: Response) {
  const query: ListPlayersQueryInput = listPlayersQuerySchema.parse(req.query)
  const players = await getAllPlayerProfiles(query)

  res.status(200).json(players)
}

export async function createPlayerProfileController(req: Request, res: Response) {
  const input: CreatePlayerProfileInput = req.body
  const newPlayer = await createPlayerProfile(input)

  res.status(201).json(newPlayer)
}

export async function updatePlayerProfileController(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params)
  const input: UpdatePlayerProfileInput = req.body
  const player = await updatePlayerProfiles(id, input)

  res.status(200).json(player)
}

export async function linkPlayerProfileController(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params)
  const input: LinkPlayerProfileInput = req.body
  const profile = await linkPlayerProfile(id, input)

  res.status(200).json(profile)
}

export async function unlinkPlayerProfileController(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params)
  const profile = await unlinkPlayerProfile(id)

  res.status(200).json(profile)
}
