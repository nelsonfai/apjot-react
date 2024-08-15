'use client';
import React, { useState, useEffect } from "react";
import { useUser } from '@/lib/context/user';
import { useRouter } from 'next/navigation';

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
  console.log('UER',user)

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

  const styles = {
    profileContainer: {
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
    },
    fieldContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1rem',
      border: '1px solid #f0f0f0',
      padding: '0.8rem',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '1rem',
      border: '1px solid whitesmoke',
    },
    label: {
      width: '80px',
      fontWeight: 'bold',
    },
    buttonContainer: {
      display: 'flex',
      gap: '0.5rem',
    },
  };

  return (
    <div style={styles.profileContainer}>
      <h2>Profile</h2>

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Name:</label>
        {isNameEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <div style={styles.buttonContainer}>
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

      <div style={styles.fieldContainer}>
        <label style={styles.label}>Email:</label>
        {isEmailEditing ? (
          <>
            <input
              type="email"
              value={email}
              required
              placeholder="New Email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              required
              placeholder="Enter password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
            />
            <div style={styles.buttonContainer}>
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
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            required
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            required
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handlePasswordUpdate}>Update</button>
            <button onClick={handlePasswordCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Password:</label>
          <div>*******</div>
          <button onClick={handlePasswordEdit}>Change Password</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
