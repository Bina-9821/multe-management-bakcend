import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth.js'
import { getMeController } from './me.controller.js'

// me.route.ts
const router = Router()

router.get('/', requireAuth, getMeController) // solo autenticazione, niente requireLinkedPlayer

export default router
