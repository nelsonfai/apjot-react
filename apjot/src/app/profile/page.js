'use client';
import React, { useState, useEffect } from "react";
import { useUser } from '@/lib/context/user';
import { useRouter } from 'next/navigation';
import './profile.module.css'

const ProfilePage = () => {
  const { current: user, updateName, updateEmail, changePassword, verifyEmail ,loading} = useUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('auth/login?next=/profile');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;


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
    const success = await updateName(name);
    if (success) {
      setIsNameEditing(false);
    }
  };

  const handleEmailVerification = async () => {
    await verifyEmail(email);
  };

  const handleEmailUpdate = async () => {
    const success = await updateEmail(email, oldPassword);
    if (success) {
      setOldPassword("");
      setEmail("");
      setIsEmailEditing(false);
    }
  };

  const handlePasswordUpdate = async () => {
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
              placeholder="Enter password"
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

      {isPasswordEditing ? (
        <div className="field-container">
          <label>Password:</label>
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
        </div>
      ) : (
        <div className="field-container">
          <label>Password:</label>
          <div>*******</div>
          <button onClick={handlePasswordEdit}>Change Password</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
