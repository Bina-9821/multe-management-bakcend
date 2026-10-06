import express from 'express'
import cors from 'cors'
import playerProfileRoutes from './modules/player-profiles/player-profiles.route.js'

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.use(express.json())

// ROUTES
app.use('/player', playerProfileRoutes)

export default app
