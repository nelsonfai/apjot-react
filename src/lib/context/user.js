import { ID } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite";
import PropTypes from "prop-types"; // Import PropTypes
import { useHistory } from "react-router-dom"; // Import useHistory from react-router-dom

const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const history = useHistory();

  async function login(email, password) {
    console.log(email, password);
    const loggedIn = await account.createEmailSession(email, password);
    setUser(loggedIn);
    rou.push("/blogs"); // Redirect to blogs page after login
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    window.location.reload();
  }

  async function register(email, password) {
    await account.create(ID.unique(), email, password);
    await login(email, password);
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
    <UserContext.Provider value={{ current: user, login, logout, register }}>
      {props.children}
    </UserContext.Provider>
  );
}
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children prop is provided and of type node
};
