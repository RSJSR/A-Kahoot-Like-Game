// modifyQuestion
// main function for Question
// collect imformation to update
// fetch data of this game, replace question body by given question id, pass renewed game to backend, then navigate to game page
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, message } from 'antd';
import './edit-question.css'
import { useNavigate, useParams } from 'react-router-dom';

function ModifyQuestion () {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [questions, setQuestions] = useState({});
  const [thisQuestion, setThisQuestion] = useState('');
  const { gameName, questionId } = useParams();
  const [form] = Form.useForm();
  const [data, setData] = React.useState([]);
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
    setQuestions(responseData.questions || {});
    setThisQuestion(responseData.questions[questionId]);
  }

  useEffect(() => {
    async function fetchData () {
      await fetchQuiz();
    }
    fetchData();
  }, []);

  const updateDataQuiz = async (updatedQuestion) => { // Update question
    await fetch(`http://localhost:5005/admin/quiz/${gameName}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        quizid: `${gameName}`,
      },
      body: JSON.stringify({
        questions: {
          ...questions,
          [questionId]: updatedQuestion,
        },
        name: data.name,
        thumbnail: data.thumbnail,
      }),
    });
  }
  const updateQuizAndFetch = async (updatedQuestion) => {
    await updateDataQuiz(updatedQuestion);
    await fetchQuiz();
  }
  const onFinish = async (values) => { // Set a reasonable point and countdown
    if (/^([1-9]|[1-9]\d|100)$/.test(values.Points) !== true) {
      message.error('Please input Correct Points <=100');
      return;
    }
    if (/^(?:\d|[1-9]\d|1[01]\d|120)$/.test(values.TimeLimit) !== true) {
      message.error('Please input Correct TimeLimit <=120 seconds');
      return;
    }
    const updatedQuestion = {
      questionType: values.questionType,
      question: values.question,
      Correctanswer: values.Correctanswer,
      'Answer 1': values['Answer 1'],
      'Answer 2': values['Answer 2'],
      'Answer 3': values['Answer 3'],
      'Answer 4': values['Answer 4'],
      'Answer 5': values['Answer 5'],
      'Answer 6': values['Answer 6'],
      Points: values.Points,
      TimeLimit: values.TimeLimit,
    };
    await updateQuizAndFetch(updatedQuestion);
    navigate(`/editgame/${gameName}`);
  };

  const { TextArea } = Input;
  useEffect(() => {
    if (thisQuestion) {
      form.setFieldsValue({
        questionType: thisQuestion.questionType,
        question: thisQuestion.question,
        'Answer 1': thisQuestion['Answer 1'],
        'Answer 2': thisQuestion['Answer 2'],
        'Answer 3': thisQuestion['Answer 3'],
        'Answer 4': thisQuestion['Answer 4'],
        'Answer 5': thisQuestion['Answer 5'],
        'Answer 6': thisQuestion['Answer 6'],
        Correctanswer: thisQuestion.Correctanswer,
        Points: thisQuestion.Points,
        TimeLimit: thisQuestion.TimeLimit,
      });
    }
  }, [thisQuestion, form]);
  // Set check box have 6 options
  const options = [];
  for (let i = 1; i < 7; i++) {
    const value = `Answer ${i}`;
    options.push({
      label: value,
      value,
      disabled: i === 10,
    });
  }
  // Upload picture
  const [image, setImage] = useState(null);
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
  return (
    <div className="edit-question-container">
      <h1>Edit Question</h1><br ></br>
      <div>
        <h3>Game: {gameName}</h3>
        <h4>Question: {questionId}</h4><br ></br>
      </div>
      <Form form={form} onFinish={onFinish} >
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
            label="Answer 2"
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
            name="Answer 5 Optional"
            style={{ marginBottom: '8px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Answer 6 (Optional)"
            name="Answer 6 Optional"
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
          <Form.Item>
          <div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <div>
                <img src={image.imageUrl} alt={image.file.name} style={{ maxWidth: '100%' }} />
                <div>{image.file.name}</div>
              </div>
            )}
          </div>
          </Form.Item>
        <Form.Item style={{ marginBottom: '8px' }}>
          <Button key="BackPage" style={{ marginRight: '10px' }} onClick={() => {
            navigate(`/editgame/${gameName}`);
          }}>
            Back Game Page
          </Button>
          <Button key="Cancel" onClick={() => {
            form.resetFields();
            navigate(`/editgame/${gameName}`);
          }} style={{ marginRight: '230px' }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ModifyQuestion;
