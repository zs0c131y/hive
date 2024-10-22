import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "../Css/Databank.css";

const Databank = () => {
  const [modal, setModal] = useState(null);
  const [upload, setUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(Cookies.get("userEmail") || "");
  const [name, setName] = useState("");
  const [posts, setPosts] = useState([]);

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

  // Fetch posts for databank
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/dbank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Error fetching posts, status:", response.status);
          console.error("Response text:", text);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Handle upload submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile || !fileTitle || !fileDescription) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("title", fileTitle);
    formData.append("description", fileDescription);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("time", new Date());

    console.log("Form Data:", formData.name);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload the file.");

      const data = await response.json();
      console.log("Upload successful:", data);
      setUpload(false);
      setUploadedFile(null);
      setFileTitle("");
      setFileDescription("");
      setError(null);
      setPosts((prevPosts) => [data.file, ...prevPosts]);
    } catch (error) {
      console.error("Error uploading the file:", error);
      setError("Failed to upload the file. Please try again.");
    }
  };

  // Function to handle file download
  const handleDownload = async () => {
    if (!modal) return;

    try {
      const response = await fetch(`/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: modal.path, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to download the file.");
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link element and click it to download
      const a = document.createElement("a");
      a.href = url;
      a.download = modal.title; // Use the title as the file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <>
      <div>
        <div onClick={() => setUpload(true)} className="databank-add-btn">
          <img src="../Images/addreq.png" alt="Add Request" />
        </div>

        <div className="db-container">
          <div className="db-boxes">
            {posts.map((post) => (
              <div
                key={post._id}
                className="db-box"
                onClick={() => setModal(post)}
              >
                <img src="../Images/project.png" alt="" />
                <div className="db-box-title">{post.title}</div>
              </div>
            ))}
          </div>

          {modal && (
            <div className="accept-box">
              <img src="../Images/calender.png" alt="Calendar" />
              <div className="accept-title">{modal.title}</div>
              <div className="accept-description">{modal.description}</div>
              <div className="req-btns">
                <button onClick={handleDownload} className="reject-req">
                  Download
                </button>
                <button onClick={() => setModal(null)} className="reject-req">
                  Close
                </button>
              </div>
              <div className="sendername">Posted by: {modal.name}</div>
            </div>
          )}

          {upload && (
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
                onChange={handleFileUpload}
              />

              <form className="req-form" onSubmit={handleUploadSubmit}>
                <div className="req-inputs">
                  <input
                    className="request-input"
                    type="text"
                    placeholder="File Title"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                  />
                  <input
                    className="request-input"
                    type="text"
                    placeholder="File Description"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                  />
                </div>

                <div className="req-btns">
                  <button className="send-req" type="submit">
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUpload(false);
                      setUploadedFile(null);
                      setFileTitle("");
                      setFileDescription("");
                      setError(null);
                    }}
                    className="delete-req"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Databank;
