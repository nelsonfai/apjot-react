import React, { useState } from "react";
import { useUser } from "../../lib/context/user";

const PasswordRecoveryInitiationPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { initiatePasswordRecovery } = useUser();

  const handlePasswordRecoveryInitiate = async () => {
    const success = await initiatePasswordRecovery(email);
    if (success) {
      setMessage("Password recovery initiated. Check your email for further instructions.");
    } else {
      setMessage("Failed to initiate password recovery. Please try again.");
    }
  };

  return (
    <div className='profile-container'>
      <h2>Password Recovery Initiation</h2>
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        style={{width:'100%',padding:10,fontSize:'large',border:'1px solid whitesmoke',marginTop:15,}}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handlePasswordRecoveryInitiate} type="submit" style={{border:'none',width:'100%',padding:10,color:'white',backgroundColor:'black',marginTop:10}}>Initiate Password Recovery</button>
      <div>{message}</div>
    </div>
  );
};

export default PasswordRecoveryInitiationPage;
