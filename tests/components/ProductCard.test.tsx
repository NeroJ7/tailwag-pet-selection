// tests/components/ProductCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Premium Dog Food',
    brand: 'Brand A',
    price: 99.99,
    tag: '热销',
    images: ['https://example.com/image.jpg'],
    selectionReason: '精选优质原料，营养均衡',
  };

  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    expect(screen.getByText('Brand A')).toBeInTheDocument();
    expect(screen.getByText('热销')).toBeInTheDocument();
    expect(screen.getByText(/精选优质原料/)).toBeInTheDocument();
  });

  it('should render product image with correct src', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Premium Dog Food');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should link to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/detail?id=prod-1');
  });

  it('should display price in button', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/¥99.99/)).toBeInTheDocument();
  });

  it('should render "View Details" text', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/View Details/)).toBeInTheDocument();
  });

  it('should render verification badge', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Curation / Verified')).toBeInTheDocument();
  });

  it('should handle product without tag', () => {
    const productWithoutTag = { ...mockProduct, tag: undefined };
    render(<ProductCard product={productWithoutTag} />);
    
    expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
  });

  it('should handle product with multiple images', () => {
    const productWithMultipleImages = {
      ...mockProduct,
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
    };
    
    render(<ProductCard product={productWithMultipleImages} />);
    
    const image = screen.getByAltText('Premium Dog Food');
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });
});
