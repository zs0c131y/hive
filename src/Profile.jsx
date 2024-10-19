import React, { useState, useEffect } from "react";
import "./Css/Profile.css";
import Hnavbar from "./Components/Hnavbar";
import History from "./Components/History";
import Downloads from "./Components/Downloads";
import Uploads from "./Components/Uploads";
import Cookies from "js-cookie";
import { getAuth, signOut } from "firebase/auth";

const Profile = ({ history }) => {
  const [record, setRecord] = useState("1");
  const [pdata, setPdata] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState(Cookies.get("userEmail") || "");
  const [userHistory, setUserHistory] = useState([]);
  const [userRecords, setUserRecords] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [uploads, setUploads] = useState([]); // State to hold upload records

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          setProfileName(data.name);
        } else {
          console.error("Error fetching profile");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Cookies.remove("userEmail");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const fetchUserRecords = async () => {
    try {
      const response = await fetch("/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRecords(data);
      } else {
        console.error("Error fetching user records");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const response = await fetch("/requests/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acceptedByEmail: email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserHistory(data);
      } else {
        console.error("Error fetching user history");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserDownloads = async () => {
    try {
      const response = await fetch("/requests/downloads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
      } else {
        console.error("Error fetching downloads");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch user uploads when "Uploads" is clicked
  const fetchUserUploads = async () => {
    try {
      const response = await fetch("/requests/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUploads(data); // Assuming the response returns an array of upload records
      } else {
        console.error("Error fetching uploads");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserHistory();
      fetchUserDownloads();
      fetchUserUploads();
    }
  }, [email]);

  return (
    <>
      <div className="profile-container">
        <Hnavbar />
        <div className="profile-sections">
          <div className="profile-sec1">
            <div className="profile-box">
              <div className="profile-box-sec-1">
                <div className="profile-pic">
                  <img src="./Images/user2.png" alt="" />
                </div>
                <div className="profile-data">
                  <div className="pp-name">{profileName}</div>
                  <div className="pp-buttons">
                    <button className="p-btn">Edit Profile</button>
                    <button
                      onClick={() => {
                        setPdata((oldValue) => !oldValue);
                        fetchUserRecords();
                      }}
                      className="p-btn"
                    >
                      My Records
                    </button>
                    <button onClick={handleLogout} className="p-btn">
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`profile-box-sec-2 ${pdata ? "extra-height" : ""}`}
              >
                {pdata && userRecords.length === 0 ? "No records." : null}
                {pdata && userRecords.length > 0 && (
                  <div className="user-records">
                    {userRecords.map((record, index) => (
                      <History key={index} history={record} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="profile-sec2">
            <div className="records">
              <ul className="record-list">
                <li
                  className={`records ${record === "1" ? "lines" : ""}`}
                  onClick={() => {
                    setRecord("1");
                    fetchUserHistory();
                  }}
                >
                  History
                </li>
                <li
                  className={`records ${record === "2" ? "lines" : ""}`}
                  onClick={() => {
                    setRecord("2");
                    fetchUserDownloads();
                  }}
                >
                  Downloads
                </li>
                <li
                  className={`records ${record === "3" ? "lines" : ""}`}
                  onClick={() => {
                    setRecord("3");
                    fetchUserUploads(); // Fetch user uploads when "Uploads" is clicked
                  }}
                >
                  Uploads
                </li>
              </ul>
            </div>
            <div className="record-data">
              {record === "1" && (
                <>
                  {userHistory.length > 0 ? (
                    userHistory.map((item, index) => (
                      <History key={index} history={item} />
                    ))
                  ) : (
                    <p className="user-records">No history available.</p>
                  )}
                </>
              )}
              {record === "2" && (
                <>
                  {downloads.length > 0 ? (
                    downloads.map((download, index) => (
                      <Downloads key={index} download={download} />
                    ))
                  ) : (
                    <p className="user-records">No downloads available.</p>
                  )}
                </>
              )}
              {record === "3" && (
                <>
                  {uploads.length > 0 ? (
                    uploads.map((upload, index) => (
                      <Uploads key={index} upload={upload} />
                    ))
                  ) : (
                    <p className="user-records">No uploads available.</p>
                  )}
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
