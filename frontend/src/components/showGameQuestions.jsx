import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Modal, Button, Form, Input, Radio, Select, Divider, Row, Col, message } from 'antd';
import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function ShowGameQuestions () {
  const [questions, setQuestions] = useState({});
  const [data, setData] = React.useState([]);
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { TextArea } = Input;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { gameName } = useParams();
  const [form] = Form.useForm();
  const options = [];
  const [image, setImage] = useState(null);
  async function fetchQuiz () { // fetch data for this game
    const response = await fetch(`http://localhost:5005/admin/quiz/${gameName}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        quizid: `${gameName}`,
      },
    });
    const responseData = await response.json();
    setData(responseData);
    setQuestions(responseData.questions || []);
  }

  React.useEffect(async () => {
    await fetchQuiz();
  }, []);

  for (let i = 1; i < 7; i++) {
    const value = `Answer ${i}`;
    options.push({
      label: value,
      value,
      disabled: i === 10,
    });
  }
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({
        file,
        imageUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  async function createNewGame () {
    setShowForm(true);
  }
  async function updateDataQuiz (existingQuestions, newQuiz = null) { // upload questions to data base
    const updatedQuestions = newQuiz
      ? { ...existingQuestions, ...newQuiz }
      : existingQuestions;
    await fetch(`http://localhost:5005/admin/quiz/${gameName}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        quizid: `${gameName}`,
      },
      body: JSON.stringify({
        questions: updatedQuestions,
        name: data.name,
        thumbnail: data.thumbnail,
      }),
    });
  }
  async function submitNewGame () {
    const values = await form.validateFields(); // Set a reasonable point and countdown
    if (/^([1-9]|[1-9]\d|100)$/.test(values.Points) !== true) {
      message.error('Please input Correct Points <=100');
      return;
    }
    if (/^(?:\d|[1-9]\d|1[01]\d|120)$/.test(values.TimeLimit) !== true) {
      message.error('Please input Correct TimeLimit <=120 seconds');
      return;
    }
    const newQuiz = {
      questionType: values.questionType,
      question: values.question,
      Correctanswer: values.Correctanswer,
      Points: values.Points,
      TimeLimit: values.TimeLimit,
      'Answer 1': values['Answer 1'],
      'Answer 2': values['Answer 2'],
      'Answer 3': values['Answer 3'],
      'Answer 4': values['Answer 4'],
      'Answer 5': values['Answer 5'],
      'Answer 6': values['Answer 6'],
    };
    setShowForm(false);

    async function updateQuizAndFetch (newQuiz) { // Update data.quiz
      await updateDataQuiz(questions, { [values.id]: newQuiz });
      await fetchQuiz();
    }
    await updateQuizAndFetch(newQuiz);
    console.log('done');
  }
  async function deleteQuestion (questionId) { // Delete the question
    const updatedQuestions = {};
    for (const key in questions) {
      if (key !== questionId) {
        updatedQuestions[key] = questions[key];
      }
    }
    await updateDataQuiz(updatedQuestions);
    await fetchQuiz();
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: 'Dashboard',
              onClick: () => navigate('/Dashboard')
            },
            {
              key: '2',
              label: 'Create new Question',
              onClick: createNewGame
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.Header}>
          {React.createElement(
            collapsed
              ? MenuUnfoldOutlined
              : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
        </Header>
        <Content className={styles.Contend}>
         <Modal
          title="Create new question"
          open={showForm}
          onCancel={() => setShowForm(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowForm(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={submitNewGame}>
              Submit
            </Button>,
          ]}
          bodyStyle={{ padding: '2px' }}
        >
          <Form form={form} layout="vertical" >
          <Form.Item
            label="Question ID"
            name="id"
            rules={[{ required: true, message: 'Please enter the question ID' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Question Type" rules={[{ required: true }]} name="questionType" style={{ marginBottom: '8px' }}>{/* type */}
          <Radio.Group>
            <Radio value="Multiple choice"> Multiple choice </Radio>
            <Radio value="Single choice"> Single choice </Radio>
          </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Please enter the question' }]}
            style={{ marginBottom: '8px' }}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            label="Answer 1"
            name="Answer 1"
            rules={[{ required: true }]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 2 "
            name="Answer 2"
            rules={[{ required: true }]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 3 (Optional)"
            name="Answer 3"
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 4 (Optional)"
            name="Answer 4"
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 5 (Optional)"
            name="Answer 5"
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 6 (Optional)"
            name="Answer 6"
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Select" name="Correctanswer" rules={[{ required: true }]} style={{ marginBottom: '10px' }}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            options={options}
          />
          </Form.Item>
          <Form.Item
            label="Points"
            name="Points"
            rules={[{ required: true }]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="TimeLimit"
            name="TimeLimit"
            rules={[{ required: true }]}
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <div>
                <img src={image.imageUrl} alt={image.file.name} style={{ maxWidth: '100%' }} />
                <div>{image.file.name}</div>
              </div>
            )}
          </div>
        </Form>
        </Modal>
        {Object.entries(questions).map(([questionId, q]) => (
          <>
            <nav key={questionId}>
            <Divider orientation="left">Question id: {questionId}</Divider>
              <Row>
                <Col span={8} offset={4}>
                  <Button onClick={() => navigate(`/editgame/${gameName}/${questionId}`)}>
                    Edit this question
                  </Button>
                </Col>
                <Col span={8}>
                  <Button danger onClick={() => deleteQuestion(questionId)}>
                    Delete this question
                  </Button>
                </Col>
              </Row>
            </nav>
          </>
        ))}
        </Content>
      </Layout>
    </Layout>
  );
}

export default ShowGameQuestions;
