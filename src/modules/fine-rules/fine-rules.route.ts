import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth.js'
import { requireRole } from '../../middleware/require-role.js'
import { validateBody } from '../../middleware/validate.js'
import { createFineRuleSchema, updateFineRuleSchema } from './fine-rules.schemas.js'
import { createFineRuleController, getAllFineRulesController, updateFineRuleController } from './fine-rules.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', getAllFineRulesController)
router.post('/', requireRole('admin'), validateBody(createFineRuleSchema), createFineRuleController)
router.patch('/:id', requireRole('admin'), validateBody(updateFineRuleSchema), updateFineRuleController)

export default router
