import React, { useState, useEffect } from "react";
import { useUser } from "../lib/context/user"; // Import the useUser hook
import { useHistory } from "react-router-dom"; // Import useHistory hook

const ProfilePage = () => {
  const { current: user, updateName, updateEmail, changePassword, verifyEmail } = useUser(); // Destructure updateName, updateEmail, and changePassword from useUser
  const [name, setName] = useState("");
  const history = useHistory(); // Get the history object

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);


  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);


  const handleNameEdit = () => {
    setIsNameEditing(true);
  };

  const handleEmailEdit = () => {
    setIsEmailEditing(true);
  };

  const handlePasswordEdit = () => {
    setIsPasswordEditing(true);
  };

  const handleNameUpdate = async () => {
    // Perform name update logic
    const success = await updateName(name);
    if (success) {
      setIsNameEditing(false);
    }
  };
  const handleEmailVerification = async () => {
    const success = await verifyEmail(email);

  };

  const handleEmailUpdate = async () => {
    // Perform email update logic
    const success = await updateEmail(email, oldPassword);
    if (success) {
      setOldPassword("");
      setEmail("");
      setIsEmailEditing(false);
    }
  };


  const handlePasswordUpdate = async () => {
    // Perform password update logic
    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      setOldPassword("");
      setNewPassword("");
      setIsPasswordEditing(false);
    }
  };

  const handleNameCancel = () => {
    setIsNameEditing(false);
    setName(user.name || "");
  };

  const handleEmailCancel = () => {
    setIsEmailEditing(false);
    setEmail(user.email || "");
  };

  const handlePasswordCancel = () => {
    setIsPasswordEditing(false);
    setOldPassword("");
    setNewPassword("");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="field-container">
        <label>Name:</label>
        {isNameEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="button-container">
              <button onClick={handleNameUpdate}>Update</button>
              <button onClick={handleNameCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div>{name}</div>
            <button onClick={handleNameEdit}>Edit</button>
          </>
        )}
      </div>
      <div className="field-container">
        <label>Email:</label>
        {isEmailEditing ? (
          <>
            <input
              type="email"
              value={email}
              required
              placeholder="New Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Enter  password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <div className="button-container">
              <button onClick={handleEmailUpdate}>Update</button>
              <button onClick={handleEmailCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div>{email}</div>
            <button onClick={handleEmailEdit}>Edit</button>
          </>
        )}
      </div>
{ false &&     <div className="field-container" >
        <label>Password:</label>
        {isPasswordEditing ? (
          <>
            <input
              type="password"
              required
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="button-container">
              <button onClick={handlePasswordUpdate}>Update</button>
              <button onClick={handlePasswordCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div>*******</div>
            <button onClick={handlePasswordEdit}>Change Password</button>
          </>
        )}
      </div>}
    </div>
  );
};

export default ProfilePage;
