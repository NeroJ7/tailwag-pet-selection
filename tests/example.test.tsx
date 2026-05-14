// tests/example.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple component for testing
const ExampleComponent = () => {
  return (
    <div>
      <h1>Hello, TailWag!</h1>
      <p>Test is working!</p>
    </div>
  );
};

describe('Example Test Suite', () => {
  it('should render example component', () => {
    render(<ExampleComponent />);
    
    expect(screen.getByText('Hello, TailWag!')).toBeInTheDocument();
    expect(screen.getByText('Test is working!')).toBeInTheDocument();
  });

  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2);
  });
});
