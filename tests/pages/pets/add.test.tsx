import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPetPage from '@/pages/pets/add';

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

describe('AddPetPage', () => {
  const mockPush = jest.fn();
  const mockUseSession = require('next-auth/react').useSession;

  beforeEach(() => {
    jest.clearAllMocks();

    (require('next/router').useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders loading state when status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<AddPetPage />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('redirects to signin when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<AddPetPage />);

    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('renders add form when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    render(<AddPetPage />);

    expect(screen.getByText('添加宠物')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入宠物的名字')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
    });

    render(<AddPetPage />);

    const nameInput = screen.getByPlaceholderText('请输入宠物的名字');
    fireEvent.change(nameInput, { target: { value: 'Buddy', name: 'name' } });

    const submitButton = screen.getByText('添加宠物');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/pets', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('displays error when form submission fails', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });

    (global as any).fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '添加失败' }),
    });

    render(<AddPetPage />);

    const nameInput = screen.getByPlaceholderText('请输入宠物的名字');
    fireEvent.change(nameInput, { target: { value: 'Buddy', name: 'name' } });

    const submitButton = screen.getByText('添加宠物');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('添加失败')).toBeInTheDocument();
    });
  });
});
