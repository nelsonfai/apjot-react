'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/context/user';

const EmailVerificationAlert = () => {
  const { current: user } = useUser();
  const [showAlert, setShowAlert] = useState(user?.emailVerification === false);

  if (!showAlert) {
    return null;
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const styles = {
    alertContainer: {
      padding: '1rem',
      backgroundColor: '#ffdddd',
      border: '1px solid #f5c2c2',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    alertMessage: {
      color: '#d8000c',
      marginRight: '1rem',
    },
    closeButton: {
      backgroundColor: '#d8000c',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.alertContainer}>
      <span style={styles.alertMessage}>
        You need to verify your email address. <Link href="/profile/">Verify Now</Link>
      </span>
      <button onClick={handleCloseAlert} style={styles.closeButton}>
        Close
      </button>
    </div>
  );
};

export default EmailVerificationAlert;
