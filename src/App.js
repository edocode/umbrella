import logo from './logo.svg';
import './App.css';
import PromptPage from "./Components/PromptPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Umbrella</h3>
      </header>
        <PromptPage topic={'umbrella'} disabled={false}/>
    </div>
  );
}

export default App;
