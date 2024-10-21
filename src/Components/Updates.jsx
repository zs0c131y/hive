import React, { useState, useEffect } from "react";
import Updatesbox from "./Updatesbox";
import Cookies from "js-cookie";

const Updates = () => {
  const [events, setEvents] = useState([]);
  const [raisebuzz, setraiseBuzz] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [viewEvent, setViewEvent] = useState(null);
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

  // Fetch updates from the server when the component mounts
  const fetchEvents = async () => {
    try {
      const response = await fetch("/updates", {
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

      // Set the events state directly from the fetched data
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("An error occurred while fetching events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    };

    setEvents((prevEvents) => [newEvent, ...prevEvents]);

    setEventTitle("");
    setEventDescription("");
    setraiseBuzz(false);

    try {
      const response = await fetch("/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to post the event");
      }

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
            <Updatesbox
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
            <img className="buzz-img" src="../Images/buzz.png" alt="" />
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

export default Updates;
