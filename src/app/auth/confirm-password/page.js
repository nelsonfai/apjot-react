

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user";  // Update this import path as needed

const PasswordRecoveryConfirmationPage = () => {
  const router = useRouter();
  const { confirmPasswordRecovery } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");

    if (!userId || !secret) {
      setError("Missing or invalid query parameters.");
    }
  }, []);

  const handleConfirmPasswordRecovery = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");

    try {
      const success = await confirmPasswordRecovery(userId, secret, password);
      if (success) {
        router.push("/"); // Redirect to the home page
      } else {
        setError("Password recovery confirmation failed.");
      }
    } catch (error) {
      console.error("Error confirming password recovery:", error);
      setError("An error occurred while confirming password recovery.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',

    },
    heading: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#333',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
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
      marginTop: '1rem',
    },
    loadingText: {
      position: 'absolute',
      right: '1rem',
    },
    message: {
      textAlign: 'center',
      marginTop: '1rem',
      fontWeight: 'bold',
      color: error ? 'red' : 'black',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Password Recovery Confirmation</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={8}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
            minLength={8}
          />
        </div>
        {error && <div style={styles.message}>{error}</div>}
        <button
          type="button"
          onClick={handleConfirmPasswordRecovery}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm Password Recovery"}
          {loading && <span style={styles.loadingText}>...</span>}
        </button>
      </form>
    </div>
  );
};

export default PasswordRecoveryConfirmationPage;
