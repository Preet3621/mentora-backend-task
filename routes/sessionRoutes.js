import express from 'express'
import sessionController from '../controllers/sessionController.js'
import { protect, onlyMentor, onlyParent } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, onlyMentor, sessionController.createSession)
router.post('/:id/join', protect, onlyParent, sessionController.joinSession)

export default router
