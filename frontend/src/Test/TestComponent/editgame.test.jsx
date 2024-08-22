import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditgameComponent from '../../components/showGameQuestions.jsx';
import { act } from 'react-dom/test-utils';

describe('showGameQuestionsComponent', () => {// 测试dashboard 页面是否 包含 addnewgame button 在初始页面 空白页面
    console.error = () => {};//禁用掉了警告
    test('renders the component', () => {
    act(() => {
      render(
        <MemoryRouter initialEntries={['/showGameQuestions']}>
          <EditgameComponent />
        </MemoryRouter>
      );
    });
    act(() => {
      const dashboardComponent = screen.getByText('Dashboard', { selector: 'span' });
      expect(dashboardComponent).toBeInTheDocument();
      const newgameComponent = screen.getByText('Create new Question', { selector: 'span' });
      expect(newgameComponent).toBeInTheDocument();
    });
  });
});
