"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { current: user, updateName, updateEmail, changePassword, verifyEmail, loading } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [message, setMessage] = useState(""); // For success/error messages
  const [loadingState, setLoadingState] = useState({ name: false, email: false, password: false });
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?next=/profile");
    }
  }, [user, loading, router]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  if (!user) return null;

  const handleNameUpdate = async () => {
    setLoadingState(prev => ({ ...prev, name: true }));
    try {
      const success = await updateName(name);
      if (success) {
        setMessage("Name updated successfully!");
        setMessageType("success");
        setIsNameEditing(false);
      } else {
        setMessage("Failed to update name. Please try again.");
        setMessageType("error");
      }
    } catch {
      setMessage("Error updating name.");
      setMessageType("error");
    } finally {
      setLoadingState(prev => ({ ...prev, name: false }));
    }
  };

  const handleEmailUpdate = async () => {
    if (!email || !oldPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    setLoadingState(prev => ({ ...prev, email: true }));
    try {
      const success = await updateEmail(email, oldPassword);
      if (success) {
        setMessage("Email updated successfully!");
        setMessageType("success");
        setOldPassword("");
        setIsEmailEditing(false);
      } else {
        setMessage("Failed to update email. Please check your current password.");
        setMessageType("error");
      }
    } catch {
      setMessage("Error updating email.");
      setMessageType("error");
    } finally {
      setLoadingState(prev => ({ ...prev, email: false }));
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    setLoadingState(prev => ({ ...prev, password: true }));
    try {
      const success = await changePassword(oldPassword, newPassword);
      if (success) {
        setMessage("Password updated successfully!");
        setMessageType("success");
        setOldPassword("");
        setNewPassword("");
        setIsPasswordEditing(false);
      } else {
        setMessage("Failed to update password. Please try again.");
        setMessageType("error");
      }
    } catch {
      setMessage("Error updating password.");
      setMessageType("error");
    } finally {
      setLoadingState(prev => ({ ...prev, password: false }));
    }
  };

  const [messageType, setMessageType] = useState(""); // To track message type (success or error)

  const styles = {
    profileContainer: {
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#fff",
      borderRadius: "8px",
    },
    fieldContainer: {
      marginBottom: "1.5rem",
      padding: "0.8rem 1rem",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginTop: "0.5rem",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "1rem",
    },
    label: {
      fontWeight: "500",
      marginBottom: "1rem",
      display: "block",
    },
    buttonContainer: {
      marginTop: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#000",
      color: "#fff",
      cursor: "pointer",
      position: "relative",
    },
    cancelButton: {
      backgroundColor: "#ccc",
    },
    message: {
      textAlign: "center",
      marginTop: "1rem",
      fontWeight: "bold",
      color: messageType === "success" ? "green" : messageType === "error" ? "red" : "black",
    }
  };

  return (
    <div style={styles.profileContainer}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>Profile</h2>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Name:</label>
        {isNameEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.buttonContainer}>
              <button onClick={handleNameUpdate} style={styles.button}>
                {loadingState.name ? "Updating..." : "Update"}
              </button>
              <button onClick={() => setIsNameEditing(false)} style={{ ...styles.button, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>{name}</div>
            <button onClick={() => setIsNameEditing(true)} style={{ ...styles.button, marginTop: 10 }}>
              Edit
            </button>
          </>
        )}
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Email:</label>
        {isEmailEditing ? (
          <>
            <input
              type="email"
              value={email}
              placeholder="New Email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.buttonContainer}>
              <button onClick={handleEmailUpdate} style={styles.button}>
                {loadingState.email ? "Updating..." : "Update"}
              </button>
              <button onClick={() => setIsEmailEditing(false)} style={{ ...styles.button, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>{email}</div>
            <button onClick={() => setIsEmailEditing(true)} style={{ ...styles.button, marginTop: 10 }}>
              Edit
            </button>
          </>
        )}
      </div>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Password:</label>
        {isPasswordEditing ? (
          <>
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="New Password (at least 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.buttonContainer}>
              <button onClick={handlePasswordUpdate} style={styles.button}>
                {loadingState.password ? "Updating..." : "Update"}
              </button>
              <button onClick={() => setIsPasswordEditing(false)} style={{ ...styles.button, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>*******</div>
            <button onClick={() => setIsPasswordEditing(true)} style={{ ...styles.button, marginTop: 10 }}>
              Change Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
