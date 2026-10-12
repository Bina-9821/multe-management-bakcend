import { z } from 'zod'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { playerProfiles } from '../../db/schema/player-profile.js'

export const createPlayerProfileSchema = createInsertSchema(playerProfiles, {
  firstName: (schema) => schema.min(1).trim(),
  lastName: (schema) => schema.min(1).trim(),
}).pick({
  profileImage: true,
  firstName: true,
  lastName: true,
})

export const updatePlayerProfileSchema = createUpdateSchema(playerProfiles, {
  firstName: (schema) => schema.min(1).trim(),
  lastName: (schema) => schema.min(1).trim(),
})
  .pick({
    profileImage: true,
    firstName: true,
    lastName: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Specifica almeno un campo da modificare',
  })

export type CreatePlayerProfileInput = z.infer<typeof createPlayerProfileSchema>
export type UpdatePlayerProfileInput = z.infer<typeof updatePlayerProfileSchema>
