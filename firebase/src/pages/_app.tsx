import React from 'react'
import '../globals.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Header from '../header/Header'
import { Footer } from '../footer/Footer'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import ClientOnly from '../components/ClientOnly'
config.autoAddCss = false

const MyApp = ({ Component, pageProps }) => {

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Provider store={store}>
      <ClientOnly>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </ClientOnly>

    </Provider>)
}

export default MyApp
