import { asc, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { fineRules } from '../../db/schema/fine-rules.js'
import { CreateFineRuleInput, UpdateFineRuleInput } from './fine-rules.schemas.js'
import { UserRole } from '../../config/constants/role.js'

export async function getAllFineRules(role: UserRole) {
  if (role === 'admin') {
    const allRules = await db.select().from(fineRules).orderBy(asc(fineRules.name))
    return allRules
  }

  const activeRules = await db.select().from(fineRules).where(eq(fineRules.isActive, true)).orderBy(asc(fineRules.name))

  return activeRules
}

export async function createFineRule(input: CreateFineRuleInput) {
  const [rule] = await db.insert(fineRules).values(input).returning()

  if (!rule) {
    throw new Error('Creazione della regola non riuscita')
  }

  return rule
}

export async function updateFineRule({ fineRuleId, input }: { fineRuleId: number; input: UpdateFineRuleInput }) {
  const [rule] = await db.update(fineRules).set(input).where(eq(fineRules.id, fineRuleId)).returning()

  if (!rule) {
    throw new Error(`Regola con ID ${fineRuleId} non trovata`)
  }

  return rule
}
