import axios from 'axios'
import { Handler } from '@netlify/functions'
import * as process from 'process'

export const handler: Handler = async (event, context) => {
    const reqBody: { prompt: string } = JSON.parse(event.body!)

    const res = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
            model: 'dall-e-2',
            prompt: reqBody.prompt,
            n: 1,
            size: '256x256',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_KEY}`,
            },
        },
    )
    return {
        body: JSON.stringify({
            imageUrl: res.data.data[0].url,
        }),
        statusCode: 200,
    }
}
