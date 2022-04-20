import React from 'react'
import '../globals.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'

const MyApp = ({ Component, pageProps }) => {

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>)
}

export default MyApp
