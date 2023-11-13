import axios from 'axios'

/**
 *
 * @param req {Request}
 * @param context
 * @returns {Promise<Response>}
 */
const GetImage = async (req, context) => {
    // console.log(context.params)
    // const prompt = req.body.getReader().read()
    const { prompt } = await new Response(req.body).json()

    const res = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
            model: 'dall-e-2',
            prompt,
            n: 1,
            size: '256x256',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Netlify.env.get('API_KEY')}`,
            },
        }
    )
    console.log(res.data)
    return new Response(
        JSON.stringify({
            imageUrl: res.data.data[0].url,
        })
    )
}

export const config = {
    path: '/api/image',
}

export default GetImage
