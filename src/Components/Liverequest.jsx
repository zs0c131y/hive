import React, { useState } from "react";
import "../Css/home.css";
import Requestbox from "./Requestbox";
import { useEffect } from "react";

const Liverequest = () => {
  const [request, setRequest] = useState([]);
  const [reqbox, setreqbox] = useState(false);
  const [accept, setaccept] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newrequest, setnewrequest] = useState({
    title: "",
    description: "",
  });

  // Function to fetch requests from the server
  async function fetchRequests() {
    try {
      const response = await fetch("/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const requests = await response.json();

      // Extract only the name, title, and description from each request
      const filteredRequests = requests.map((request) => ({
        name: request.name,
        title: request.title,
        description: request.description,
      }));

      // Update the state with the fetched requests
      setRequest(filteredRequests);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  const addrequest = async (e) => {
    e.preventDefault();
    if (newrequest.title && newrequest.description) {
      try {
        // Send the request to the server
        const response = await fetch("/add-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newrequest.title,
            description: newrequest.description,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Request successfully added:", data);

          // Update the state after successful submission
          setRequest([...request, newrequest]);
          setnewrequest({ title: "", description: "" });
          setreqbox(false);
        } else {
          console.error("Failed to add request:", await response.text()); // Handle the error message from the server
        }
      } catch (error) {
        console.error("Error adding request:", error);
        setreqbox(false);
      }
    }
  };

  const clicked = (index) => {
    setaccept(true);
    setSelectedRequest(index);
  };

  const acceptRequest = () => {
    setRequest(request.filter((_, index) => index !== selectedRequest));
    setaccept(false);
  };

  return (
    <div className="h-lr">
      <div className="request-boxes">
        {request.map((item, index) => (
          <Requestbox
            key={index}
            title={item.title}
            func={() => clicked(index)}
          />
        ))}
      </div>

      <div
        className="request-btn"
        onClick={() => {
          setreqbox(true);
        }}
      >
        <img src="../Images/addreq.png" alt="" />
      </div>

      {reqbox && (
        <div className="req-box-raise">
          <img src="../Images/pp.png" alt="" />
          <div className="req-user-name">Name</div>
          <form className="req-form" onSubmit={addrequest}>
            <div className="req-inputs">
              <input
                onChange={(e) =>
                  setnewrequest({ ...newrequest, title: e.target.value })
                }
                className="request-input"
                type="text"
                name="req-raise-title"
                id="req-raise-title"
                placeholder="Title..."
              />
              <input
                onChange={(e) =>
                  setnewrequest({ ...newrequest, description: e.target.value })
                }
                className="request-input"
                type="text"
                name="req-raise-desc"
                id="req-raise-desc"
                placeholder="Description"
              />
            </div>

            <div className="req-btns">
              <button className="send-req">Request</button>
              <button
                onClick={() => {
                  setreqbox(false);
                }}
                className="delete-req"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      )}

      {accept && selectedRequest !== null && (
        <div className="accept-box">
          <img src="../Images/pp.png" alt="" />
          <div className="accept-title">{request[selectedRequest].title}</div>
          <div className="accept-description">
            {request[selectedRequest].description}
          </div>

          <div className="req-btns">
            <button onClick={acceptRequest} className="accept-req">
              Accept
            </button>
            <button
              onClick={() => {
                setaccept(false);
              }}
              className="reject-req"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liverequest;
