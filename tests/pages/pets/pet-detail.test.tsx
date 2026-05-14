import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PetDetailPage from '@/pages/pets/[id]';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Navbar
jest.mock('@/components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('PetDetailPage', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  const mockUseSession = require('next-auth/react').useSession;

  beforeEach(() => {
    jest.clearAllMocks();

    (require('next/router').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { id: 'pet-123' },
      back: mockBack,
    });
  });

  it('renders loading state when status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<PetDetailPage />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('redirects to signin when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<PetDetailPage />);

    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('renders pet details when authenticated', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    // Mock fetch for pet details, health records, preferences
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({
          id: 'pet-123',
          name: 'Buddy',
          species: '狗',
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      });

    render(<PetDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });
  });

  it('displays error when pet fetch fails', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      status: 404,
      json: () => Promise.resolve({}),
    });

    render(<PetDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('宠物不存在或无权限')).toBeInTheDocument();
    });
  });
});
