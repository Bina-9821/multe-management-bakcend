import { boolean, integer, pgTable } from 'drizzle-orm/pg-core'
import { playerProfiles } from './player-profile.js'
import { timestamps } from './column.helper.js'
import { fineRules } from './fine-rules.js'

export const fines = pgTable('fines', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  playerId: integer('player_id')
    .notNull()
    .references(() => playerProfiles.id, { onDelete: 'restrict' }),
  ruleId: integer('rule_id')
    .notNull()
    .references(() => fineRules.id, { onDelete: 'restrict' }),
  amount: integer('amount').notNull(),
  lateMinute: integer('late_minutes'),
  paid: boolean('paid').notNull().default(false),
  ...timestamps,
})
