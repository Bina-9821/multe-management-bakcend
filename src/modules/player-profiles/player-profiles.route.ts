import { Router } from 'express'
import { getAllPlayerProfilesController } from './player-profiles.controller.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { requireRole } from '../../middleware/require-role.js'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole('admin'), getAllPlayerProfilesController)

export default router
