import { Router } from 'express'
import { getAllPlayerProfilesController } from './player-profiles.controller.js'
import { requireAuth } from '../../middleware/require-auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getAllPlayerProfilesController)

export default router
