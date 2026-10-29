// users.controller.ts
import type { Request, Response } from 'express'
import { getPendingUsers, rejectPendingUser } from './users.service.js'
import { userIdParamSchema } from './users.schema.js'

export async function getPendingUsersController(_req: Request, res: Response) {
  res.json(await getPendingUsers())
}

export async function rejectPendingUserController(req: Request, res: Response) {
  const { id } = userIdParamSchema.parse(req.params)
  await rejectPendingUser(id)
  res.status(204).send()
}
