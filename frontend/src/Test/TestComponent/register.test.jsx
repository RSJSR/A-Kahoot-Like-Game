import React from 'react';
import { render, screen, fireEvent }  from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RisgterComponent from '../../components/signUp.jsx';

describe('RisgterComponent', () => {
  // 测试register 页面是否 包含sign up title email  password name  和 sign up组件
  // 输入错误格式的email形式将会出现错误弹窗Please input vaild emaill adress
  test('renders the component', async () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <RisgterComponent />
      </MemoryRouter>
    );
    const titelComponent = screen.getByText('Sign up', { selector: 'h1' });
    expect(titelComponent).toBeInTheDocument();

    const emailComponent = screen.getByText('Email:');
    const passwordComponent = screen.getByText('Password:');
    const nameComponent = screen.getByText('Password:');
    
    expect(emailComponent).toBeInTheDocument();
    expect(passwordComponent).toBeInTheDocument();
    expect(nameComponent).toBeInTheDocument();
    
    const buttonComponent = screen.getByText('Sign up', { selector: 'span' });
    expect(buttonComponent).toBeInTheDocument();

    const emailInput = screen.getByTestId('signupInputEmail');
    const passwordInput = screen.getByTestId('signupInputPassword');
    const nameInput = screen.getAllByTestId('signupInputName')

    fireEvent.change(emailInput, { target: { value: 'test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    const signupButton = screen.getByTestId('signupButton');
    fireEvent.click(signupButton);
    const reportError=await screen.findByText('Please input vaild emaill adress')  
    expect(reportError).toBeInTheDocument();  
  });
});