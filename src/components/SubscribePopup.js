"use client";

import React, { useState } from "react";
import { initiateSubscribe } from "../lib/context/article";

const SubscribePopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setEmail("");
    try {
      const response = await initiateSubscribe(email);
      setMessage(response.message);
      setColor(response.color);
    } catch (error) {
      setMessage("Something went wrong");
      setColor("red");
      console.error("Error:", error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "x-large", marginBottom: "1rem" }}>
          Join Our Weekly Newsletter
        </h3>
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          Ignite Your Mind with Apjot's Weekly Newsletter: Explore Deep
          Insights, Thought-Provoking Content, and Exclusive Updates
        </p>
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email address"
            style={{
              padding: "1rem",
              width: "100%",
              fontSize: "large",
              borderRadius: "4px",
              border: "1px solid #ddd",
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
              cursor: "pointer",
              borderRadius: "4px",
              border: "none",
              fontSize: "large",
            }}
          />
        </form>
        <p
          style={{
            marginTop: "1rem",
            color: `${color}`,
            minHeight: "20px",
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            backgroundColor: "transparent",
            border: "none",
            color: "#000",
            fontSize: "large",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscribePopup;
