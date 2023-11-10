import React from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from 'axios';
import $ from 'jquery';
import "./../style.css";

const PromptPage = ({disabled})  =>  {
        const words = [
        "apple",
        "banana",
        "carrot",
        "dolphin",
        "elephant",
        "firetruck",
        "guitar",
        "helicopter",
        "jigsaw",
        "kangaroo",
        "lighthouse",
        "moon",
        "nest",
        "octopus",
        "penguin",
        "quilt",
        "rainbow",
        "sunflower",
        "tiger",
        "umbrella",
        "violin",
        "waterfall",
        "xylophone",
        "yarn",
        "zebra",
        "acorn",
        "beach",
        "castle",
        "dragon",
        "envelope",
        "flamingo",
        "globe",
        "hiking",
        "instrument",
        "jellyfish",
        "kiwi",
        "lemon",
        "mountain",
        "notebook",
        "owl",
        "palm tree",
        "raccoon",
        "snail",
        "tornado",
        "unicorn",
        "volcano",
        "watermelon",
        "yoga"
    ]

    const pickRandomWord = () => {
        const item = words[Math.floor(Math.random()*words.length)]
        setShowTopic(item)
    }

    const generateImage = async (prompt) => {

        const words = prompt.split(" ");
        let flag = 0

        words.map(word => word === showTopic? flag = 1 : null);
        if(flag === 1) {
            setShowError(true)
        }
        if (flag === 0) {
            setShowError(false)
            setImageLoading(true)
            setShowTimer(false)

            try {
                const {data} = await axios.post(
                    "/api/image",
                    {
                        prompt: prompt,
                    },
                );

                setEnableSubmit(false)
                setImageLoading(false)
                setShowImage(data.imageUrl);
            } catch (error) {
                console.error("Error in generateImage:", error);
                throw error;
            }
        }
    };

    $(document).ready(function(){
        setTimeout(function(){
            setShowTimesUp(true)
        }, 60000);
    });


    const [showTopic, setShowTopic] = React.useState('');
    const [showImage, setShowImage] = React.useState('');
    const [showError, setShowError] = React.useState(false);
    const [showTimesUp, setShowTimesUp] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(false);
    const [enableSubmit, setEnableSubmit] = React.useState(true);
    const [showTimer, setShowTimer] = React.useState(true);

    return (
        <>
            {!showTimesUp && (<div className="timeLeft">
                <div className="topicContainer">{showTopic === '' && <button className="randomWordButton" disabled={disabled}  onClick={() => pickRandomWord()}>Pick a topic</button>}
                    {showTopic && <div className="topic">{showTopic}</div>}</div>

                <textarea className="inputArea" id="promptText" name="promptText" placeholder="Type your prompt here"></textarea>
                {enableSubmit && <input className="generatorImageButton" type={"button"} value={"Generate image"} onClick={() => (generateImage(document.getElementById("promptText").value))} />}
                {imageLoading &&
                    (<><div>Generating image for you...</div>
                        <span className="loader"></span></>)}


                {showTimer && <div><CountdownCircleTimer isPlaying
                                                            children
                                                            duration={60}
                                                            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                                            colorsTime={[7, 5, 2, 0]}>{({ remainingTime }) => "You can do it in " + remainingTime}</CountdownCircleTimer></div>}
                {showError && <div className="warning">Do not use the banned word!!</div>}
                {showImage && <img alt="generated-image" src={showImage} width="256" height="256"/> }
            </div>)}
            {showTimesUp && (<div className="timeUpText">Times Up!</div>)}
        </>

    )
}

export default PromptPage;