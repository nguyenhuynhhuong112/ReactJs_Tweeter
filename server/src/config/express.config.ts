import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
export const expressConfig = (app: any) => {
  app.use(
    cors({
      credentials: true,
    })
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());
};
