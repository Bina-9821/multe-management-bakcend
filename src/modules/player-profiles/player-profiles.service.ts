import { and, asc, eq, ilike, isNotNull, isNull, or, type SQL } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { playerProfiles } from '../../db/schema/player-profile.js'
import { CreatePlayerProfileInput, ListPlayersQueryInput, UpdatePlayerProfileInput } from './player-profiles.schema.js'
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
