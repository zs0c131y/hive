import React from 'react'
import '../Css/home.css'
import { Link } from 'react-router-dom'
import Profile from '../Profile'
const Hnavbar = () => {
  return (
    <>
    <div className="hnavbar">
        <Link to="/Home" className="h-logo">Hive</Link>
        <div className="tools">
            <Link to="/Profile" className="h-icons"><img src="../Images/user.png" alt="" /></Link>
            
        </div>
    </div>
    </>
  )
}

export default Hnavbar  