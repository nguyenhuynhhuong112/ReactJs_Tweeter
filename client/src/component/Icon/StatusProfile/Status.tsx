import React from 'react';

interface StatusProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Status: React.FC<StatusProps> = ({ label, isActive, onClick }) => {
  const checkActive = `${isActive ? 'text-blue-500' : 'text-gray-500'}`;
  return (
    <div data-testid="status" className={`cursor-pointer py-2 px-4 ${checkActive}`} onClick={onClick}>
      {label}
    </div>
  );
};
