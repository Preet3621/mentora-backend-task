import express from 'express'
import authController from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/me', protect, authController.getMe)

export default router
