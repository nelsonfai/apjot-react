'use client';
import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/context/user";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, login } = useUser(); // Destructure user and login from useUser
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error message
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Get the 'next' parameter from the query string
      const urlParams = new URLSearchParams(window.location.search);
      const next = urlParams.get('next') || '/blog'; // Default to '/blog' if 'next' is not present
      router.push(next);
    }
  }, [user,login]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      if (email && password) {
        await login(email, password);

        // Get the 'next' parameter from the query string
        const urlParams = new URLSearchParams(window.location.search);
        const next = urlParams.get('next') || '/blog'; // Default to '/blog' if 'next' is not present
        router.push(next);
      } else {
        // Handle case when one or both fields are empty
        setError("Please fill in both email and password fields.");
      }
    } catch (error) {
      // Handle login errors
      if (error.code === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Failed to login. Please try again later.");
        console.error("Login Error:", error);
      }
    }
  };

  return (
    <section
      style={{
        padding: "1rem",
        maxWidth: "800px",
        margin: "auto",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1 style={{ marginBlock: 20 }}>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <div>
          <button className="button" type="submit">
            Login
          </button>
        </div>
        {error && <p style={{ color: "red", textAlign: 'center', marginBlock: 10 }}>{error}</p>} {/* Display error message if error state is not empty */}
        <p style={{ textAlign: "center", color: "grey" }}>
          Don't have an account? <Link href="/auth/signup">Sign Up</Link>
        </p>
        <p style={{ textAlign: "center", color: "grey" }}>
          Forgot Password? <Link href="/password-recovery">Recover Password</Link>
        </p>
      </form>
    </section>
  );
}
