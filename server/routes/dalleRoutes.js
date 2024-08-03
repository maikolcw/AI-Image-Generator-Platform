import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from dall-e warudo' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        // Validate the prompt
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Invalid prompt provided' });
        }

        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        const image = aiResponse.data.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (error) {
        console.error('Error response from OpenAI:', error.response ? error.response.data : error.message);
        
        if (error.response && error.response.data.error.code === 'billing_hard_limit_reached') {
            res.status(403).json({ error: 'Billing hard limit has been reached. Please check your OpenAI account billing status.' });
        } else {
            res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
        }
    }
});

export default router;
