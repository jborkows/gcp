import React, { useState, useEffect } from 'react';
import getFirebaseConfig from "../fbconfig";
import * as firebase from "firebase/app";


export const FirebaseHook = () =>{
    const [canShowLogin, setLogin] = useState(false)
    const [error, setError]=useState("")
    useEffect(() => {
        // @ts-ignore
        getFirebaseConfig
            // @ts-ignore
            .then((result: firebase.FirebaseOptions) => {
                firebase.initializeApp(result);
                setLogin(true)
            })
            .catch((err: any) => { console.log(err); setError("Cannot show login") });
    }, [])
    return {
        canShowLogin: canShowLogin,
        error:error
    }
}