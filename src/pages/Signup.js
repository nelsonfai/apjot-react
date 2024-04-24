import { useState } from "react";
import { useUser } from "../lib/context/user";
import "../styles/Login.css";
import { useHistory, Link } from "react-router-dom";

export default function Signup() {
  const user = useUser();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // State to hold error message

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      if (email && password) {
        if(password.length < 8){
          setError("Password Must be atleast 8 characters Long")
          return
        }
        await user.register(email, password, name);
        history.push("/blog"); // Navigate to the blog page after successful registration
      } else {
        // Handle case when one or both fields are empty
        setError("Please fill in both email and password fields.");
      }
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
        <h1 style={{  marginBlock: 20 }}>Signup</h1>
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <div>
          <button className="button" type="submit">
            Signup
          </button>
        </div>
        {error && <p style={{ color: "red" ,textAlign:'center',marginBlock:10}}>{error}</p>} {/* Display error message if error state is not empty */}
        <p style={{ textAlign: "center", color: "grey" }}>
          Don't have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </section>
  );
}
