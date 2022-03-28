import React, { useEffect } from 'react'
// import '../styles/globals.css'


import getFirebaseConfig from "../fbconfig";
import * as firebase from "firebase/app";
import axios from "axios";




const MyApp = ({ Component, pageProps }) => {

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default MyApp
