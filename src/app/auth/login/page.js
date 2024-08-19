"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const { current: user, login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error message
  const [loading, setLoading] = useState(false); // State to indicate loading
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to blog page
    if (user) {
      router.push("/blog");
    }
  }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous error messages

    // Basic client-side validation
    if (!email) {
      setError("Please enter your email.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true); // Set loading state to true when login starts

    try {
      const loginSuccess = await login(email, password);

      if (loginSuccess) {
        router.push("/blog"); // Navigate to the blog page after successful login
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("Failed to login. Please try again later.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false); // Set loading state to false when login completes
    }
  };

  return (
    <section
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1 style={{ textAlign: "center", marginBlock: "1rem", color: "#000" }}>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />
        <button
          className="button"
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: loading ? "#555" : "#000", // Change background color when loading
            color: "#fff",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer", // Disable cursor when loading
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Loading..." : "Login"} {/* Display loading text when loading */}
        </button>
        {error && (
          <p style={{ color: "red", textAlign: "center", marginBlock: "1rem" }}>
            {error}
          </p>
        )}
        <p style={{ textAlign: "center", color: "#555" }}>
          Don't have an account? <Link href="/auth/signup" style={{ color: "#000" }}>Sign Up</Link>
        </p>
        <p style={{ textAlign: "center", color: "#555" }}>
          Forgot Password? <Link href="/auth/password-recovery" style={{ color: "#000" }}>Recover Password</Link>
        </p>
      </form>
    </section>
  );
}
