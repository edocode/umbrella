import logo from './logo.jpeg';
import './App.css';
import PromptPage from "./Components/PromptPage";
import React from "react";

function App() {
    const [startGame, setStartGame] = React.useState(false);
  return (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h3 className="Game-name">Umbrella</h3>
            <div></div>

        </header>

        {!startGame && <div className="Start-button">{!startGame && <button className="button" onClick={() => setStartGame(true)}>START GAME!</button>}</div>}
        {startGame && <PromptPage disabled={false}/>}
    </div>
  );
}

export default App;
