'use client'
import React, { useState } from "react";
import { initiateSubscribe } from "../lib/context/article";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [color,setColor] = useState("black")

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setEmail("");
    try {
      const response = await initiateSubscribe(email); // Call the initiateSubscribe function with the entered email
      setMessage(response.message);
      setColor(response.color); // Set the message based on the response
    } catch (error) {
      setMessage("Something went wrong");
      setColor("red"); // Set a generic error message
      console.error("Error:", error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Update the email state as the user types
  };

  return (
    <div>
      {/* Newsletter section */}
      <div
        style={{
          padding: "2rem 1rem",
          textAlign: "center",
          borderTop: "1px solid rgba(17, 17, 26, 0.1)",
          marginTop: "2rem",
        }}
        id="subscribeToNewsletter"
      >
        <h3 style={{ fontSize: "x-large" }}>Join Our Weekly Newsletter</h3>
        <p style={{ textAlign: "center", marginBlock: "1rem" }}>
          Ignite Your Mind with Apjots Weekly Newsletter: Explore Deep Insights,
          Thought-Provoking Content, and Exclusive Updates
        </p>
        <form
          onSubmit={handleFormSubmit} // Handle form submission
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
          id="newsletterForm"
        >
          <input
            type="email"
            value={email}
            onChange={handleEmailChange} // Handle email input change
            name="subscribeEmail"
            id="subscribeEmail"
            placeholder="Enter email address"
            style={{
              padding: "1rem",
              width: "100%",
              fontSize: "large",
              flex: "4",
              borderRadius: 0,
            }}
            required
          />

          <input
            type="submit"
            value="Subscribe"
            style={{
              padding: "1rem",
              backgroundColor: "black",
              color: "white",
              flex: "1",
            }}
          />
        </form>
        <p
          style={{ textAlign: "center", marginTop: "1rem", color: `${color}` }}
          id="successMessage"
        >
          {message} {/* Display the message */}
        </p>
      </div>

      <footer>
        <div className="social">
          <a
            href="https://www.instagram.com/apjot.blog/"
            target="_blank"
            rel="noreferrer"
          >
            {"  "}
            <i
              className="fa-brands fa-instagram"
              style={{ fontSize: "25px" }}
            ></i>{" "}
          </a>
          <a href="mailto:nelsonfai21@yahoo.com">
            <i
              className="fa-regular fa-envelope"
              style={{ fontSize: "25px" }}
            ></i>{" "}
          </a>
        </div>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="/">Home</a>
          </li>
          <li className="list-inline-item">
            <a href="/blog/">Blog</a>
          </li>
          <li className="list-inline-item">
            <a href="/about/">About</a>
          </li>
        </ul>
        <p hidden>eamil....</p>
        <p className="copyright">Apjot© 2023</p>
      </footer>
    </div>
  );
};

export default Footer;
