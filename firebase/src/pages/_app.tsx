import React from 'react'
import '../globals.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Header from '../header/Header'
import {Footer} from '../footer/Footer'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const MyApp = ({ Component, pageProps }) => {

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Provider store={store}>
      <Header {...pageProps}/>
      <main>
      <Component {...pageProps} />
      </main>
      <Footer/>
      
    </Provider>)
}

export default MyApp
