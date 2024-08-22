import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginComponent from '../../components/signIn.jsx';

describe('LoginComponent', () => {// 测试login 页面是否 包含 title email  password  和 sign in组件  输入不存在的账号 测试是否能弹出请输入正确的id的弹窗
  test('renders the component', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginComponent />
      </MemoryRouter>
    );
    const titelComponent = screen.getByText('Sign in', { selector: 'h1' });
    expect(titelComponent).toBeInTheDocument();

    const emailComponent = screen.getByText('Email:');
    const passwordComponent = screen.getByText('Password:');
    expect(emailComponent).toBeInTheDocument();
    expect(passwordComponent).toBeInTheDocument();
    
    const buttonComponent = screen.getByText('Sign in', { selector: 'span' });
    expect(buttonComponent).toBeInTheDocument();

    const emailInput = screen.getByTestId('signinInputEmail');
    const passwordInput = screen.getByTestId('signinInputPassword');
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    const loginButton = screen.getByTestId('signinButton');
    fireEvent.click(loginButton);
    const reportError=await screen.findByText('Please input vaild username and password')  
    expect(reportError).toBeInTheDocument();
  });
});