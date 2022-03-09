import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import getFirebaseConfig from "./fbconfig";
import * as firebase from "firebase/app";
import axios from "axios";

// @ts-ignore
getFirebaseConfig
// @ts-ignore
.then((result: firebase.FirebaseOptions) => {
  firebase.initializeApp(result);

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
  
})
.catch((err: any) => console.log(err));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
