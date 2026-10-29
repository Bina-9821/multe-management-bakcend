import { AppError } from '../../lib/app-error.js'
import { getMe } from './me.service.js'
import type { Request, Response } from 'express'

export async function getMeController(_req: Request, res: Response) {
  const user = res.locals.user
  if (!user) throw new AppError(401, 'Non autenticato')

  res.json(await getMe(user.id))
}
