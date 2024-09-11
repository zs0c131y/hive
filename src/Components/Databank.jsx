import React from 'react'
import '../Css/Databank.css'
const Databank = () => {
  return (
    <>
    <div className="db-container">
        <div className="db-boxes">
            <div className="db-box">
                <img src="../Images/project.png" alt="" />
                
                <div  className="db-box-title">Webserver Project for BCA</div>
            </div>
            <div className="db-box">
                <img src="../Images/calender.png" alt="" />
                
                <div  className="db-box-title">Academic Calendar </div>
            </div>
            <div className="db-box">
                <img src="../Images/report.png" alt="" />
                
                <div  className="db-box-title">Report Writing Format</div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Databank