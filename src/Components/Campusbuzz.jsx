import React, { useState, useEffect } from "react";
import Buzz from "./Buzz";
import "../Css/home.css";
import Cookies from "js-cookie";

const Campusbuzz = () => {
  const [events, setEvents] = useState([]);
  const [raisebuzz, setraiseBuzz] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [viewEvent, setViewEvent] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [email, setEmail] = useState(Cookies.get("userEmail") || "");
  const [name, setName] = useState("");

  // Fetch the user's name
  useEffect(() => {
    const fetchProfile = async () => {
      if (email) {
        try {
          const response = await fetch("/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (response.ok) {
            const data = await response.json();
            setName(data.name);
          } else {
            console.error("Error fetching profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [email]);

  // Fetch events from the server when the component mounts
  const fetchEvents = async () => {
    try {
      const response = await fetch("/getbuzz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched events:", data);

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("An error occurred while fetching events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    };

    // Add it to the state immediately at the top
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    setViewEvent(newEvent);

    setEventTitle("");
    setEventDescription("");
    setraiseBuzz(false);

    try {
      const response = await fetch("/buzzupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to post the event");
      }

      const responseData = await response.json();
      console.log("Successfully posted event:", responseData);
      await fetchEvents();
    } catch (error) {
      console.error("Error posting the event:", error);
    }
  };

  return (
    <>
      <div className="h-lr">
        <div className="request-boxes">
          {events.map((event, index) => (
            <Buzz
              key={index}
              title={event.title}
              description={event.description}
              func={() => setViewEvent(event)}
            />
          ))}
        </div>

        <div
          onClick={() => {
            setraiseBuzz(true);
          }}
          className="request-btn"
        >
          <img src="../Images/addreq.png" alt="Add Request" />
        </div>

        {raisebuzz && (
          <div className="req-box-raise">
            {uploadedFile ? (
              <div className="uploaded-file-name">{uploadedFile.name}</div>
            ) : (
              <img
                className="buzz-img"
                src="../Images/buzz.png"
                alt=""
                onClick={() => document.getElementById("file-upload").click()}
                style={{ cursor: "pointer" }}
              />
            )}

            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />

            <form className="req-form" onSubmit={handleSubmit}>
              <div className="req-inputs">
                <input
                  className="request-input"
                  type="text"
                  name="Event-title"
                  id="Event-title"
                  placeholder="Event title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
                <input
                  className="request-input"
                  type="text"
                  name="Event-Description"
                  id="Event-Description"
                  placeholder="Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>

              <div className="req-btns">
                <button className="send-req" type="submit">
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setraiseBuzz(false);
                    setUploadedFile(null);
                  }}
                  className="delete-req"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {viewEvent && (
          <div className="accept-box">
            <img src="../Images/pp.png" alt="Event" />
            <div className="accept-title">{viewEvent.title}</div>
            <div className="accept-description">{viewEvent.description}</div>
            <div className="req-btns">
              <button
                onClick={() => {
                  setViewEvent(null);
                }}
                className="reject-req"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Campusbuzz;
