import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import './App.css'
import Forgetpassword from './Forgetpassword'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/forgot-password' element={<Forgetpassword/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App