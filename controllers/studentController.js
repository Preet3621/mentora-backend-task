import Student from '../models/Student.js'

class StudentController {
    async createStudent(req, res) {
        const { name, age } = req.body

        if (!name) {
            return res.status(400).json({ message: 'Student name is required' })
        }

        const student = await Student.create({
            name,
            age,
            parentId: req.user._id
        })

        return res.status(201).json(student)
    }

    async getStudents(req, res) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const total = await Student.countDocuments({ parentId: req.user._id })
        const myStudents = await Student.find({ parentId: req.user._id }).select('-__v').skip(skip).limit(limit)

        return res.json({
            data: myStudents,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        })
    }
}

export default new StudentController()