import logo from "./logo.png";
import "./App.css";
import PromptPage from "./Components/PromptPage";
import React from "react";
import UserPage from "./Components/UserPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" src={logo} alt="logo" />
        <h3 className="Game-name">Pic-kasa</h3>
        <div id="spacer"></div>
      </header>
      <container>
        <>
          <UserPage />
        </>
      </container>
    </div>
  );
}

export default App;
