import { eq } from 'drizzle-orm'
import { user } from '../../db/schema/auth-schema.js'
import { playerProfiles } from '../../db/schema/player-profile.js'
import { AppError } from '../../lib/app-error.js'
import { db } from '../../db/index.js'

// me.service.ts
export async function getMe(userId: string) {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      playerProfile: {
        id: playerProfiles.id,
        firstName: playerProfiles.firstName,
        lastName: playerProfiles.lastName,
        profileImage: playerProfiles.profileImage,
        isActive: playerProfiles.isActive,
      },
    })
    .from(user)
    .leftJoin(playerProfiles, eq(playerProfiles.userId, user.id))
    .where(eq(user.id, userId))

  if (!row) throw new AppError(404, 'Utente non trovato')
  return row
}
