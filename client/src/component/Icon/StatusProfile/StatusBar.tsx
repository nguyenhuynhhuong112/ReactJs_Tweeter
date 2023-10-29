import React, { useState } from 'react';
import './StatusBar.scss';
import { StatusEnum } from './Status.config';
import { Status } from './Status';
export const StatusBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState(StatusEnum.Post);

  const handleTabClick = (tab: StatusEnum) => {
    setActiveTab(tab);
  };
  return (
    <div data-testid="statusBar" className="status-tabs mt-4">
      {Object.values(StatusEnum).map((status) => (
        <Status key={status} label={status} isActive={activeTab === status} onClick={() => handleTabClick(status)} />
      ))}
    </div>
  );
};
