import express from 'express'
import studentController from '../controllers/studentController.js'
import { protect, onlyParent } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, onlyParent, studentController.createStudent)
router.get('/', protect, onlyParent, studentController.getStudents)

export default router
