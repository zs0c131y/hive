import React, { useRef, useState } from 'react'
import '../Css/Databank.css'
const Databank = () => {

    const [modal,setmodal] = useState(false)

    const fileInputRef = useRef(null);

  // Function to trigger the file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    console.log("File selected:", uploadedFile);
    // You can now handle the uploaded file (e.g., send it to a server)
  };
  return (
    <>
    <div>
    <div
      onClick={handleImageClick}
      className="databank-add-btn"
    >
        
      <img src="../Images/addreq.png" alt="Add Request" />
      {/* Hidden file input */}
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }} // Hides the file input
    onChange={handleFileUpload} // Handles the file upload when a file is selected
  />
    </div>
    <div className="db-container">


    <div className="db-boxes">
        <div className="db-box">
            <img src="../Images/project.png" alt="" />
            
            <div  className="db-box-title">Webserver Project for BCA</div>
        </div>
        <div className="db-box" onClick={()=>{
        setmodal(true)
      }}>
            
            <img src="../Images/calender.png" alt="" />
            
            <div  className="db-box-title">Academic Calendar </div>
        </div>
        <div className="db-box">
            <img src="../Images/report.png" alt="" />
            
            <div  className="db-box-title">Report Writing Format</div>
        </div>
    </div>
    {modal &&
    <div className="accept-box">
    <img src="../Images/calender.png" alt="Calender" />
    <div className="accept-title">Academic Calendar 2024 - 2025</div>
    <div className="accept-description">The academic calendar for the year 2024-2025 is out now. Use it to catch-up and plan your academic year well. If you hear things have changed, you can check for an updated calendar to be posted here shortly after.</div>
    <div className="req-btns">
    <button
        
        className="reject-req"
      >
        Download
      </button>
      <button
        onClick={() => {
          setmodal(false);
        }}
        className="reject-req"
      >
        Close
      </button>
    </div>
  </div>
    }
</div>
    </div>
    </>
  )
}

export default Databank