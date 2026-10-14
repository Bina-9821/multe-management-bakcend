import { createInsertSchema } from 'drizzle-zod'
import { fineRules } from '../../db/schema/fine-rules.js'
import z from 'zod'

export const createFineRuleSchema = createInsertSchema(fineRules, {
  name: (schema) => schema.trim().min(1),
  amount: (schema) => schema.positive(),
}).pick({ name: true, type: true, amount: true })

export const updateFineRuleSchema = createFineRuleSchema.partial()

export type CreateFineRuleInput = z.infer<typeof createFineRuleSchema>
export type UpdateFineRuleInput = CreateFineRuleInput
