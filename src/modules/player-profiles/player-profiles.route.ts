import { Router } from 'express'
import {
  createPlayerProfileController,
  getAllPlayerProfilesController,
  linkPlayerProfileController,
  unlinkPlayerProfileController,
  updatePlayerProfileController,
} from './player-profiles.controller.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { requireRole } from '../../middleware/require-role.js'
import { validateBody } from '../../middleware/validate.js'
import { createPlayerProfileSchema, linkPlayerProfileSchema, updatePlayerProfileSchema } from './player-profiles.schema.js'

const router = Router()

router.use(requireAuth)
router.use(requireRole('admin'))

router.get('/', getAllPlayerProfilesController)
router.post('/', validateBody(createPlayerProfileSchema), createPlayerProfileController)
router.patch('/:id', validateBody(updatePlayerProfileSchema), updatePlayerProfileController)
router.patch('/:id/link', validateBody(linkPlayerProfileSchema), linkPlayerProfileController)
router.patch('/:id/unlink', unlinkPlayerProfileController)

export default router
