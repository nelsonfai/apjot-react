import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const loggedIn = await account.createEmailSession(email, password);
    setUser(loggedIn);
    if (loggedIn) {
      return true;
    }
    return false;
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    window.location.reload();
  }

  async function register(email, password, name, emailVerification = true) {
    const status = await account.create(email, password, name, emailVerification);
    await login(email, password);
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

  async function verifyEmail(email) {
    try {
      await account.createVerification(email);
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
      await account.updatePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  }

  async function initiatePasswordRecovery(email) {
    try {
      await account.createRecovery(email,'apjot.blog/password-recovery/confirm');
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
      console.error("Error confirming password recovery once:", error);
      return false;
    }
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
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
        confirmPasswordRecovery
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children prop is provided and of type node
};
