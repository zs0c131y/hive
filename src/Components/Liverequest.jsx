import React, { useState, useEffect } from "react";
import "../Css/home.css";
import Requestbox from "./Requestbox";

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

      // Keep the `_id` along with name, title, and description
      const filteredRequests = requests.map((request) => ({
        id: request._id, // Include the MongoDB ID
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
            name: "Name", // Add the name here
            title: newrequest.title,
            description: newrequest.description,
            status: "", // Initial status
            createdAt: new Date().toISOString(), // Store UTC time as ISO string
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Request successfully added:", data);

          // Update the state with the new request including the ID from the server
          const newRequestWithId = {
            id: data.requestId, // The ID returned from the server
            name: "Name", // Include name if needed
            title: newrequest.title,
            description: newrequest.description,
            status: "", // Initial status
            createdAt: new Date().toISOString(), // Store UTC time as ISO string
          };

          // Update the state with the new request
          setRequest([...request, newRequestWithId]);
          fetchRequests();
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

  const clicked = (id) => {
    setaccept(true);
    setSelectedRequest(id); // `id` is now the actual MongoDB ID
  };

  const acceptRequest = async () => {
    try {
      const response = await fetch(`/requests/update/${selectedRequest}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }), // Send the status in the request body
      });

      if (response.ok) {
        // Re-fetch the requests to update the list without a full page refresh
        await fetchRequests();
        setaccept(false);
      } else {
        console.error(
          "Failed to update the status on the server.",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };

  const rejectRequest = async () => {
    try {
      const response = await fetch(`/requests/update/${selectedRequest}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }), // Send the status in the request body
      });

      if (response.ok) {
        // Re-fetch the requests, so the rejected request stays for 24 hours
        await fetchRequests();
        setaccept(false);
      } else {
        console.error(
          "Failed to update the status on the server.",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };

  return (
    <div className="h-lr">
      <div className="request-boxes">
        {request.map((item) => (
          <Requestbox
            key={item.id} // Ensure the key is unique
            title={item.title}
            func={() => clicked(item.id)} // Pass the actual request ID here
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
          <div className="accept-title">
            {request.find((r) => r.id === selectedRequest)?.title}
          </div>
          <div className="accept-description">
            {request.find((r) => r.id === selectedRequest)?.description}
          </div>
          <div className="req-btns">
            <button onClick={acceptRequest} className="accept-req">
              Accept
            </button>
            <button onClick={rejectRequest} className="reject-req">
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liverequest;
