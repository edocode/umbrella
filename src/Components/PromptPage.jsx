import React, { useEffect } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from 'axios'
import $ from 'jquery'
import './../style.css'
import { initializeApp } from 'firebase/app'
import { getDatabase, onValue, ref, update, push, set } from 'firebase/database'

// TODO: consolidate to one place
const firebaseConfig = {
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
}
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

const PromptPage = ({
    disabled,
    sessionId,
    isHost,
    setShowImagePage,
    setShowPromptPage,
}) => {
    const words = [
        'apple',
        'banana',
        'carrot',
        'dolphin',
        'elephant',
        'firetruck',
        'guitar',
        'helicopter',
        'jigsaw',
        'kangaroo',
        'lighthouse',
        'moon',
        'nest',
        'octopus',
        'penguin',
        'quilt',
        'rainbow',
        'sunflower',
        'tiger',
        'umbrella',
        'violin',
        'waterfall',
        'xylophone',
        'yarn',
        'zebra',
        'acorn',
        'beach',
        'castle',
        'dragon',
        'envelope',
        'flamingo',
        'globe',
        'hiking',
        'instrument',
        'jellyfish',
        'kiwi',
        'lemon',
        'mountain',
        'notebook',
        'owl',
        'palm tree',
        'raccoon',
        'snail',
        'tornado',
        'unicorn',
        'volcano',
        'watermelon',
        'yoga',
    ]

    const pickRandomWord = () => {
        const item = words[Math.floor(Math.random() * words.length)]
        return item
    }

    const generateImage = async (prompt) => {
        const words = prompt.split(' ')
        let flag = 0

        words.map((word) => (word === showTopic ? (flag = 1) : null))
        if (flag === 1) {
            setShowError(true)
        }
        if (flag === 0) {
            setShowError(false)
            setImageLoading(true)
            setShowTimer(false)

            try {
                const { data } = await axios.post('/api/image', {
                    prompt: prompt,
                })

                setEnableSubmit(false)
                setImageLoading(false)
                setShowImage(data.imageUrl)

                const newImageRef = push(
                    ref(db, `sessions/${sessionId}/images`)
                )
                await set(newImageRef, data.imageUrl)
            } catch (error) {
                console.error('Error in generateImage:', error)
                throw error
            }
        }
    }

    $(document).ready(function () {
        setTimeout(async function () {
            setShowTimesUp(true)

            // end answer stage if host
            if (isHost) {
                const sessionRef = ref(db, `sessions/${sessionId}`)
                await update(sessionRef, { endAnswer: true })
            }
        }, 60000)
    })

    const [showTopic, setShowTopic] = React.useState('')
    const [showImage, setShowImage] = React.useState('')
    const [showError, setShowError] = React.useState(false)
    const [showTimesUp, setShowTimesUp] = React.useState(false)
    const [imageLoading, setImageLoading] = React.useState(false)
    const [enableSubmit, setEnableSubmit] = React.useState(true)
    const [showTimer, setShowTimer] = React.useState(true)

    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            return <div className="timer">Too late...</div>
        }

        return (
            <div className="timer">
                <div>Remaining</div>
                <div className="countdownNumber">{remainingTime}</div>
                <div>seconds</div>
            </div>
        )
    }

    useEffect(() => {
        const sessionRef = ref(db, `sessions/${sessionId}`)
        onValue(sessionRef, (snapshot) => {
            const topic = snapshot.val().topic
            const endAnswer = snapshot.val().endAnswer
            if (topic) {
                setShowTopic(topic)
            }
            if (endAnswer) {
                setShowImagePage(true)
                setShowPromptPage(false)
            }
        })
    }, [])

    return (
        <>
            <div className="timeLeft">
                <div className="topicContainer">
                    {showTopic === '' && (
                        <button
                            className="randomWordButton"
                            disabled={disabled}
                            onClick={async () => {
                                const topic = pickRandomWord()
                                setShowTopic(topic)
                                const sessionRef = ref(
                                    db,
                                    `sessions/${sessionId}`
                                )
                                await update(sessionRef, { topic })
                            }}
                        >
                            Pick a topic
                        </button>
                    )}
                    {showTopic && <div className="topic">{showTopic}</div>}
                </div>

                <textarea
                    className="inputArea"
                    id="promptText"
                    name="promptText"
                    placeholder="Type your prompt here"
                ></textarea>
                {showError && (
                    <div className="warning">Do not use the banned word!!</div>
                )}
                {enableSubmit && (
                    <input
                        className="generatorImageButton"
                        type={'button'}
                        value={'Generate image'}
                        onClick={() =>
                            generateImage(
                                document.getElementById('promptText').value
                            )
                        }
                    />
                )}
                {imageLoading && (
                    <>
                        <div className="generatingText">
                            Generating image for you...
                        </div>
                        <span className="loader"></span>
                    </>
                )}

                {showTimer && (
                    <div>
                        <CountdownCircleTimer
                            className="countdownText"
                            isPlaying
                            children
                            duration={60}
                            colors={[
                                '#05c148',
                                '#0387b9',
                                '#fdc94b',
                                '#ff4364',
                            ]}
                            colorsTime={[45, 30, 15, 0]}
                        >
                            {renderTime}
                        </CountdownCircleTimer>
                    </div>
                )}

                {showImage && (
                    <img
                        alt="generated-image"
                        src={showImage}
                        width="256"
                        height="256"
                    />
                )}
                {showImage && (
                    <div className="waiting">Waiting for other players....</div>
                )}
            </div>
            {showTimesUp && <div className="timeUpText">Time's Up!</div>}
        </>
    )
}

export default PromptPage
