import React, { useState } from 'react';
import {useCookies} from 'react-cookie';

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [error, setError] = useState(null);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    console.log('cookies',cookies);
    const viewLogin = (status) => {
        setIsLoginMode(status);
        setError(null);
    }


    const handleSubmit = async (e, endPoint) => {
        e.preventDefault();
        if (!isLoginMode && password !== confirmPassword) {
            setError('Make sure passwords match!');
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.detail) {
            setError(data.detail)
        }else{
            setCookie('Email', data.email);
            setCookie('AuthToken', data.token);
            window.location.reload();
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{isLoginMode ? 'Please log in!' : 'Please sign up!'}</h2>
                    <input type="email" placeholder="Enter email" onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />
                    {!isLoginMode && <input type="password" placeholder="Re-enter Password" onChange={(e) => { setConfirmPassword(e.target.value) }} />}
                    <input type="submit" className="create" onClick={(e) => { handleSubmit(e, isLoginMode ? 'login' : 'signup') }} />
                    {error && <p>{error}</p>}
                </form>
                <div className="auth-options">
                    <button onClick={() => viewLogin(false)} style={{ backgroundColor: !isLoginMode ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}>Sign Up</button>
                    <button onClick={() => setIsLoginMode(true)} style={{ backgroundColor: isLoginMode ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}>Login</button>
                </div>
            </div>
        </div>
    )
};

export default Auth;