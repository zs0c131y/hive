import React from 'react'
import '../Css/home.css'
import { Link } from 'react-router-dom'
const Hnavbar = () => {
  return (
    <>
    <div className="hnavbar">
        <div className="h-logo">Hive</div>
        <div className="tools">
            <Link className="h-icons"><img src="../Images/user.png" alt="" /></Link>
            <div className="h-icons"><img src="../Images/bell.png" alt="" /></div>
        </div>
    </div>
    </>
  )
}

export default Hnavbar  