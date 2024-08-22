import { Input, Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sign_in_up.css'

function PlayerName () {
  const navigate = useNavigate();
  const url = window.location.href; // get session id
  const parts = url.split('/');
  const sessionId = parts[parts.length - 1];
  const [playername, setPlayername] = React.useState('');
  async function handleSubmit () { // input player name then navigate to player interface
    const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: playername,
      })
    });
    const res = await response.json();
    navigate(`/play/${sessionId}/${res.playerId}`);
  }
  return (
      <div className="signin-container">
      <div className="signin-form">
        <div className="sign-in-title"><h1>Input player name and Join the Game</h1></div>
        <div className="signin-form-item">
          <Input data-testid="playernameInput" type="playername" value={playername} onChange={(e) => setPlayername(e.target.value)} />
        </div>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
      </div>
     </div>
  );
}
export default PlayerName;
