import React, { useEffect } from 'react';

import './App.css';
import Layout from './layout/Layout';
import { io } from 'socket.io-client';
import { ConfigProvider } from 'antd';
const App: React.FC = () => {
  useEffect(() => {
    const socket = io('http://localhost:8080', {
      autoConnect: false,
    });
    socket.on('connect', () => {
      console.log('Connected to socket server.');
      socket.emit('userConnected', 'User connected to the server.');
    });
    socket.on('serverMessage', (message) => {
      console.log('Message from server:', message);
    });
    socket.connect();
  }, []);

  return (
    <div className="h-full">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#99D9F2',
          },
        }}>
        <Layout />
      </ConfigProvider>
    </div>
  );
};

export default App;
