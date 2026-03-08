import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

class AuthController {
    async signup(req, res) {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (!['parent', 'mentor'].includes(role)) {
            return res.status(400).json({ message: 'Role must be parent or mentor' })
        }

        const alreadyExists = await User.findOne({ email })
        if (alreadyExists) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const newUser = await User.create({ name, email, password, role })

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id)
        })
    }

    async login(req, res) {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' })
        }

        const foundUser = await User.findOne({ email })
        if (!foundUser || !(await foundUser.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        return res.json({
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            token: generateToken(foundUser._id)
        })
    }

    async getMe(req, res) {
        return res.json(req.user)
    }
}

export default new AuthController()
