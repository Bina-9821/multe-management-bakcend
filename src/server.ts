// src/server.ts

import { env } from './config/env.js'
import app from './app.js'

const PORT = env.port || 3000

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`)
})
