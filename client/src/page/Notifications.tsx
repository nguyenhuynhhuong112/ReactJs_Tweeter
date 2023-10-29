import React from 'react';
import Header from '../layout/Header/Header';
import { ListNotification } from '../component';

export const Notifications: React.FC = () => {
  return (
    <div className="">
      <Header name="notifications" />
      <ListNotification />
    </div>
  );
};
