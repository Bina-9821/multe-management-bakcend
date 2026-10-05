import { pgTable, integer, pgEnum, text, boolean } from 'drizzle-orm/pg-core'
import { timestamps } from './column.helper.js'

export const fineRulesTypes = pgEnum('fine_rules_types', ['fixed', 'per_minute'])

export const fineRules = pgTable('fine_rules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  type: fineRulesTypes('type').notNull(),
  amount: integer('amount').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  ...timestamps,
})
