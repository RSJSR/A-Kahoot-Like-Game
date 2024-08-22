import React from 'react';
import { Button, Input, message } from 'antd';
import './sign_in_up.css'
import { useNavigate } from 'react-router-dom';

function SignUp ({ onSuccess }) { // Sign up page
  const [email, setEmail] = React.useState(''); // Initializes the email and password and name
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  async function register () {
    if (!/^\S+@\S+\.\S+$/.test(email)) { // Register limitation
      message.error('Please input vaild emaill adress');
      return;
    }
    if (password.length < 6) {
      message.error('Password must contain more than 6 characters');
      return;
    }
    const response = await fetch('http://localhost:5005/admin/auth/register', { // Make a post request to the database
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    });
    const data = await response.json();
    if (data.error === 'Email address already registered') { // Return the error , reminder
      message.error('Please input a new Email address');
      return;
    }
    onSuccess(data.token);
    navigate('/dashboard');
  }
  return (
    <>
    <div className="signin-container">
      <div className="signin-form">
        <div className="sign-in-title"><h1>Sign up</h1></div>
        <div className="signin-form-item">
          <label className="signin-label">Email:</label>
          <Input data-testid="signupInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="signin-form-item">
          <label className="signin-label">Password:</label>
          <Input data-testid="signupInputPassword" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="signin-form-item">
          <label className="signin-label">Name:</label>
          <Input data-testid="signupInputName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button data-testid="signupButton" type="primary" onClick={register}>Sign up</Button>
      </div>
    </div>
  </>
  )
}

export default SignUp;
