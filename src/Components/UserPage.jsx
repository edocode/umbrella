import {getDatabase, onValue, push, ref, set, get, update} from "firebase/database";
import React, {useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import './UserPage.css';
import PromptPage from './PromptPage'

const firebaseConfig = {
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function UserPage(){
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])
    const [disabled, setDisabled] = React.useState(false);

    const [step, setStep] = useState(0)
    const [isHost, setIsHost] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [startGame, setStartGame] = React.useState(false);
    const [showPromptPage, setShowPromptPage] =React.useState(false)

    useEffect(() => {
        setShowPromptPage(true)
    }, [startGame])

    if (step === 0 ) {
        return (
            <>
                <div className="buttonContainer" >
                    <button className="createButton"  onClick={() => {
                        setStep(1)
                        setIsHost(true)
                    }}>Create Game</button>
                    <button className="joinButton"  onClick={() => {
                        setStep(1)
                    }}>Join Game</button>
                </div>

                <div className="introText">Generate the best image without using the banned word
                    <br></br> and win the game ! </div></>

        )
    }

    if (step === 1) {
        if (isHost) {
            return (
                <div className="hostContainer">
                    <label className="nameHeader">
                        Name
                        <input className="inputName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <button  className="createButton" onClick={async () => {
                        const sessionsRef = ref(db, 'sessions');
                        const newSessionRef = push(sessionsRef);
                        await set(newSessionRef, {
                            users: null
                        });
                        const usersRef = ref(db, `sessions/${newSessionRef.key}/users`)
                        const userRef = push(usersRef)
                        await set(userRef, name)

                        // listen to new changes to player list
                        onValue(usersRef, (snapshot) => {
                            var newUsers = [];
                            snapshot.forEach((childSnapshot) => {
                                newUsers.push(childSnapshot.val());
                            })
                            setUsers(newUsers);
                        });

                        setSessionId(newSessionRef.key)
                        setStep(2)
                    }}>Create Game</button>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="inputContainer">
                        <label className="nameHeader">
                            Game Id
                            <input  className="inputGameid" type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)}/>
                        </label>
                        <label className="nameHeader">
                            Name
                            <input className="inputName"  type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        </label>
                    </div>

                    <button  className="joinButton" onClick={async () => {
                        const sessionRef = ref(db, `sessions/${sessionId}`)
                        const snapshot = await get(sessionRef)
                        if (!snapshot.exists()) {
                            alert('Game ID does not exist')
                            return
                        }

                        const usersRef = ref(db, `sessions/${sessionId}/users`)
                        onValue(usersRef, (snapshot) => {
                            var newUsers = [];
                            snapshot.forEach((childSnapshot) => {
                                newUsers.push(childSnapshot.val());
                            })
                            setUsers(newUsers);
                        });

                        const userRef = push(usersRef)
                        await set(userRef, name)

                        // wait for game to start
                        onValue(sessionRef, (snapshot) => {
                            if (snapshot.val().started) {
                                setStartGame(true)
                            }
                        })

                        setStep(2)
                    }}>Join Game
                    </button>
                </div>
            )
        }

    }

    return(<>
            {!startGame && <>
                <div className="gameIdWrapper">
                    <h1 className="sessionId">Game ID:
                        <span className="userIdNumber"> {sessionId}</span>
                        {isHost  && !startGame &&  <div className="shareText">Share the link to other players</div> }

                    </h1>
                </div>
                <ol className="usersList">
                    {users && users.map(user => <li>{user}</li>)}
                   {isHost  && !startGame &&        <img className="hostLogo" src="logo.png" alt="logo512" />}
                </ol>
                {!isHost && <div className="nameHeader">Waiting for the host to start the game....</div>}
            </>}

            {isHost && !startGame && <div className="Start-button">
                <button className="button"
                onClick={async () => {
                    const sessionRef = ref(db, `sessions/${sessionId}`)
                    await update(sessionRef, { started: true })
                    setStartGame(true)
            }}>START GAME!</button></div>}
            {startGame && showPromptPage && <PromptPage disabled={false}/>}
        </>
    )
}
export default UserPage