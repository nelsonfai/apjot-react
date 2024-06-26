import React, { useState } from "react";
import { useUser } from "../lib/context/user";
import "../styles/Login.css";
import { useHistory, Link } from "react-router-dom";

export default function Login() {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error message
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      if (email && password) {

        await user.login(email, password);
        history.push("/blog"); // Navigate to the blog page after successful login
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
        <h1 style={{  marginBlock: 20 }}>Login</h1>
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
        {error && <p style={{ color: "red",textAlign:'center',marginBlock:10 }}>{error}</p>} {/* Display error message if error state is not empty */}
        <p style={{ textAlign: "center", color: "grey" }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p style={{ textAlign: "center", color: "grey" }}>
          Forgot Password? <Link to="/password-recovery">Recover Password</Link>
        </p>
      </form>
    </section>
  );
}
