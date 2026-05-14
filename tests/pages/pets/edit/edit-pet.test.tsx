import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditPetPage from '@/pages/pets/edit/[id]';

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

describe('EditPetPage', () => {
  const mockPush = jest.fn();
  const mockUseSession = require('next-auth/react').useSession;
  const mockUseRouter = require('next/router').useRouter;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      query: { id: 'pet-123' },
    });
  });

  it('renders loading state when status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<EditPetPage />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('redirects to signin when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<EditPetPage />);

    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('renders edit form when authenticated and data loaded', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    // Mock fetch for getting pet details
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({
        id: 'pet-123',
        name: 'Buddy',
        species: '狗',
        breed: 'Labrador',
      }),
    });

    render(<EditPetPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
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

    render(<EditPetPage />);

    await waitFor(() => {
      expect(screen.getByText('宠物不存在或无权限')).toBeInTheDocument();
    });
  });

  it('submits form successfully', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

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
        ok: true,
        json: () => Promise.resolve({}),
      });

    render(<EditPetPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('保存修改');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/pets', expect.objectContaining({
        method: 'PUT',
      }));
    });
  });
});
