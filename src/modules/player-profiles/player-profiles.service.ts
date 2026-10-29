import { and, asc, eq, ilike, isNotNull, isNull, or, type SQL } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { playerProfiles } from '../../db/schema/player-profile.js'
import {
  CreatePlayerProfileInput,
  LinkPlayerProfileInput,
  ListPlayersQueryInput,
  UpdatePlayerProfileInput,
} from './player-profiles.schema.js'
import { AppError } from '../../lib/app-error.js'

export async function getAllPlayerProfiles(query: ListPlayersQueryInput) {
  const conditions: SQL[] = []

  // Filtro per status: active, archived, all
  if (query.status === 'active') {
    conditions.push(eq(playerProfiles.isActive, true))
  } else if (query.status === 'archived') {
    conditions.push(eq(playerProfiles.isActive, false))
  }

  // Filtro per link: linked, unlinked, all
  if (query.link === 'linked') {
    conditions.push(isNotNull(playerProfiles.userId))
  } else if (query.link === 'unlinked') {
    conditions.push(isNull(playerProfiles.userId))
  }

  // Filtro per search: cerca per nome o cognome
  if (query.search) {
    const escaped = query.search.replace(/[%_\\]/g, '\\$&') // % e _ non fanno da jolly
    const searchPattern = `%${escaped}%`

    const searchCondition = or(
      ilike(playerProfiles.firstName, searchPattern),
      ilike(playerProfiles.lastName, searchPattern)
    )
    if (searchCondition) conditions.push(searchCondition)
  }

  const whereClause = conditions.length ? and(...conditions) : undefined

  return db.select().from(playerProfiles).where(whereClause).orderBy(
    asc(playerProfiles.lastName),
    asc(playerProfiles.firstName),
    asc(playerProfiles.id) // spareggio: l'ordine resta stabile
  )
}

export async function createPlayerProfile(input: CreatePlayerProfileInput) {
  const [newPlayer] = await db.insert(playerProfiles).values(input).returning()

  return newPlayer
}

export async function updatePlayerProfiles(id: number, input: UpdatePlayerProfileInput) {
  const [player] = await db.update(playerProfiles).set(input).where(eq(playerProfiles.id, id)).returning()

  if (!player) throw new AppError(404, 'Nessun giocatore trovato')

  return player
}

export async function linkPlayerProfile(id: number, input: LinkPlayerProfileInput) {
  const [updated] = await db
    .update(playerProfiles)
    .set({ userId: input.userId })
    .where(
      and(
        eq(playerProfiles.id, id),
        isNull(playerProfiles.userId), // non già collegato
        eq(playerProfiles.isActive, true) // non archiviato
      )
    )
    .returning()

  if (updated) return updated

  // L'update non ha toccato nulla: scopriamo perché
  const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.id, id))

  if (!profile) throw new AppError(404, 'Nessun giocatore trovato')
  if (!profile.isActive) throw new AppError(409, 'Il giocatore è archiviato')
  throw new AppError(409, 'Il giocatore è già collegato a un utente')
}

export async function unlinkPlayerProfile(id: number) {
  const [updated] = await db.update(playerProfiles).set({ userId: null }).where(eq(playerProfiles.id, id)).returning()

  if (!updated) throw new AppError(404, 'Nessun giocatore trovato')
  return updated
}
