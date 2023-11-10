import {getDatabase, onValue, push, ref, set} from "firebase/database";
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

    useEffect(() => {
        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
            var newUsers = [];
            snapshot.forEach((childSnapshot) => {
                newUsers.push(childSnapshot.val());
            })
            setUsers(newUsers);
        });
    }, [])
    return(<>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    <button onClick={() => {
        const usersRef = ref(db, 'users');
        const newPostRef = push(usersRef);
        set(newPostRef, name);
        setName('');
        setDisabled(true)
    }}
    disabled={disabled}>Submit</button>
    <ul class="usersList">
        {users && users.map(user => <li>{user}</li>)}
    </ul>
        </>
    )
}
export default UserPage