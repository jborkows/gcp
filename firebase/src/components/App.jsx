import React from 'react'
import Header from './Header'
import { SignInWrapper } from './SignInWrapper';


const App = ({ children }) => {
  
  return <main>
    <Header />
    <SignInWrapper/>
  </main>
}

export default App
