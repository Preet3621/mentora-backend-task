import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' })
    }
}

const onlyParent = (req, res, next) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Only parents can do this' })
    }
    next()
}

const onlyMentor = (req, res, next) => {
    if (req.user.role !== 'mentor') {
        return res.status(403).json({ message: 'Only mentors can do this' })
    }
    next()
}

export { protect, onlyParent, onlyMentor }
