"use client";

import { useState } from "react";
import { useUser } from "@/lib/context/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const user = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // State to hold error message
  const [loading, setLoading] = useState(false); // State to indicate loading

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous error messages

    // Basic client-side validation
    if (!name) {
      setError("Please enter your name.");
      return;
    }

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
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true); // Set loading state to true when registration starts

    try {
      await user.register(email, password, name);
      router.push("/blog"); // Navigate to the blog page after successful registration
    } catch (error) {
      // Handle registration errors
      if (error.code === 400) {
        setError("Invalid email or password.");
      } else if (error.code === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Failed to register. Please try again later.");
        console.error("Registration Error:", error);
      }
    } finally {
      setLoading(false); // Set loading state to false when registration completes
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
        <h1 style={{ textAlign: "center", marginBlock: "1rem", color: "#000" }}>Signup</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        />
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
          placeholder="Password (min. 8 characters)" // Updated placeholder
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
          {loading ? "Signing up..." : "Signup"} {/* Display loading text when loading */}
        </button>
        {error && (
          <p style={{ color: "red", textAlign: "center", marginBlock: "1rem" }}>
            {error}
          </p>
        )}
        <p style={{ textAlign: "center", color: "#555" }}>
          Already have an account? <Link href="/auth/login" style={{ color: "#000" }}>Log In</Link>
        </p>
      </form>
    </section>
  );
}
