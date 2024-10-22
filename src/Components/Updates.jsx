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

  // Fetch the user's profile to get their name
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
      const response = await fetch("/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body for POST
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched events:", data);
      data.forEach((event) => {
        console.log("Author name received:", event.name);
      });

      // Map the fetched data to include author name
      const eventsWithAuthor = data.map((event) => ({
        ...event,
        author: event.name, // Assuming the server returns `name` as the author's name
      }));

      // Set the events state with the mapped events
      setEvents(eventsWithAuthor);
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

    // Immediately update the state for UI feedback
    setEvents((prevEvents) => [newEvent, ...prevEvents]); // Add the new event at the top

    // Reset the form fields
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

      // Fetch updated events from the server
      await fetchEvents(); // Ensure the event list is up-to-date from the server
    } catch (error) {
      console.error("Error posting the event:", error);
    }
  };

  return (
    <>
      <div className="h-lr">
        <div className="request-boxes">
          {/* Dynamically render Updatesbox components for each event */}
          {events.map((event, index) => (
            <Updatesbox
              key={index}
              title={event.title}
              description={event.description}
              author={event.author} // Pass the author name here
              func={() => setViewEvent(event)} // Set the event to view
            />
          ))}
        </div>

        {/* Button to raise a new request */}
        <div
          onClick={() => {
            setraiseBuzz(true);
          }}
          className="request-btn"
        >
          <img src="../Images/addreq.png" alt="Add Request" />
        </div>

        {/* Form to create a new event */}
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

        {/* Display event details when View is clicked */}
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
            <div className="sendername">Posted by: {viewEvent.author}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Updates;
