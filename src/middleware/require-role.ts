// src/middlewares/require-role.ts
import type { Request, Response, NextFunction } from 'express'
import { getSession } from '../lib/get-session.js'
import { UserRole } from '../config/constants/role.js'
import { AppError } from '../lib/app-error.js'

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user
    if (!user) throw new AppError(401, 'Non autenticato')

    if (!allowedRoles.includes(user.role as UserRole)) {
      res.status(403).json({ message: 'Permessi insufficienti' })
      return
    }

    next()
  }
