import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from '@jest/globals';
import { Status } from './Status';
import React from 'react';
const mockProps = {
  label: 'Test Status',
  isActive: false,
  onClick: jest.fn(),
};

describe('component icon status', () => {
  test('should Status label text when render', () => {
    render(<Status {...mockProps} />);
    const statusElement = screen.getByTestId('status');
    expect(statusElement.textContent).toBe('Test Status');
  });
  test('should have been call when click on element ', () => {
    render(<Status {...mockProps} />);
    const statusElement = screen.getByTestId('status');
    fireEvent.click(statusElement);
    expect(mockProps.onClick).toHaveBeenCalled();
  });
  test('should text color be gray 500 when render ', () => {
    render(<Status {...mockProps} />);
    const statusElements = screen.getByTestId('status');
    expect(statusElements.className).toContain('text-gray-500');
  });

  test('should text color be blue 500 when render ', () => {
    const updateMockProps = { ...mockProps, isActive: true };
    render(<Status {...updateMockProps} />);
    const statusElements = screen.getByTestId('status');
    expect(statusElements.className).toContain('text-blue-500');
  });
});
