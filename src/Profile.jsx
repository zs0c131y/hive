import React, { useState } from 'react';
import './Css/Profile.css';
import Hnavbar from './Components/Hnavbar';
import History from './Components/History';
import Downloads from './Components/Downloads';
import Uploads from './Components/Uploads';

const Profile = ({ history }) => {
  const [record, setRecord] = useState('1');
  const [pdata,setpdata] = useState(false)

  return (
    <>
      <div className='profile-container'>
        <Hnavbar />
        <div className='profile-sections'>
          <div className='profile-sec1'>
            <div className='profile-box'>

              <div className="profile-box-sec-1">
              <div className='profile-pic'>
                <img src='./Images/user2.png' alt='' />
              </div>
              <div className='profile-data'>
                <div className='pp-name'>Name</div>
                <div className='pp-buttons'>
                  <button className='p-btn'>Edit Profile</button>
                  <button onClick={()=>{
                    setpdata((oldvalue)=>{
                      return !oldvalue
                    })
                  }} className='p-btn'>My Records</button>
                </div>
              </div>
              </div>

              <div className={`profile-box-sec-2 ${pdata?"extra-height":""}`}>No records.</div>




            </div>
          </div>
          <div className='profile-sec2'>
            <div className='records'>
              <ul className='record-list'>
                <li
                  className={`records ${record === '1' ? 'lines' : ''}`}
                  onClick={() => {
                    setRecord('1');
                  }}
                >
                  History
                </li>
                <li
                  className={`records ${record === '2' ? 'lines' : ''}`}
                  onClick={() => {
                    setRecord('2');
                  }}
                >
                  Downloads
                </li>
                <li
                  className={`records ${record === '3' ? 'lines' : ''}`}
                  onClick={() => {
                    setRecord('3');
                  }}
                >
                  Uploads
                </li>
              </ul>
            </div>
            <div className='record-data'>
              {record === '1' && (
                <>
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <History key={index} history={item} />
                    ))
                  ) : (
                    <p className='user-records'>No history available.</p>
                  )}
                </>
              )}
              {record === '2' && (
                <>
                  <Downloads downloads='No downloads.' />
                </>
              )}
              {record === '3' && (
                <>
                  <Uploads upload="No uploads."/>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
