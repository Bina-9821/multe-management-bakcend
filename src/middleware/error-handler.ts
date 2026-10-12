// src/middlewares/error-handler.ts
import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/app-error.js'

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route non trovata: ${req.method} ${req.originalUrl}` })
}

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ message: 'Errore interno del server' })
}
