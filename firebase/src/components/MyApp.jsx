import React from 'react'
import Header from '../header/Header'


const MyApp = ({ children }) => {
  
  return <main>
    <Header />
    {children}
  </main>
}

export default MyApp
