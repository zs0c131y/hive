import React, { useEffect, useState } from 'react'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Login from './Login'
import './App.css'
import Forgetpassword from './Forgetpassword'
import Home from './Home'
import Profile from './Profile'
import Error from './Error'
const App = () => {

  const[login,setlogin] = useState(false)
  const [history, setHistory] = useState([]);
  const addToHistory = (acceptedRequest) => {
    setHistory((prevHistory) => [...prevHistory, acceptedRequest]);
  };
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login setlogin = {setlogin}/>}></Route>
      <Route path='/forgot-password' element={<Forgetpassword/>}></Route>
      <Route
            path='/Home'
            element={ login ? <Home addToHistory={addToHistory} /> :<Navigate to='/'/> }
          />
          <Route path='/Profile' element={login ? <Profile history={history} />:<Navigate to='/'/>} />
      <Route path='*' element={<Error/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App