import {getDatabase, onValue, push, ref, set, get} from "firebase/database";
import React, {useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import './UserPage.css';

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

    if (step === 0 ) {
        return (
            <div>
                <button onClick={() => {
                    setStep(1)
                    setIsHost(true)
                }}>Create Game</button>
                <button onClick={() => {
                    setStep(1)
                }}>Join Game</button>
            </div>
        )
    }

    if (step === 1) {
        if (isHost) {
            return (
                <div>
                    <label>
                        Name
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <button onClick={async () => {
                        const sessionsRef = ref(db, 'sessions');
                        const newSessionRef = push(sessionsRef);
                        await set(newSessionRef, {
                            users: null
                        });
                        const usersRef = ref(db, `sessions/${newSessionRef.key}/users`)
                        const userRef = push(usersRef)
                        await set(userRef, name)
                        setSessionId(newSessionRef.key)
                        setStep(2)
                    }}>Create Game</button>
                </div>
            )
        } else {
            return (
                <div>
                    <label>
                        Game Id
                        <input type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)}/>
                    </label>
                    <label>
                        Name
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </label>

                    <button onClick={async () => {
                        const snapshot = await get(ref(db, `sessions/${sessionId}`))
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

                        setStep(2)
                    }}>Create Game
                    </button>
                </div>
            )
        }

    }

    return(<>
            <h1>Game ID: {sessionId}</h1>
            <ol class="usersList">
                {users && users.map(user => <li>{user}</li>)}
            </ol>
        </>
    )
}
export default UserPage