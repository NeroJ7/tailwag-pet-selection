// tests/pages/index.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../pages/index';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
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

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the homepage', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    // Check for elements that definitely exist
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it.skip('should show login prompt when not logged in', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    // Use regex for flexible matching
    expect(screen.getByText(/TailWag/i)).toBeInTheDocument();
  });

  it('should show welcome message when logged in', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({
      data: {
        user: { name: 'Test User', email: 'test@example.com' },
      },
    });

    render(<HomePage />);
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it('should display features section', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    // Check for feature section by role
    const featureHeadings = screen.getAllByText('宠物档案');
    expect(featureHeadings.length).toBeGreaterThan(0);
  });

  it('should display stats section', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    // Check for stats
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should render Navbar component', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('should have links to key pages', () => {
    const { useSession } = require('next-auth/react');
    useSession.mockReturnValue({ data: null });

    render(<HomePage />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
