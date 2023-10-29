import React from 'react';

interface Tittle {
  name: string;
}

const Header: React.FC<Tittle> = ({ name }) => {
  return (
    <div className="flex justify-between items-center bg-white py-4">
      <div className="text-xl font-bold text-primary capitalize">{name}</div>
    </div>
  );
};

export default Header;
