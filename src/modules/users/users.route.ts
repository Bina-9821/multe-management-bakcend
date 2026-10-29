import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth.js'
import { requireRole } from '../../middleware/require-role.js'
import { getPendingUsersController, rejectPendingUserController } from './users.controller.js'

// users.route.ts
const router = Router()

router.use(requireAuth, requireRole('admin'))

router.get('/', getPendingUsersController)
router.delete('/:id', rejectPendingUserController)

export default router
