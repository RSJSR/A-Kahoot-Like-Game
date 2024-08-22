import React from 'react';
import { Button, Input, message } from 'antd';
import './sign_in_up.css'
import { useNavigate } from 'react-router-dom';
function SignIn ({ onSuccess }) { // Sign in page
  const [email, setEmail] = React.useState(''); // Initializes the email and password
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  async function login () { // Make a post request to the database
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const data = await response.json();
    if (data.error === 'Invalid username or password') { // Return the error , reminder
      message.error('Please input vaild username and password');
      return;
    }
    onSuccess(data.token);
    navigate('/dashboard');
  }

  return (
    <div className="signin-container">
      <div className="signin-form">
        <div className="sign-in-title"><h1>Sign in</h1></div>
        <div className="signin-form-item">
          <span className="signin-label">Email:</span>
          <Input data-testid="signinInputEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="signin-form-item">
          <span className="signin-label">Password:</span>
          <Input data-testid="signinInputPassword"value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
          <Button data-testid="signinButton" type="primary" onClick={login} >Sign in</Button>
      </div>
    </div>
  )
}

export default SignIn;
