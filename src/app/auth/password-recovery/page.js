"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user";  // Update this import path as needed

const PasswordRecoveryInitiationPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [messageType, setMessageType] = useState(""); // For message type (success or error)
  const { initiatePasswordRecovery } = useUser();
  const router = useRouter();  // Only needed if you plan to use routing

  const handlePasswordRecoveryInitiate = async () => {
    if (!email) {
      setMessage("Email is required.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear previous messages

    const success = await initiatePasswordRecovery(email);
    if (success) {
      setMessage("Password recovery initiated. Check your email for further instructions.");
      setMessageType("success");
      // Optional: redirect to a confirmation or information page
      // router.push('/password-recovery-confirmation');
    } else {
      setMessage("Failed to initiate password recovery. Please try again.");
      setMessageType("error");
    }

    setLoading(false);
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      minHeight:'70vh'

    },
    heading: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginBottom: '1rem',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#000',
      color: '#fff',
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      position: 'absolute',
      right: '1rem',
    },
    message: {
      textAlign: 'center',
      marginTop: '1rem',
      fontWeight: 'bold',
      color: messageType === 'success' ? 'green' : messageType === 'error' ? 'red' : 'black',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Password Recovery Initiation</h2>
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        style={styles.input}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handlePasswordRecoveryInitiate}
        type="button"
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Initiating..." : "Initiate Password Recovery"}
        {loading && <span style={styles.loadingText}>...</span>}
      </button>
      <div style={styles.message}>{message}</div>
    </div>
  );
};

export default PasswordRecoveryInitiationPage;


