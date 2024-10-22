import React from 'react'
import './Css/Landingpage.css'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <>
    <div className="landingpagecontainer">
    <div className="lp-first-section">
        <img src="./images/logo1.png" alt="" />
        <div className='lp-head'>Welcome to Project Hive  
        A secure, trusted platform for collaboration and resource sharing—where privacy and confidentiality are built in at every step.</div>
        <div className="started-btn"><button onClick={()=>{
            navigate('/login')
        }}>Get Started</button></div>
    </div>
    </div>
    </>
  )
}

export default LandingPage