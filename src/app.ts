import { env } from './config/env.js'
import express from 'express'
import cors from 'cors'
import playerProfileRoutes from './modules/player-profiles/player-profiles.route.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.all('/api/auth/*splat', toNodeHandler(auth))
app.use(express.json())

// ROUTES
app.use('/player', playerProfileRoutes)

export default app
