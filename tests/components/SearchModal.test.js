import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchModal from '@/components/SearchModal';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe('SearchModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // 清除所有定时器
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render when isOpen is false', () => {
    render(<SearchModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByPlaceholderText(/搜索优选好物/)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText(/搜索优选好物/)).toBeInTheDocument();
  });

  it('calls onClose when ESC key is pressed', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByText('ESC');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays hot tags when search query is empty', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('热门搜索')).toBeInTheDocument();
  });

  it('renders search input with correct placeholder', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/搜索优选好物/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', '搜索优选好物（如：智能猫砂盆、冻干）…');
  });

  it('filters products based on search query', async () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/搜索优选好物/);

    fireEvent.change(input, { target: { value: '饮水' } });

    await waitFor(() => {
      expect(screen.getByText(/饮水/)).toBeInTheDocument();
    });
  });

  it('displays result count when searching', async () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/搜索优选好物/);

    fireEvent.change(input, { target: { value: '智能' } });

    await waitFor(() => {
      const resultText = screen.getByText(/搜索结果/);
      expect(resultText).toBeInTheDocument();
    });
  });

  it('displays no results message when no matches found', async () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/搜索优选好物/);

    fireEvent.change(input, { target: { value: 'xyznonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('暂无相关甄选作品')).toBeInTheDocument();
    });
  });

  it('closes modal when overlay is clicked', () => {
    render(<SearchModal isOpen={true} onClose={mockOnClose} />);
    // 选择 overlay div (绝对定位、覆盖整个屏幕)
    const overlay = document.querySelector('.absolute.inset-0');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
