import type { Request, Response } from 'express'
import { getSession } from '../../lib/get-session.js'
import { CreateFineRuleInput, UpdateFineRuleInput } from './fine-rules.schemas.js'
import { createFineRule, getAllFineRules, updateFineRule } from './fine-rules.service.js'

import { DEFAULT_ROLE } from '../../config/constants/role.js'

export async function getAllFineRulesController(req: Request, res: Response) {
  const { user } = getSession(res)
  const role = user.role ?? DEFAULT_ROLE
  const rules = await getAllFineRules(role)
  res.status(200).json(rules)
}

export async function createFineRuleController(req: Request, res: Response) {
  const input: CreateFineRuleInput = req.body
  const rule = await createFineRule(input)

  res.status(201).json(rule)
}

export async function updateFineRuleController(req: Request, res: Response) {
  const fineRuleId = Number(req.params.id)
  const input: UpdateFineRuleInput = req.body
  const rule = await updateFineRule({ fineRuleId, input })

  res.status(200).json(rule)
}
