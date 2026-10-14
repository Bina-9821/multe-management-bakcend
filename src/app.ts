import { env } from './config/env.js'
import express from 'express'
import cors from 'cors'
import playerProfileRoutes from './modules/player-profiles/player-profiles.route.js'
import fineRulesRoutes from './modules/fine-rules/fine-rules.route.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'
import { errorHandler, notFound } from './middleware/error-handler.js'

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
)
// AUTH ROUTES BETTER AUTH
app.all('/api/auth/*splat', toNodeHandler(auth))

// Global Middlewares
app.use(express.json())

// ROUTES
app.use('/player', playerProfileRoutes)
app.use('/fine-rules', fineRulesRoutes)

app.use(notFound)
app.use(errorHandler)
export default app
