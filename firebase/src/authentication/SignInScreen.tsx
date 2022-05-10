import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as auth from "firebase/auth";
import { logged, unlogged, UserData} from "./auth-slice"

import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useAuthentication } from './hooks';
import {providers} from "../devoptions"

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: providers,
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};




const Foo = () => {
  const [text, setText] = useState("")
  useEffect(() => {
    async function fetcher() {
      const idToken = await auth.getAuth()!!.currentUser!!.getIdToken()
      console.log(JSON.stringify(`${auth.getAuth().currentUser!!.displayName}`))
      // let result = await getRedirectResult(auth.getAuth()!!)!!

      // This gives you a Google Access Token. You can use it to access Google APIs.
      // const credential = GoogleAuthProvider.credentialFromResult(result!!);
      // const token = credential!!.accessToken!!;

      let promise = await fetch("/helloworld", {
        method: "GET", // POST, PUT, DELETE, etc.
        headers: {
          // the content type header value is usually auto-set
          // depending on the request body
          "Content-Type": "text/plain;charset=UTF-8",
          "Authorization": `Bearer ${idToken}`,
        },
      });
      setText(`${promise}`)
    }
    fetcher()
  }, [])

  return <div>{text}</div>
}

export const NeedsLogin = () => {
  return (
    <div className='LoginContainer'>
      <h1>Home automation</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth.getAuth()} />
    </div>
  );
}

interface LoggeInProps {
  userData:UserData
}

export const LoggedIn = (props:LoggeInProps)=>{
  return <div className='LoginContainer'>
  <h1>Home automation.</h1>
  <p>Welcome {props.userData.username}! You are now signed-in!</p>
  <a onClick={() => auth.getAuth().signOut()} className="signout">Sign-out</a>
</div>;
}

const useFirebaseAuth = ()=>{
  const dispatch = useAppDispatch()
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.getAuth().onAuthStateChanged(user => {
      if(user){
        dispatch(logged({
          username: user.displayName,
          email: user.email,
          photoUrl: user.photoURL
        }))
      }else{
        dispatch(unlogged())
      }
      
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
}

export const SignInScreen = () => {
  useFirebaseAuth()
  const authenticated = useAuthentication()
  if (!authenticated.authenticated) {
    return <NeedsLogin/>;
  }
  const userData  = authenticated.data
  return (
    <LoggedIn userData={userData}/>
  );
}

