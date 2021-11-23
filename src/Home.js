import React from 'react';
import './App.css';
import { NavLink } from 'react-router-dom';



const Home = () => {
return (
    <div className="home">
        <h1> Welcome to RoChat! </h1>
        <NavLink exact to='/chatroom'>
            <button className="webchat">
            Enter Chat Room
            </button>
        </NavLink>               

    </div>
);
}

export default Home;

