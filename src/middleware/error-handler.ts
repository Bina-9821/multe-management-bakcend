// src/middlewares/error-handler.ts
import { ZodError } from 'zod'
import { AppError } from '../lib/app-error.js'
import type { Request, Response, NextFunction } from 'express'

type PgError = { code?: string; constraint?: string }

// Drizzle può avvolgere l'errore di Postgres dentro `cause`, quindi lo cerco anche lì
const getPgError = (err: unknown): PgError | undefined => {
  if (typeof err !== 'object' || err === null) return undefined
  if ('code' in err) return err as PgError
  if ('cause' in err) return getPgError(err.cause)
  return undefined
}

// nome del vincolo (guardalo nella migration o nel log) -> messaggio
const uniqueMessages: Record<string, string> = {
  player_name_idx: 'Esiste già un giocatore con questo nome e cognome',
  player_profiles_user_id_unique: 'Questo utente è già collegato a un giocatore',
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route non trovata: ${req.method} ${req.originalUrl}` })
}

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Dati non validi',
      errors: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  const pgErr = getPgError(err)

  // duplicato su vincolo unico
  if (pgErr?.code === '23505') {
    res.status(409).json({
      message: (pgErr.constraint && uniqueMessages[pgErr.constraint]) ?? 'Esiste già un elemento con questi dati',
    })
    return
  }

  // foreign key violata (es. userId che non esiste)
  if (pgErr?.code === '23503') {
    res.status(409).json({ message: 'Riferimento a un elemento inesistente o ancora in uso' })
    return
  }

  console.error(err)
  res.status(500).json({ message: 'Errore interno del server' })
}
