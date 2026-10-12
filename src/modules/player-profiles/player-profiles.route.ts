import { Router } from 'express'
import { createPlayerProfileController, getAllPlayerProfilesController } from './player-profiles.controller.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { requireRole } from '../../middleware/require-role.js'
import { validateBody } from '../../middleware/validate.js'
import { createPlayerProfileSchema } from './player-profiles.schema.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin'), getAllPlayerProfilesController)
router.post('/', requireRole('admin'), validateBody(createPlayerProfileSchema), createPlayerProfileController)

export default router
