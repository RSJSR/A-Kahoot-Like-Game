// remaining work:
// comments
// css restyle(if necessary)
// add advance display for questions(pic, youtube url)
// remove Chinese(if necessary)
// bonus, UIUX
import React from 'react';
import { Button } from 'antd';
import { Link, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import Dashboard from './components/Dashboard';
import ShowGameQuestions from './components/showGameQuestions';
import ModifyQuestion from './components/modifyQuestion';
import SessionResult from './components/sessionResult';
import PlayerName from './components/playerName';
import PlayerInterface from './components/playerInterface';
function App () {
  const [token, setToken] = React.useState(null);
  const [isLoadingToken, setIsLoadingToken] = React.useState(true);

  const handleToken = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  // const navigate = useNavigate();

  function logout () {
    fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    setToken(null);
    localStorage.removeItem('token', token);
    // navigate('/signin');
  }

  React.useEffect(() => {
    setIsLoadingToken(true);
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
    setIsLoadingToken(false);
  }, []);

  if (isLoadingToken) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div>
        <header>
          <nav>
            {token
              ? (
              <>
                <Button type="link" onClick={logout}>
                  Log out
                </Button>
              </>
                )
              : (
              <>
                <span>
                  <Link to="/signup">
                    <Button type="link">Sign up</Button>
                  </Link>
                </span>
                &nbsp;|&nbsp;
                <span>
                  <Link to="/signin">
                    <Button type="link">Sign in</Button>
                  </Link>
                </span>
              </>
                )}
          </nav>
          <hr />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem('token')
                  ? <Navigate to="/dashboard" />
                  : <SignUp onSuccess={handleToken} />
              }
            />
            <Route
              path="/signup"
              element={
                localStorage.getItem('token')
                  ? <Navigate to="/dashboard" />
                  : <SignUp onSuccess={handleToken} />
              }
            />
            <Route
              path="/signin"
              element={
                localStorage.getItem('token')
                  ? <Navigate to="/dashboard" />
                  : <SignIn onSuccess={handleToken} />
              }
            />
            <Route
              path="/dashboard"
              element={
                token
                  ? <Dashboard token={token} />
                  : <Navigate to="/signin" />}
            />
            <Route
              path="/editgame/:gameName"
              element={
                token
                  ? <ShowGameQuestions />
                  : <Navigate to="/signin" />
                }
            />
            <Route
              path="/editgame/:gameName/:questionId"
              element={
                token
                  ? <ModifyQuestion />
                  : <Navigate to="/signin" />}
            />
            <Route
              path="/result/:sessionId"
              element={
                token
                  ? <SessionResult />
                  : <Navigate to="/signin" />}
            />
            <Route
              path="/:gameName/:sessionId"
              element={<PlayerName />}
            />
            <Route
              path="/play/:sessionId/:playerId"
              element={<PlayerInterface />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

// reset data: run     npm run reset    in backend folder
// lint format: run     npm run lint -- --fix      in frontend folder
