import React from 'react'
import { FirebaseHook } from './FirebaseHook';
import { SignInScreen } from './SignInScreen';


export const SignInWrapper = () => {
    const {canShowLogin, error} = FirebaseHook()
    return <div>
        {canShowLogin && <SignInScreen />}
        {!canShowLogin && <p>Initializing...</p>}
        {error && <p>{error}</p>}
    </div>
}