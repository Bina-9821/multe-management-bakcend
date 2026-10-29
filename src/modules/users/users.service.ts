// users.service.ts
import { and, asc, eq, isNull, ne, notExists } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { user } from '../../db/schema/auth-schema.js'
import { playerProfiles } from '../../db/schema/player-profile.js'
import { AppError } from '../../lib/app-error.js'

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')

// chiave indipendente dall'ordine: "Lorenzo|Binaschi" e "Binaschi|Lorenzo" coincidono
const nameKey = (a: string, b: string) => [normalize(a), normalize(b)].sort().join('|')

export async function getPendingUsers() {
  const [pending, candidates] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .leftJoin(playerProfiles, eq(playerProfiles.userId, user.id))
      .where(and(isNull(playerProfiles.id)))
      .orderBy(asc(user.createdAt)),
    db
      .select({
        id: playerProfiles.id,
        firstName: playerProfiles.firstName,
        lastName: playerProfiles.lastName,
      })
      .from(playerProfiles)
      .where(and(eq(playerProfiles.isActive, true), isNull(playerProfiles.userId))),
  ])

  // se due giocatori liberi hanno la stessa chiave (omonimi) non suggeriamo nessuno
  const byName = new Map<string, number | null>()
  for (const p of candidates) {
    const key = nameKey(p.firstName, p.lastName)
    byName.set(key, byName.has(key) ? null : p.id)
  }

  return pending.map((u) => ({
    ...u,
    suggestedPlayerId: byName.get(nameKey(u.name, u.lastName)) ?? null,
  }))
}

export async function rejectPendingUser(id: string) {
  // controlla e agisce insieme: elimina solo se non è admin e non ha un giocatore collegato
  const [deleted] = await db
    .delete(user)
    .where(
      and(
        eq(user.id, id),
        ne(user.role, 'admin'),
        notExists(db.select().from(playerProfiles).where(eq(playerProfiles.userId, user.id)))
      )
    )
    .returning({ id: user.id })

  if (deleted) return

  // niente eliminato: scopriamo perché
  const [target] = await db
    .select({ role: user.role, playerId: playerProfiles.id })
    .from(user)
    .leftJoin(playerProfiles, eq(playerProfiles.userId, user.id))
    .where(eq(user.id, id))

  if (!target) throw new AppError(404, 'Utente non trovato')
  if (target.role === 'admin') throw new AppError(409, 'Non puoi eliminare un amministratore')
  throw new AppError(409, 'Utente collegato a un giocatore: scollegalo prima')
}
