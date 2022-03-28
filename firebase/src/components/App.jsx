import React from 'react'
import Header from './Header'
import { SignInWrapper } from './SignInWrapper';
import getFirebaseConfig from "../fbconfig";
import * as firebase from "firebase/app";
import axios from "axios";

const App = ({ children }) => {
  
  return <main>
    <Header />
    <SignInWrapper/>
  </main>
}

export default App
