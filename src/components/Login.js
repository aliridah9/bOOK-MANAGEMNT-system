import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/home");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
    
      <div className="form-container">
    <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          {error && <Alert variant="danger">{error}</Alert>}
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" 
             onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter password" 
             onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="login-div">
        <Button className="primary-log" type="Submit">
                    Log In
                  </Button></div>
                    <hr />
                                <div className="google-btn">
                <GoogleButton
                  className="g-btn"
                  type="dark"
                  onClick={handleGoogleSignIn}
                />
              </div>
              
               <div className="text-center mt-3 delete-acnt">
              Don't have an account? <Link to="/signup"><span>Sign up</span></Link>
            </div>
    </form>
   

</div>
    </>
  );
};

export default Login;