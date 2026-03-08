import Booking from '../models/Booking.js'
import Student from '../models/Student.js'
import Lesson from '../models/Lesson.js'

class BookingController {
    async createBooking(req, res) {
        const { studentId, lessonId } = req.body

        if (!studentId || !lessonId) {
            return res.status(400).json({ message: 'studentId and lessonId are required' })
        }

        const student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' })
        }

        if (student.parentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'This student does not belong to you' })
        }

        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' })
        }

        const existingBooking = await Booking.findOne({ studentId, lessonId })
        if (existingBooking) {
            return res.status(400).json({ message: 'Student already booked for this lesson' })
        }

        const booking = await Booking.create({
            studentId,
            lessonId,
            bookedBy: req.user._id
        })

        return res.status(201).json(booking)
    }

    async getMyBookings(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const total = await Booking.countDocuments({ bookedBy: req.user._id })
        const bookings = await Booking.find({ bookedBy: req.user._id })
           .select('-__v')
            .populate('studentId', 'name')
            .populate('lessonId', 'title description')
            .skip(skip)
            .limit(limit)

        return res.json({
            data: bookings,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        })
    }
}

export default new BookingController()