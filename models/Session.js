import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        default: ''
    },
    joinedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { timestamps: true, versionKey: false })

const Session = mongoose.model('Session', sessionSchema)

export default Session
