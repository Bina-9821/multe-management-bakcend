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
    isActive: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Specifica almeno un campo da modificare',
  })

export const listPlayersQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  status: z.enum(['active', 'archived', 'all']).default('active'),
  link: z.enum(['linked', 'unlinked', 'all']).default('all'),
})

export const linkPlayerProfileSchema = z.object({
  userId: z.string().min(1),
})

export type CreatePlayerProfileInput = z.infer<typeof createPlayerProfileSchema>
export type UpdatePlayerProfileInput = z.infer<typeof updatePlayerProfileSchema>
export type ListPlayersQueryInput = z.infer<typeof listPlayersQuerySchema>
export type LinkPlayerProfileInput = z.infer<typeof linkPlayerProfileSchema>
