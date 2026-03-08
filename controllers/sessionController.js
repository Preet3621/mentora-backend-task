import Session from '../models/Session.js'
import Lesson from '../models/Lesson.js'
import Booking from '../models/Booking.js'

class SessionController {
    async createSession(req, res) {
        const { lessonId, date, topic, summary } = req.body

        if (!lessonId || !date || !topic) {
            return res.status(400).json({ message: 'lessonId, date and topic are required' })
        }

        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' })
        }

        if (lesson.mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only create sessions for your own lessons' })
        }

        const session = await Session.create({ lessonId, date, topic, summary })

        return res.status(201).json(session)
    }

    async getSessionsByLesson(req, res) {
        const lesson = await Lesson.findById(req.params.id).select('-__v')
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' })
        }

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const total = await Session.countDocuments({ lessonId: req.params.id })
        const sessions = await Session.find({ lessonId: req.params.id }).skip(skip).limit(limit)

        return res.json({
            data: sessions,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        })
    }

    async joinSession(req, res) {
        const { studentId } = req.body

        if (!studentId) {
            return res.status(400).json({ message: 'studentId is required' })
        }

        const session = await Session.findById(req.params.id).select('-__v')
        if (!session) {
            return res.status(404).json({ message: 'Session not found' })
        }

        const booking = await Booking.findOne({ studentId, lessonId: session.lessonId })
        if (!booking) {
            return res.status(403).json({ message: 'Student is not booked for this lesson' })
        }

        const alreadyJoined = session.joinedStudents.includes(studentId)
        if (alreadyJoined) {
            return res.status(400).json({ message: 'Student already joined this session' })
        }

        session.joinedStudents.push(studentId)
        await session.save()

        return res.json({ message: 'Student joined session', session })
    }
}

export default new SessionController()