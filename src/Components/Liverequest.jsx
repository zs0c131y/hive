import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../Css/home.css";
import Requestbox from "./Requestbox";

const Liverequest = ({ addToHistory }) => {
  const [request, setRequest] = useState([]);
  const [reqbox, setreqbox] = useState(false);
  const [accept, setaccept] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newrequest, setnewrequest] = useState({
    title: "",
    description: "",
  });
  const [acceptedData, setAcceptedData] = useState(null);
  const [email, setEmail] = useState(Cookies.get("userEmail") || "");
  const [name, setName] = useState(""); // State to store the user's name
  const [history, setHistory] = useState([]);

  // Function to fetch user's name from /profile route using the email stored in cookies
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Send email from cookies to fetch profile
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.name); // Set the fetched name in the state
        } else {
          console.error("Error fetching profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (email) {
      fetchProfile(); // Fetch the profile when the email is available
    }
  }, [email]);

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
      const now = new Date();

      // Filter and keep the requests that aren't accepted
      const filteredRequests = requests
        .filter((request) => {
          if (request.status === "accepted") return false; // Do not show accepted requests

          if (request.status === "rejected" && request.rejectedAt) {
            const rejectedAt = new Date(request.rejectedAt);
            const timeDifference = now - rejectedAt;
            const twentyFourHours = 24 * 60 * 60 * 1000;
            return timeDifference < twentyFourHours; // Show rejected requests for 24 hours
          }

          return true; // Show non-rejected and non-accepted requests
        })
        .map((request) => ({
          id: request._id,
          name: request.name,
          title: request.title,
          description: request.description,
          status: request.status,
        }));

      setRequest(filteredRequests);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to add a new request
  const addrequest = async (e) => {
    e.preventDefault();
    if (newrequest.title && newrequest.description) {
      try {
        const response = await fetch("/add-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || "Anonymous", // Use the fetched name or default to "Anonymous"
            title: newrequest.title,
            description: newrequest.description,
            status: "", // Initial status
            createdAt: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Request successfully added:", data);

          const newRequestWithId = {
            id: data.requestId, // The ID returned from the server
            name: name || "Anonymous", // Use the user's name
            title: newrequest.title,
            description: newrequest.description,
            status: "", // Initial status
            createdAt: new Date().toISOString(),
          };

          setRequest([...request, newRequestWithId]); // Update state with the new request
          fetchRequests();
          setnewrequest({ title: "", description: "" });
          setreqbox(false);
        } else {
          console.error("Failed to add request:", await response.text());
        }
      } catch (error) {
        console.error("Error adding request:", error);
        setreqbox(false);
      }
    }
  };

  const clicked = (id) => {
    setaccept(true);
    setSelectedRequest(id); // Set selected request by ID
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

      // Error check
      if (!response.ok) {
        throw new Error(`Failed to update request: ${await response.text()}`);
      }

      // Update state after a successful response
      const acceptedRequest = request.find((r) => r.id === selectedRequest);
      setAcceptedData(acceptedRequest);
      setHistory([...history, acceptedRequest]);
      await fetchRequests();
      setaccept(false);
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
        // Find the accepted request
        const acceptedRequest = request.find((r) => r.id === selectedRequest);

        // Call the function to add the accepted request to history
        addToHistory(acceptedRequest);

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
