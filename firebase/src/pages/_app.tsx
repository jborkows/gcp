import React from 'react'
// import '../styles/globals.css'


const MyApp = ({ Component, pageProps }) => {

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default MyApp
