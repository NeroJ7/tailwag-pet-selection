import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MobileNav from '@/components/MobileNav';
import { getCart } from '@/utils/cart-util';

// Mock cart-util
jest.mock('@/utils/cart-util', () => ({
  getCart: jest.fn(),
}));

describe('MobileNav Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation links', () => {
    getCart.mockReturnValue([]);
    render(<MobileNav />);

    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('订单')).toBeInTheDocument();
    expect(screen.getByText('清单')).toBeInTheDocument();
    expect(screen.getByText('看板')).toBeInTheDocument();
  });

  it('renders correct links for each nav item', () => {
    getCart.mockReturnValue([]);
    render(<MobileNav />);

    expect(screen.getByRole('link', { name: /首页/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /订单/ })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /清单/ })).toHaveAttribute('href', '/cart');
    expect(screen.getByRole('link', { name: /看板/ })).toHaveAttribute('href', '/dashboard');
  });

  it('displays cart count when cart has items', () => {
    getCart.mockReturnValue([
      { id: 1, quantity: 3 },
      { id: 2, quantity: 2 },
    ]);
    render(<MobileNav />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not display cart badge when cart is empty', () => {
    getCart.mockReturnValue([]);
    render(<MobileNav />);

    const badge = document.querySelector('span[class*="bg-brand-orange"]');
    expect(badge).not.toBeInTheDocument();
  });

  it('updates cart count on cart-updated event', async () => {
    getCart.mockReturnValue([]);
    render(<MobileNav />);

    getCart.mockReturnValue([{ id: 1, quantity: 1 }]);
    await act(async () => {
      window.dispatchEvent(new Event('cart-updated'));
    });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('removes event listener on unmount', () => {
    getCart.mockReturnValue([]);
    const { unmount } = render(<MobileNav />);

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'cart-updated',
      expect.any(Function)
    );
  });

  it('has proper styling classes', () => {
    getCart.mockReturnValue([]);
    render(<MobileNav />);

    const nav = document.querySelector('.fixed.bottom-0');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('md:hidden');
  });
});
