import express from 'express'
import lessonController from '../controllers/lessonController.js'
import sessionController from '../controllers/sessionController.js'
import { protect, onlyMentor } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, onlyMentor, lessonController.createLesson)
router.get('/', protect, lessonController.getAllLessons)
router.get('/:id', protect, lessonController.getLessonById)
router.get('/:id/sessions', protect, sessionController.getSessionsByLesson)

export default router
