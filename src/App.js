import logo from './logo.svg';
import './App.css';
import PromptPage from "./Components/PromptPage";
import UserPage from "./Components/UserPage";

function App() {
    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Umbrella</h3>
      </header>
<UserPage />
        <PromptPage topic={'umbrella'} disabled={false}/>
    </div>
  );
}

export default App;
