import React from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from 'axios';
import $ from 'jquery';
import "./../style.css";

const PromptPage = ({topic, disabled})  =>  {
    const generateImage = async (prompt) => {

        const words = prompt.split(" ");
        let flag = 0

        words.map(word => word === topic? flag = 1 : null);
        if(flag === 1) {
            setShowError(true)
}
        if (flag === 0) {
            setShowError(false)
            setImageLoading(true)

            try {
                const {data} = await axios.post(
                    "/api/image",
                    {
                        prompt: prompt,
                    },
                );

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


    const [showTopic, setShowTopic] = React.useState(false);
    const [showImage, setShowImage] = React.useState('');
    const [showError, setShowError] = React.useState(false);
    const [showTimesUp, setShowTimesUp] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(false);
    let image;

    return (
        <>
            {!showTimesUp && (<div className="timeLeft">
                <button disabled={disabled}  onClick={() => setShowTopic(true)}>Pick a topic</button>
                {showTopic && <div>{topic}</div>}
                <input id="promptText" name="promptText" placeholder="write your prompt"></input>
                <input type={"button"} value={"Submit"} onClick={() => (image = generateImage(document.getElementById("promptText").value))} />
                {imageLoading &&
                    (<><div>Generating image for you...</div>
                        <span className="loader"></span></>)}


                <div><CountdownCircleTimer isPlaying
                                           children
                                           duration={60}
                                           colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                           colorsTime={[7, 5, 2, 0]}>{({ remainingTime }) => "You can do it in " + remainingTime}</CountdownCircleTimer></div>
                {showError && <div>Don't use the banned word</div>}
                {showImage && <img alt="generated-image" src={showImage} width="256" height="256"/> }
            </div>)}
            {showTimesUp && (<div>Times Up!</div>)}
        </>

    )
}

export default PromptPage;