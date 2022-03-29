import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as auth from "firebase/auth";


const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    auth.GoogleAuthProvider.PROVIDER_ID
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
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

export const SignInScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.getAuth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth.getAuth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {auth.getAuth()?.currentUser?.displayName}! You are now signed-in!</p>
      <a onClick={() => auth.getAuth().signOut()}>Sign-out</a>
      {auth.getAuth() != null && <Foo />}
    </div>
  );
}