import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />);
  });

  it('renders the main heading', () => {
    const heading = screen.getByText(/每一次摇尾/);
    expect(heading).toBeInTheDocument();
  });

  it('renders the brand title with orange color', () => {
    const title = screen.getByText(/皆是礼赞/);
    expect(title).toBeInTheDocument();
  });

  it('renders the brand description', () => {
    const description = screen.getByText(/TailWag.*专为追求生活艺术的少数派而生/);
    expect(description).toBeInTheDocument();
  });

  it('renders the explore button with correct link', () => {
    const exploreButton = screen.getByRole('link', { name: /立即探索甄选/i });
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveAttribute('href', '#products');
  });

  it('renders the selection process button with correct link', () => {
    const processButton = screen.getByRole('link', { name: /选品哲学/i });
    expect(processButton).toBeInTheDocument();
    expect(processButton).toHaveAttribute('href', '/selection-process');
  });

  it('renders the Summer Selection badge', () => {
    const badge = screen.getByText(/Summer Selection 2026/);
    expect(badge).toBeInTheDocument();
  });

  it('renders the featured product info', () => {
    const productName = screen.getByText(/极地冻干系列/);
    expect(productName).toBeInTheDocument();
  });

  it('renders the product image', () => {
    const image = screen.getByAltText(/Premium pet products curation/);
    expect(image).toBeInTheDocument();
  });
});
