import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamepageComponent from '../../components/modifyQuestion.jsx';

global.matchMedia=global.matchMedia||function(){
    return{
        matches:false,
        addListener:function(){},
        removeListener:function(){}
    }
}
describe('modifyQuestionComponent', () => {
  // 测试 editquestion 组件 所有必须填写的组件是否正确出现在页面中 
 
  test('renders the component', async () => {
      render(
        <MemoryRouter initialEntries={['/modifyQuestion']}>
          <GamepageComponent />
        </MemoryRouter>
      )
      const titleComponent = screen.getByText('Edit Question', { selector: 'h1' });
      expect(titleComponent).toBeInTheDocument();
      const gameComponent = screen.getByText('Game:', { selector: 'h3' });
      expect(gameComponent).toBeInTheDocument();
      const questionComponent = screen.getByText('Question:', { selector: 'h4' });
      expect(questionComponent).toBeInTheDocument();
      const questiontypeComponent = screen.getByText('Question Type', { selector: 'label' });
      expect(questiontypeComponent).toBeInTheDocument();
      const answer1Component = screen.getByText('Answer 1', { selector: 'label' }); 
      expect( answer1Component).toBeInTheDocument();
      const answer2Component = screen.getByText('Answer 2', { selector: 'label' });
      expect( answer2Component).toBeInTheDocument();
      const SinglechoiceComponent = screen.getByText('Single choice', { selector: 'span' });
      expect(SinglechoiceComponent).toBeInTheDocument();
      const  MultiplechoiceComponent = screen.getByText('Multiple choice', { selector: 'span' });
      expect(MultiplechoiceComponent).toBeInTheDocument();

  });
  
});
