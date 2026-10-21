// src/lib/schemas.ts  (o src/schemas/common.ts)
import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export type IdParam = z.infer<typeof idParamSchema>
