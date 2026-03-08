import { callGeminiApi } from '../services/llmService.js'

const MIN_LENGTH = 50
const MAX_LENGTH = 10000

class LlmController {
    async summarize(req, res) {
        const { text } = req.body

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'text is required and cannot be empty' })
        }

        if (text.trim().length < MIN_LENGTH) {
            return res.status(400).json({ message: `text must be at least ${MIN_LENGTH} characters` })
        }

        if (text.length > MAX_LENGTH) {
            return res.status(413).json({ message: `text is too large. Maximum allowed is ${MAX_LENGTH} characters` })
        }

        try {
            const result = await callGeminiApi(text)
            return res.json(result)
        } catch (err) {
            console.error('LLM call failed:', err.message)
            return res.status(502).json({ message: 'Failed to get summary from LLM', error: err.message })
        }
    }
}

export default new LlmController()