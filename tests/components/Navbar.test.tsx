// tests/components/Navbar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock cart-util
jest.mock('../../utils/cart-util', () => ({
  getCart: jest.fn(() => []),
}));

// Mock SearchModal
jest.mock('../../components/SearchModal', () => {
  return function MockSearchModal({ isOpen, onClose }: any) {
    return isOpen ? <div data-testid="search-modal">Search Modal</div> : null;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.addEventListener and removeEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  it('should render logo and brand name', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Navbar />);
    
    expect(screen.getByText('TailWag')).toBeInTheDocument();
    expect(screen.getByText('Selection')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Navbar />);
    
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('选品标准')).toBeInTheDocument();
    expect(screen.getByText('我的订单')).toBeInTheDocument();
  });

  it('should show login button when not logged in', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Navbar />);
    
    expect(screen.getByText('Member Center')).toBeInTheDocument();
  });

  it('should show user info and logout button when logged in', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({
      data: {
        user: { name: 'Test User', email: 'test@example.com' },
      },
    });

    render(<Navbar />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
  });

  it('should open search modal when search button is clicked', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Navbar />);
    
    // Get all buttons and find the search button (first button)
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons[0]; // First button is the search button
    fireEvent.click(searchButton);
    
    // Search modal should be opened (isOpen state should be true)
    expect(screen.getByText('Search Modal')).toBeInTheDocument();
  });

  it('should toggle mobile menu when mobile menu button is clicked', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<Navbar />);
    
    // Get all buttons - last button is mobile menu button
    const buttons = screen.getAllByRole('button');
    const mobileMenuButton = buttons[buttons.length - 1]; // Last button
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should be visible
    expect(screen.getByText('登录 / 注册')).toBeInTheDocument();
  });

  it('should call signOut when logout button is clicked', () => {
    const { useSession } = require('next-auth/react');
    const { signOut } = require('next-auth/react');
    
    useSession.mockReturnValue({
      data: {
        user: { name: 'Test User', email: 'test@example.com' },
      },
    });

    render(<Navbar />);
    
    const logoutButton = screen.getByText('退出');
    fireEvent.click(logoutButton);
    
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('should display cart count when cart has items', () => {
    const { useSession } = require('next-auth/react');
    const { getCart } = require('../../utils/cart-util');
    
    useSession.mockReturnValue({ data: null });
    getCart.mockReturnValue([
      { id: '1', quantity: 3 },
      { id: '2', quantity: 2 },
    ]);

    render(<Navbar />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
