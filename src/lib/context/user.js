'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { account, ID } from "../appwrite"; // Use your Appwrite configuration here
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function register(email, password, name) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  async function updateName(newName) {
    try {
      const updatedUser = await account.updateName(newName);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Error updating name:", error);
      return false;
    }
  }

  async function verifyEmail() {
    try {
      await account.createVerification();
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      return false;
    }
  }

  async function updateEmail(newEmail, password) {
    try {
      const updatedUser = await account.updateEmail(newEmail, password);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Error updating email:", error);
      return false;
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      await account.updatePassword(newPassword, currentPassword);
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  }

  async function initiatePasswordRecovery(email) {
    try {
      await account.createRecovery(email, 'http://localhost:3000.com');
      return true;
    } catch (error) {
      console.error("Error initiating password recovery:", error);
      return false;
    }
  }

  async function confirmPasswordRecovery(userId, secret, newPassword) {
    try {
      await account.updateRecovery(userId, secret, newPassword, newPassword);
      return true;
    } catch (error) {
      console.error("Error confirming password recovery:", error);
      return false;
    }
  }

  async function init() {
    try {
      const user = await account.get();
      setUser(user);
    } catch (error) {
      console.error("Initialization error:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    init();
    console.log('Initializing user context...');
  }, []);

  return (
    <UserContext.Provider
      value={{
        current: user,
        login,
        logout,
        register,
        updateName,
        updateEmail,
        changePassword,
        verifyEmail,
        initiatePasswordRecovery,
        confirmPasswordRecovery,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
