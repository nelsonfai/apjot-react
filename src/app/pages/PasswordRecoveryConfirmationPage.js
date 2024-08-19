import React, { useEffect, useState } from "react";
import { useRouter, useLocation } from "react-router-dom";
import { useUser } from "../../lib/context/user";

const PasswordRecoveryConfirmationPage = () => {
  const router = useRouter();
  const location = useLocation();
  const { confirmPasswordRecovery } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) {
      setError("Missing or invalid query parameters.");
    }
  }, [location.search]);

  const handleConfirmPasswordRecovery = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

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

  return (
    <div className='profile-container'>
      <h2>Password Recovery Confirmation</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" onClick={handleConfirmPasswordRecovery} disabled={loading}>
          {loading ? "Loading..." : "Confirm Password Recovery"}
        </button>
      </form>
    </div>
  );
};

export default PasswordRecoveryConfirmationPage;
