import { useState, useEffect } from 'react';
// @ts-ignore
import { getFirebaseConfig } from "../fbconfig";
import { postAction } from "../devoptions"
import * as firebase from "firebase/app";
import { getApps } from 'firebase/app';



export const FirebaseHook = () => {
    const [canShowLogin, setLogin] = useState(false)
    const [error, setError] = useState("")
    useEffect(() => {
        if(getApps().length !== 0){
            setLogin(true)
            return;
        }
        // @ts-ignore
        getFirebaseConfig()
            // @ts-ignore
            .then((result: firebase.FirebaseOptions) => {
                firebase.initializeApp(result);
                postAction()
                setLogin(true)
            })
            .catch((err: any) => { console.log(err); setError("Cannot show login") });
    }, [])
    return {
        canShowLogin: canShowLogin,
        error: error
    }
}