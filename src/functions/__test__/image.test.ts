import axios from 'axios'
import { HandlerContext, HandlerEvent } from '@netlify/functions'
import { handler } from '../image'
import * as process from 'process'

const mockPost = jest.spyOn(axios, 'post')
let event = {} as HandlerEvent
let context = {} as HandlerContext

beforeEach(() => {
    mockPost.mockResolvedValue({
        data: {
            data: [
                { url: 'https://example.com/image.png' },
            ]
        }
    })
    event = {
        body: JSON.stringify({
            prompt: 'string',
        }),
    } as HandlerEvent
    process.env.API_KEY = 'API_KEY'
})

it('should return 200 OK', async () => {
    const res = await handler(event, context)
    expect(res!.statusCode).toBe(200)
})
it('should call openai api', async () => {
    await handler(event, context)
    expect(mockPost).toHaveBeenCalledWith(
        'https://api.openai.com/v1/images/generations',
        {
            model: 'dall-e-2',
            prompt: 'string',
            n: 1,
            size: '256x256',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer API_KEY',
            },
        },
    )
})
it('should use API key from env variable', async () => {
    process.env.API_KEY = 'different_api_key'
    await handler(event, context)
    expect(mockPost).toHaveBeenCalledWith(
        'https://api.openai.com/v1/images/generations',
        {
            model: 'dall-e-2',
            prompt: 'string',
            n: 1,
            size: '256x256',
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer different_api_key',
            },
        },
    )
})
it('should call openai api using requested prompt', async () => {
    event.body = JSON.stringify({ prompt: 'different_prompt' })
    await handler(event, context)
    expect(mockPost).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
            prompt: 'different_prompt',
        }),
        expect.anything(),
    )
})
it('should return image url from openai api', async () => {
    const res = await handler(event, context)
    expect(res!.body).toEqual(JSON.stringify({ imageUrl: 'https://example.com/image.png' }))
})
