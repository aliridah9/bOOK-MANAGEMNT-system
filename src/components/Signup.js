import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import "./login.css"

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
                   Sign up
                  </Button>
                  </div>
                    <hr />
               <div className="text-center mt-3 delete-acnt">
              Already have an account? <Link to="/">Log In</Link>
            </div>
    </form>
   

</div>
    </>



  );
};

export default Signup;