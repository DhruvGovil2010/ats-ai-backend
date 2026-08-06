const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env.js');

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const run = async () => {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: 'Say hello and confirm you are working.',
    });

    console.log(response.text);
};

run();