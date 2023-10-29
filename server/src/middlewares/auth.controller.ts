import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../model';

export const secretKey = 'TWETTER';
export const authen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, email, password } = req.body;
    console.log('');
    const userFind = await User.findOne({ $or: [{ userName }, { email }] });
    if (!userFind) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, userFind.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    console.log(userFind, 'gygdyed');
    const token = jwt.sign(
      { userName: userFind.userName, fullName: userFind.fullName, bookmarks: userFind.bookmarks },
      secretKey,
      {
        expiresIn: process.env.TIME_TOKEN,
      }
    );

    res.json({ message: 'Login successful', token, userName, fullName: userFind.fullName });
    return next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
