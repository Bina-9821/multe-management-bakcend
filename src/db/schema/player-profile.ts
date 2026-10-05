import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from './column.helper.js'

export const playerProfiles = pgTable('player_profiles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  profileImage: text('profile_image'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  ...timestamps,
})
