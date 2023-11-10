import {getDatabase, onValue, push, ref, set} from "firebase/database";
import {useEffect, useState} from "react";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function UserPage(){
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])

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
    }}>Submit</button>
    <ul>
        {users && users.map(user => <li>{user}</li>)}
    </ul>
        </>
    )
}
export default UserPage