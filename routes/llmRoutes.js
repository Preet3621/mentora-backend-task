import express from 'express'
import rateLimit from 'express-rate-limit'
import llmController from '../controllers/llmController.js'
import { protect } from '../middlewares/authMiddleware.js'

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { message: 'Too many requests, please try again after a minute' }
})

const router = express.Router()

router.post('/summarize', protect, limiter, llmController.summarize)

export default router
