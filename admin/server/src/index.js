import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { createRequire } from 'module'

dotenv.config()

const require = createRequire(import.meta.url)

// Import CommonJS modules using require
const facultyRoutes = require('../../../server/src/routes/faculty.routes')
const courseRoutes = require('../../../server/src/routes/course.routes')
const testimonialRoutes = require('../../../server/src/routes/testimonial.routes')

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Mount only what admin needs
app.use(facultyRoutes)
app.use(courseRoutes)
app.use('/api/testimonials', testimonialRoutes) // read-only

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'admin-server' }))

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
    console.log(`Admin server running on port ${PORT}`)
})
