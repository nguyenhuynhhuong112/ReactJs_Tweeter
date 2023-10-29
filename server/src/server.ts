import express from 'express';
import http from 'http';
import routes from './routes';
import dotenv from 'dotenv';
import { expressConfig, mongoConfig } from './config';
import cors from 'cors';
import { configureSocket } from './controllers';
const server = async () => {
  dotenv.config();
  const app = express();
  app.use(cors());
  expressConfig(app);
  await mongoConfig();
  const httpServer = http.createServer(app);
  configureSocket(httpServer);
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}/`);
  });
  app.use('/', routes());
};

server().catch((error) => console.error('Error starting server: ', error));
