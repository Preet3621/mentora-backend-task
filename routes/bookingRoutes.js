import express from 'express'
import bookingController from '../controllers/bookingController.js'
import { protect, onlyParent } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, onlyParent, bookingController.createBooking)
router.get('/', protect, onlyParent, bookingController.getMyBookings)

export default router
