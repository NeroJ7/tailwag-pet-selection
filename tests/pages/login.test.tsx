// tests/pages/login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../pages/login';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock Navbar component
jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login page', () => {
    render(<LoginPage />);
    
    // Check for elements that should definitely exist
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /立即登录/i })).toBeInTheDocument();
  });

  it('should show login tab by default', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('should switch to register tab', () => {
    render(<LoginPage />);
    
    const registerTab = screen.getByText('注册新账号');
    fireEvent.click(registerTab);
    
    expect(screen.getByPlaceholderText('您的称呼')).toBeInTheDocument();
  });

  it('should show validation errors for empty login fields', async () => {
    render(<LoginPage />);
    
    const loginButton = screen.getByRole('button', { name: /立即登录/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入邮箱')).toBeInTheDocument();
      expect(screen.getByText('请输入密码')).toBeInTheDocument();
    });
  });

  it.skip('should validate email format', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    
    const loginButton = screen.getByRole('button', { name: /立即登录/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱格式')).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    const loginButton = screen.getByRole('button', { name: /立即登录/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('密码不少于6位')).toBeInTheDocument();
    });
  });

  it('should handle login submission', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockResolvedValue({ error: null });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const loginButton = screen.getByRole('button', { name: /立即登录/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show error on login failure', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockResolvedValue({ error: 'CredentialsSignin' });
    
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    const loginButton = screen.getByRole('button', { name: /立即登录/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('邮箱或密码错误')).toBeInTheDocument();
    });
  });

  it('should render Navbar component', () => {
    render(<LoginPage />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
