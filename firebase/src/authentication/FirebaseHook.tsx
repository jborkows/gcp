import { useState, useEffect } from 'react';
import {getFirebaseConfig} from "../fbconfig";
import {postAction } from "../devoptions"
import * as firebase from "firebase/app";




export const FirebaseHook = () =>{
    const [canShowLogin, setLogin] = useState(false)
    const [error, setError]=useState("")
    useEffect(() => {
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
        error:error
    }
}