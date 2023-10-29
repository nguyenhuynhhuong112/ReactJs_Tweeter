import { fireEvent, render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';
import React from 'react';
jest.mock('./Status', () => {
  return {
    Status: ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => {
      return (
        <div data-testid={`status-${label}`} onClick={onClick} className={isActive ? 'text-blue-500' : 'text-gray-500'}>
          {label}
        </div>
      );
    },
  };
});
describe('component icon status bar', () => {
  test('should status bar when render', () => {
    render(<StatusBar />);
    const statusElement = screen.getByTestId('statusBar');
    expect(statusElement).toBeDefined();
  });
  test('should change activeTab when click', () => {
    render(<StatusBar />);
    const statusElement = screen.getByTestId('status-Post');
    fireEvent.click(statusElement);
    expect(statusElement.className).toContain('text-blue-500');
  });
});
