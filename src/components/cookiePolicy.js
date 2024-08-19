'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CookiePolicyContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #000;
  color: #fff;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
`;

const PolicyText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  background-color: #fff;
  color: #000;
  border-radius: 4px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CookiePolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <CookiePolicyContainer>
      <PolicyText>
        We use cookies for session management and analytics. By continuing to
        use this site, you consent to our use of cookies.
      </PolicyText>
      <ButtonGroup>
        <Button onClick={handleAccept}>Accept</Button>
        <Button onClick={handleDecline}>Decline</Button>
      </ButtonGroup>
    </CookiePolicyContainer>
  );
};

export default CookiePolicy;
