import React from 'react'
import './Css/login.css'
import Lnavbar from './Components/Lnavbar'
import { Link } from 'react-router-dom'
const Forgetpassword = () => {
  return (
    <>
    <div className="main-container">
        <Lnavbar/>
        <div className="main-auth-box">
            <div className="auth">
                <div className="f-pass">
                    Forgot Password
                </div>

                <form onSubmit={(e)=>{
                    e.preventDefault()
                }} action="" className="f-pass-form">

                    <input type="email" name="email" id="email" className='input-field' placeholder='Email' />

                    <div className="otp-box">
                    <input type="text" name="otp" id="otp" className="input-field" placeholder='One Time Password'/>
                    <button className='send-otp'>Send OTP</button>
                    </div>
                </form>

                <div className="continue">
                    <Link to='/'><button>Continue</button></Link>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Forgetpassword