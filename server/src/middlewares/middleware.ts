import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from './auth.controller';

export const middlewareJWT = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.header('Authorization');

  console.log(token);
  console.log(secretKey);

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('token', decoded);
    res.locals.user = decoded;
    console.log(token);
    return next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
