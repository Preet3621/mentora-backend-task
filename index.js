import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import lessonRoutes from './routes/lessonRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import llmRoutes from './routes/llmRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/students', studentRoutes)
app.use('/lessons', lessonRoutes)
app.use('/bookings', bookingRoutes)
app.use('/sessions', sessionRoutes)
app.use('/llm', llmRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong', error: err.message })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})