import React, { useState, useEffect } from "react";
import Buzz from "./Buzz";
import "../Css/home.css";

const Campusbuzz = () => {
  // State to track the list of events
  const [events, setEvents] = useState([]);

  // State to track whether to show the form
  const [raisebuzz, setraiseBuzz] = useState(false);

  // State to track the event title and description
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // State to track which event is currently being viewed
  const [viewEvent, setViewEvent] = useState(null);

  // Fetch events from the server when the component mounts

  const fetchEvents = async () => {
    try {
      const response = await fetch("/getbuzz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body for POST
      });

      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON, received something else");
      }

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
    e.preventDefault(); // Prevent page reload

    try {
      // Add the new event to the database
      const response = await fetch("/buzzupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          createdAt: new Date().toISOString(), // Store the current time
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post the event");
      }

      const newEvent = await response.json();

      // Update the events state to include the new event
      setEvents([...events, newEvent]);

      // Reset the form fields
      setEventTitle("");
      setEventDescription("");

      // Close the form
      setraiseBuzz(false);
    } catch (error) {
      console.error("Error posting the event:", error);
    }
  };

  return (
    <>
      <div className="h-lr">
        <div className="request-boxes">
          {/* Dynamically render Buzz components for each event */}
          {events.map((event, index) => (
            <Buzz
              key={index}
              title={event.title}
              description={event.description}
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
          <img src="../Images/addreq.png" alt="" />
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
                  onClick={() => {
                    setraiseBuzz(false);
                  }}
                  className="delete-req"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Display event details when View is clicked */}
        {viewEvent && (
          <div className="accept-box">
            <img src="../Images/pp.png" alt="" />
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
