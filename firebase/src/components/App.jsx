import React from 'react'
import Header from '../header/Header'


const App = ({ children }) => {
  
  return <main>
    <Header />
    {children}
  </main>
}

export default App
