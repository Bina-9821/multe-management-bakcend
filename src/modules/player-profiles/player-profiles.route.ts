import { Router } from 'express'
import { getAllPlayerProfilesController } from './player-profiles.controller.js'

const router = Router()

router.get('/', getAllPlayerProfilesController)

export default router
