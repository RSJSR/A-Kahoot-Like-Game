import { Layout, Menu, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

function SessionResult () {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { Content } = Layout;
  const navigate = useNavigate();
  const url = window.location.href;
  const parts = url.split('/');
  const sessionId = parts[parts.length - 1];
  const token = localStorage.getItem('token');
  async function collectPlayerAnswers () { // obtain player answer
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        sessionid: `${sessionId}`,
      },
    });
    const responseData = await response.json();
    return responseData.results;
  }
  async function collectCorrectAnswers () { // obtain correct answer
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
  function compareAnswers (playerAnswers, correctAnswers) {
    // Compare the player's answer to the correct answer
    return playerAnswers.map((player) => {
      const playerResult = {
        name: player.name,
        answers: [],
        points: 0,
      };
      correctAnswers.forEach((question, questionIndex) => {
        const playerAnswer = player.answers[questionIndex];
        const isCorrect = playerAnswer
          ? question.Correctanswer.sort().join(',') === playerAnswer.answerIds.sort().join(',')
          : false;
        if (isCorrect) {
          playerResult.points += parseInt(question.Points); // Add parseInt() to convert the string to an integer
        }
        playerResult.answers.push({
          answer: playerAnswer ? playerAnswer.answerIds.join(', ') : '',
          isCorrect,
        });
      });
      console.log('playerResult', playerResult);
      return playerResult;
    });
  }
  function generateTable (playerResults) {
    // Sort playerResults by points in descending order and get the top 5 players
    const topPlayers = playerResults
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
    const columns = [
      {
        title: 'Player',
        dataIndex: 'player',
        key: 'player',
      },
      {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
      },
    ];
    const dataSource = topPlayers.map((player, index) => {
      return {
        key: index,
        player: player.name,
        points: player.points,
      };
    });
    setColumns(columns);
    setDataSource(dataSource);
  }

  async function showData () {
    const playerAnswers = await collectPlayerAnswers();
    const correctAnswers = await collectCorrectAnswers();
    const playerResults = compareAnswers(playerAnswers, Object.values(correctAnswers));
    generateTable(playerResults);
  }

  useEffect(() => {
    showData();
  }, []);
  return (
        <Layout>
        <>
            <div className="logo" />
            <Menu
            items={[
              {
                key: '1',
                label: 'Dashboard',
                onClick: () => navigate('/Dashboard')
              }
            ]}
            />
        </>
        <Layout className="site-layout">
            <Content className={styles.Contend}>
              <Table columns={columns} dataSource={dataSource} />
            </Content>
        </Layout>
        </Layout>

  );
}
export default SessionResult;
