import React, { useRef, useState } from 'react';
import './App.css';
import { Switch, Route, NavLink } from 'react-router-dom';
import Home from './Home';



import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAL9ATZMFGjSy0QfuiMB2fJzm8tvw9itFw",
  authDomain: "fir-chat-rocha.firebaseapp.com",
  projectId: "fir-chat-rocha",
  storageBucket: "fir-chat-rocha.appspot.com",
  messagingSenderId: "462610716205",
  appId: "1:462610716205:web:3ff5f9cc6602a039b4caa4"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/chatroom">
        <header>
          <h1>RoChat</h1>
            <div className="navb">
              <SignOut /> 
              <TakeHome />
            </div>
        </header>
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </Route>

    </Switch>

    </div>
 
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return (
    <>
    <div className="si">
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google
      <img className="google" alt="google" src="https://emojis.slackmojis.com/emojis/images/1450464805/195/google.png" />
      </button>
    </div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" alt="Sign Out" onClick={() => auth.signOut()}>_</button>
  )
}

function TakeHome() {
  return (
    <NavLink exact to="/">
      <button className="sign-out" alt="Home" >X</button>
      </NavLink>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;
    
    

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL, 
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
  
  <>

    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type Your Message Here! 😀" />
      <button type="submit" disabled={!formValue}>Submit</button>
    </form>
  </>)
}


function ChatMessage(props) {
  
  const { text, uid, photoURL, createdAt, displayName} = props.message;


  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  


  return (<>

    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      {displayName}:
       <p>{text}</p>    
      </div>
  </>)
}


export default App;
