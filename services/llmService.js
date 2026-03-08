import fetch from 'node-fetch'

const geminiModel = 'gemini-2.5-flash'

const callGeminiApi = async (inputText) => {
    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `Summarize the following text in 3 to 6 bullet points. Be concise and clear.\n\nText:\n${inputText}`
                        }
                    ]
                }
            ]
        })
    })

    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Gemini API error: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()
    const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
        summary: summaryText,
        model: geminiModel
    }
}

export { callGeminiApi }