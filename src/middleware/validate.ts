import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body)
    return next()
  }
}
