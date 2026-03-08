import Lesson from '../models/Lesson.js'

class LessonController {
    async createLesson(req, res) {
        const { title, description } = req.body

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' })
        }

        const lesson = await Lesson.create({
            title,
            description,
            mentorId: req.user._id
        })

        return res.status(201).json(lesson)
    }

    async getAllLessons(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const total = await Lesson.countDocuments()
        const allLessons = await Lesson.find().select('-__v').populate('mentorId', 'name email').skip(skip).limit(limit)

        return res.json({
            data: allLessons,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        })
    }

    async getLessonById(req, res) {
        const lesson = await Lesson.findById(req.params.id).select('-__v').populate('mentorId', 'name email')
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' })
        }
        return res.json(lesson)
    }
}

export default new LessonController()