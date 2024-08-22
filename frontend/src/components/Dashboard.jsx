import {
  UploadOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Divider, Row, Col, Typography, Input, Modal } from 'antd';
import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizId, setQuizId] = React.useState(null);
  const [isOldSessionsVisible, setIsOldSessionsVisible] = useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');
  const { Content } = Layout;
  const [modalContent, setModalContent] = useState(null);
  const [iscontrolgameVisible, setIscontrolModalVisible] = useState(false);
  const [activeSession, setactiveSession] = React.useState(null);
  const navigate = useNavigate();
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [isstopgameVisible, setisstopgameVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);
  const cancelcontrolgameModal = () => {
    setIscontrolModalVisible(false);
  };
  const showcontrolgameModal = () => {
    setIscontrolModalVisible(true);
  };
  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await response.json();
    setQuizzes(data.quizzes);
  }

  function showOldSessionsModal (quiz) { // Control old session modal
    setSelectedQuiz(quiz);
    setIsOldSessionsVisible(true);
  }

  function closeOldSessionsModal () {
    setIsOldSessionsVisible(false);
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, [newGameShow]);

  const startModalClose = () => { // control start modal
    setStartModalVisible(false);
  };
  const stopgameModalClose = () => {
    setisstopgameVisible(false)
  };
  async function StartGameModalContent (quizId) { // Start an active session
    setQuizId(quizId);
    setStartModalVisible(true);
    await fetch(`http://localhost:5005/admin/quiz/${quizId}/start`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const quizResponse = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await quizResponse.json();
    setModalContent(<p>{'localhost:3000/' + quizId + '/' + data.active}</p>);
  }
  function handleCopyClick () { // copy url to the clipboard
    navigator.clipboard.writeText(modalContent.props.children);
  }
  async function EndGameModalContent (quizId) { // End session function
    setisstopgameVisible(true);
    const quizResponse = await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await quizResponse.json();
    setactiveSession(data.active);
    await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('currentQuestionNo', data.state);
  }
  async function stopgameModal () {
    navigate(`/result/${activeSession}`);
    setisstopgameVisible(false);
  }

  async function createNewGame () { // Create new game
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      })
    });
    await fetchAllQuizzes();
  }

  async function deleteGame (gameId) { // Delete game
    await fetch(`http://localhost:5005/admin/quiz/${gameId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    await fetchAllQuizzes();
  }

  async function nextQuestion () { // Advance question
    const responseFetch = await fetch(`http://localhost:5005/admin/quiz/${quizId}/advance`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await responseFetch.json();
    localStorage.setItem('currentQuestionNo', result.stage);
  }
  return <>
    <Layout>
      <Layout collapsible>
        <div className="logo" />
        <Menu
        items={[{
          key: 'item1',
          icon: <UploadOutlined />,
          label: 'Add New Game',
          'data-testid': 'addNewGameButton',
          onClick: () => setNewGameShow(!newGameShow)
        }]}
        />
      </Layout>
      <Layout className="site-layout">
        <Content className={styles.Contend}>
        {newGameShow && (
            <>
              <Row>
                <Col>
                  <Text strong>Name: </Text>
                </Col>
                <Col>
                  <Input
                    value={newQuizName}
                    onChange={(e) => setNewQuizName(e.target.value)}
                  />
                </Col>
                <Col>
                  <Button type="primary" onClick={createNewGame}>
                    Add
                  </Button>
                </Col>
              </Row>
            </>
        )}
        {quizzes.map(quiz => (
        <>
          <nav>
            <Divider orientation="left" style={{ borderColor: 'darkgray' }}>Game: {quiz.name}</Divider>
            <Row>
              <Col span={8}>
                <Button type="primary" onClick={() => StartGameModalContent(quiz.id)}>Start</Button>
              </Col>
              <Col span={8}>
                <Button onClick={() => showOldSessionsModal(quiz)}>Old Sessions</Button>
              </Col>
              <Col span={8}>
              <Button danger onClick={() => deleteGame(quiz.id)}>
                    Delete
              </Button>
              </Col>
              <Col span={8} onClick={showcontrolgameModal}>
                <Button type="primary">Advance</Button>
              </Col>
              <Col span={16}>
                <Button onClick={() => navigate(`/editgame/${quiz.id}`)}>
                  Edit questions
                </Button>
              </Col>
              <Col span={8}>
                  <Button type="primary" danger onClick={() => EndGameModalContent(quiz.id)}>Stop</Button>
              </Col>
            </Row>

            <Modal
              title="Start Game"
              open={startModalVisible}
              onOk={startModalClose}
              onCancel={startModalClose}
            >
              The Game Session Website:
              {modalContent}
              <Button onClick={handleCopyClick}>Copy website to your Clipboard </Button>
            </Modal>

            <Modal
              title="Stop Game"
              open={isstopgameVisible}
              onOk={() => stopgameModal(quiz.id)}
              onCancel={stopgameModalClose}
            >
              Would you like to view the results?
            </Modal>
            <Modal title="Game Control" open={iscontrolgameVisible} onOk={cancelcontrolgameModal} onCancel={cancelcontrolgameModal}>
              <Row>
                <Col span={12}>
                  <Button type="primary" onClick={nextQuestion}>Begin/Next Question</Button>
                </Col>
              </Row>
            </Modal>
            <Modal
              title="Old Sessions"
              visible={isOldSessionsVisible && selectedQuiz && selectedQuiz.id === quiz.id}
              onCancel={closeOldSessionsModal}
              footer={null}
            >
              {quiz.oldSessions.map((sessionId) => (
                <p
                  key={sessionId}
                  onClick={() => {
                    navigate(`/result/${sessionId}`);
                    closeOldSessionsModal();
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {sessionId}
                </p>
              ))}
            </Modal>
          </nav>
        </>
        ))}
        </Content>
      </Layout>
    </Layout>
  </>;
}

export default Dashboard;
