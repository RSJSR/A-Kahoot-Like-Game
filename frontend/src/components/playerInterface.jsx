import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Col, Row, Table } from 'antd';
function PlayerInterface () {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const token = localStorage.getItem('token');
  const [questions, setQuestions] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [status, setStatus] = useState(true);
  const url = window.location.href;
  const parts = url.split('/');
  const playerId = parts[parts.length - 1];
  const sessionId = parts[parts.length - 2];
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [point, setPoint] = useState(null);
  const [correctanswer, setCorrectanswer] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [questionNo, setQuestionNo] = useState(parseInt(localStorage.getItem('currentQuestionNo')) || -1);
  const [timer, setTimer] = useState(0);
  const questionsArray = questions ? Object.values(questions) : [];
  const thisQuestion = questionNo !== -1 ? questionsArray[questionNo] : null;

  useEffect(() => {
    if (thisQuestion) {
      setContent(thisQuestion.question);
      setType(thisQuestion.questionType);
      setCorrectanswer(thisQuestion.Correctanswer);
      setTimeLimit(thisQuestion.TimeLimit);
      setPoint(thisQuestion.Points);
      setAnswer1(thisQuestion['Answer 1']);
      setAnswer2(thisQuestion['Answer 2']);
      setAnswer3(thisQuestion['Answer 3']);
      setAnswer4(thisQuestion['Answer 4']);
      setAnswer5(thisQuestion['Answer 5']);
      setAnswer6(thisQuestion['Answer 6']);
    }
  }, [thisQuestion]);

  useEffect(() => {
    fetchQuestions();
    const handleStorageChange = (e) => {
      if (e.key === 'currentQuestionNo') {
        setQuestionNo(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  useEffect(() => {
    if (questionNo >= 0) {
      setTimer(timeLimit);
    }
  }, [questionNo, timeLimit]);

  useEffect(() => {
    fetchStatus();
    let interval;
    if (timer > 0 && questionNo >= 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, questionNo]);

  useEffect(() => {
    showData();
  }, [status]);

  useEffect(() => {
    setSelectedAnswers([]);
  }, [questionNo]);

  async function fetchQuestions () { // Obtain question content
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setQuestions(data.results.questions);
  }

  async function fetchStatus () {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setStatus(data.results.active);
  }

  async function collectPlayerAnswers () { // Obtain player content
    const response = await fetch(`http://localhost:5005/play/${playerId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const responseData = await response.json();
    return responseData;
  }

  async function collectCorrectAnswers () { // Obtain correct answer content
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        sessionid: `${sessionId}`,
      },
    });
    const responseData = await response.json();
    return responseData.results.questions;
  }

  function compareAnswers (playerAnswers, correctAnswers) { // Compare the player's answer to the correct answer
    const playerResult = {
      answers: [],
      points: 0,
    };
    playerAnswers.forEach((playerAnswer, questionIndex) => {
      const question = correctAnswers[questionIndex];
      const isCorrect = playerAnswer
        ? question.Correctanswer.sort().join(',') === playerAnswer.answerIds.sort().join(',')
        : false;

      if (isCorrect) {
        playerResult.points += question.Points;
      }

      playerResult.answers.push({
        answer: playerAnswer ? playerAnswer.answerIds.join(', ') : '',
        isCorrect,
      });
    });
    return playerResult;
  }

  function generateTable (playerResult, correctAnswers) { // Create table to show player results in the page
    const columns = [
      {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
      },
      {
        title: 'Your Answer',
        dataIndex: 'playerAnswer',
        key: 'playerAnswer',
        render: (answerData) => `${answerData.answer} `,
      },
      {
        title: 'Correct Answer',
        dataIndex: 'correctAnswer',
        key: 'correctAnswer',
      },
      {
        title: 'Y/N',
        dataIndex: 'playerAnswer',
        key: 'playerAnswer',
        render: (answerData, record) =>
          record.key !== 'points'
            ? (answerData.isCorrect ? 'Y' : 'N')
            : '',
      },
      {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
      },
    ];

    const dataSource = correctAnswers.map((question, index) => { // Generate table
      const row = {
        key: question.id,
        question: question.question,
        correctAnswer: question.Correctanswer.join(', '),
        points: question.Points,
        playerAnswer: playerResult.answers[index],
      };
      return row;
    });

    setColumns(columns);
    setDataSource(dataSource);
  }

  async function showData () { // Generate table
    const playerAnswers = await collectPlayerAnswers();
    const correctAnswers = await collectCorrectAnswers();
    const playerResults = compareAnswers(playerAnswers, Object.values(correctAnswers));
    generateTable(playerResults, Object.values(correctAnswers));
  }

  async function onChange (checkedValues) { // Monitor changes in the multiple selector
    console.log('answer', checkedValues);
    setSelectedAnswers(checkedValues);
    await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds: checkedValues,
      }),
    });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
      {(status === false)
        ? (
            <>
              <Table columns={columns} dataSource={dataSource} />
            </>
          )
        : (
      <Card
        title='Answer the question'
        bordered={false}
        style={{
          width: 600,
          border: '1px solid'
        }}
      >
        <p>Type: {type}</p>
        <p>Time Remaining: {timer}</p>
        <p>Points: {point}</p>
        <p>Question: {content}</p>
        {timer === 0 && <p>Correct answer: {correctanswer}</p>}
        <Checkbox.Group
          value={selectedAnswers}
          onChange={onChange}
          disabled={timer === 0}
        >
        <Row>
          <Col span={8}>
            <Checkbox value="Answer 1">{answer1}</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Answer 2">{answer2}</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Answer 3">{answer3}</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Answer 4">{answer4}</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Answer 5">{answer5}</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Answer 6">{answer6}</Checkbox>
          </Col>
        </Row>
        </Checkbox.Group>
      </Card>
          )}
    </div>
  );
}

export default PlayerInterface;
