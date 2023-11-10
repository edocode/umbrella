import logo from './logo.png';
import './App.css';
import PromptPage from "./Components/PromptPage";
import React from "react";

function App() {
    const [startGame, setStartGame] = React.useState(false);
  return (
    <div className="App">
        <header className="App-header">
                <img className="App-logo" src={logo} alt="logo" />
                <h3 className="Game-name" >Umbrella</h3>
            <div id='spacer'></div>
        </header>
        <container>
            <div className="introText">Generate the best image without using the banned word
               <br></br> and win the game ! </div>
            {!startGame && <div className="Start-button">{!startGame && <button className="button" onClick={() => setStartGame(true)}>START GAME!</button>}</div>}
            {startGame && <PromptPage disabled={false}/>}
        </container>

    </div>
  );
}

export default App;
