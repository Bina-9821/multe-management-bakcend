import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from './column.helper.js'
import { user } from './auth-schema.js'

export const playerProfiles = pgTable('player_profiles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .unique()
    .references(() => user.id, { onDelete: 'set null' }),
  profileImage: text('profile_image'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  ...timestamps,
})
