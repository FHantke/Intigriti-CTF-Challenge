import React, { useState, useContext, createContext } from "react";
import {useNavigate} from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

import { UserContext } from "..";
import Alert from "../components/Alert";

const SIGNIN_USER = gql`
mutation loginUser($name: String!, $password: String!) {
  signin(name:$name, password:$password) {
    success
    errors
    apikey
  }
}
`;

const SIGNUP_USER = gql`
mutation registerUser($name: String!, $password: String!) {
  signup(name:$name, password:$password) {
    success
    errors
    apikey
  }
}
`;

function Auth() {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [ mutateSignIn, signInLoading ] = useMutation(SIGNIN_USER);
    const [ mutateSignUp, signUpLoading ] = useMutation(SIGNUP_USER);
    
    const handleSignIn = (event) => {
        mutateSignIn({ variables: {name: userName, password: userPassword}, onCompleted: (data) => {
          console.log(data);
          if (data.signin.success === true) {
            context.userService.loginUser(data.signin.apikey)
            context.setUserLoggedIn(true)
            navigate('/home', {replace: true});
          } else {
            console.log(data.signin.errors[0])
            setErrorMessage(data.signin.errors[0])
          }
        }})

        if (signInLoading.error) console.log(signInLoading.error.message);
    };

    const handleSignUp = (event) => {

        mutateSignUp({ variables: {name: userName, password: userPassword}, onCompleted: (data) => {
          console.log(data);
          if (data.signup.success) {
            context.userService.loginUser(data.signup.apikey)
            context.setUserLoggedIn(true)
            navigate('/home', {replace: true});
          } else {
            setErrorMessage(data.signup.errors[0])
          }
        }})
          

        if (signUpLoading.error) console.log(signUpLoading.error.message);
          
    };

    return (
        <>
            <Alert message={errorMessage}></Alert>
            <h1>Authentication</h1>
            <div className="max-w-xs mx-auto rounded p-4">
                <div className="form-control w-full max-w-xs">
                    <label className="label"><span className="label-text">Username</span></label>
                    <input type="text" name="username" id="username" className="input input-bordered" 
                      onInput={e => setUserName(e.target.value)} value={userName}/>
                    
                    <label className="label"><span className="label-text">Password</span></label>
                    <input type="password" name="password" id="password" className="input input-bordered" 
                      onInput={e => setUserPassword(e.target.value)} value={userPassword}/>
                </div>

                <div className="form-control mt-6">
                    <div className="btn-group w-full">
                        <button id="register-button" onClick={handleSignUp}  className="btn btn-primary w-1/2">Register</button>
                        <button id="login-button" onClick={handleSignIn}  className="btn btn-primary w-1/2">Login</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;