// @ts-ignore
import logo from './logo.png'
import './App.css'
import UserPage from './Components/UserPage'

function App() {
    return (
        <div className='App'>
            <header className='App-header'>
                <img className='App-logo' src={logo} alt='logo' />
                <h3 className='Game-name'>Pic-kasa</h3>
                <div id='spacer'></div>
            </header>
            <main>
                <>
                    <UserPage />
                </>
            </main>
        </div>
    )
}

export default App
