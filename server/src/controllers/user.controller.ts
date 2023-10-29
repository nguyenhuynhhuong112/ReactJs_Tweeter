import { RequestHandler } from 'express';
import express from 'express';
import bcrypt from 'bcryptjs';
import { formatMonthYear } from '../helper/formatdate.helper';
import cloudinary from '../util/cloudinary';
import {  Tweet, User } from '../model';

export const createUser: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    console.log('body', req.body);
    const { userName, fullName, email, password } = req.body;
    const dateJoined = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);
    const findUserName = await User.findOne({ userName });
    const findEmail = await User.findOne({ email });
    if (!findUserName && !findEmail) {
      const newUser = new User({
        userName,
        fullName,
        email,
        password: hashedPassword,
        dateJoined,
      });
      const { _id, email: resEmail, fullName: resName } = await newUser.save();
      res.status(201).json({ _id, resEmail, resName });
    } else {
      res.status(500).json({ message: 'Username or Email existing' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadImage: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const users = await User.findOne({ userName: user.userName });

    if (!users) {
      return res.status(400).json({ message: 'User not found' });
    }

    let folder = '';

    if (req.url.includes('coverimage')) {
      folder = 'coverimage-tweet';
    } else if (req.url.includes('avatar')) {
      folder = 'avatar-tweet';
    }

    let result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, { folder });
    }

    if (req.url.includes('coverimage')) {
      users.imageCover = result ? result.secure_url : '';
    } else if (req.url.includes('avatar')) {
      users.imageAvatar = result ? result.secure_url : '';
    }

    await users.save();

    const message = req.url.includes('coverimage')
      ? 'Cover image uploaded successfully'
      : 'Avatar uploaded successfully';

    return res.status(200).json({ message, users });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserProfile: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const user = res.locals.user;
    const userProfile = await User.findOne({
      $or: [{ userName: user.userName }, { email: user.email }],
    });
    if (!userProfile) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    let formattedDateJoined = '';
    if (userProfile?.dateJoined) {
      formattedDateJoined = formatMonthYear(userProfile.dateJoined.toISOString());
    }
    const userProfileWithFormattedDateJoined = {
      ...userProfile.toObject(),
      dateJoined: formattedDateJoined,
    };
    res.status(200).json(userProfileWithFormattedDateJoined);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const user = res.locals.user;
    const { fullName, email, password } = req.body;
    const userFind = await User.findOne({ userName: user.userName });
    if (!userFind) throw Error;
    const hasTweets = await Tweet.exists({ userName: user.userName });
    if (email) userFind.email = email;

    if (fullName) {
      userFind.fullName = fullName;
      if (hasTweets) {
        await Tweet.updateMany({ userName: user.userName }, { fullName: fullName });
      }
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userFind.password = hashedPassword;
    }

    await userFind.save();
    res.status(200).json(userFind);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const userFind = await User.findOne({ userName: user.userName });

    if (!userFind) {
      throw new Error('User not found');
    }

    let recommendedUsers = [];
    let seenUserNames: { [key: string]: boolean } = {};

    if (userFind.following.length === 0) {
      recommendedUsers = await User.aggregate([
        { $match: { userName: { $ne: user.userName, $nin: userFind.following.map((f) => f.userName) } } },
        { $sample: { size: 5 } },
      ]);
    } else {
      const followingUserNames = userFind.following.map((following) => following.userName);
      for (const followingUserName of followingUserNames) {
        const followingUser = await User.findOne({ userName: followingUserName });
        if (followingUser && followingUser.following.length > 0) {
          const followingOfFollowingUserNames = followingUser.following.map((following) => following.userName);
          for (const followingOfFollowingUserName of followingOfFollowingUserNames) {
            const isFollowing = userFind.following.some(
              (following) => following.userName === followingOfFollowingUserName
            );
            const isCurrentUser = followingOfFollowingUserName === user.userName;
            if (!isFollowing && !isCurrentUser) {
              const userOfFollowing = await User.findOne({ userName: followingOfFollowingUserName });

              if (userOfFollowing) {
                if (!seenUserNames[userOfFollowing.userName]) {
                  recommendedUsers.push(userOfFollowing);
                  seenUserNames[userOfFollowing.userName] = true;

                  if (recommendedUsers.length >= 5) {
                    break;
                  }
                }
              }
            }
          }
        }
        if (recommendedUsers.length >= 5) {
          break;
        }
      }
    }
    if (recommendedUsers.length < 5) {
      const remainingUsersCount = 5 - recommendedUsers.length;
      const additionalUsers = await User.aggregate([
        {
          $match: {
            userName: {
              $nin: [
                user.userName,
                ...recommendedUsers.map((u) => u.userName),
                ...userFind.following.map((f) => f.userName),
              ],
            },
          },
        },
        { $sample: { size: remainingUsersCount } },
      ]);
      for (const user of additionalUsers) {
        if (!seenUserNames[user.userName]) {
          recommendedUsers.push(user);
          seenUserNames[user.userName] = true;
        }
      }
    }
    res.status(200).json(recommendedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateFollow: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const { userName } = req.body;
    const userFind = await User.findOne({ userName: user.userName });
    const newUser = await User.findOne({ userName: userName });
    if (!userFind || !newUser) throw Error;

    const isAlreadyFollowing = userFind.following.some((followingUser) => followingUser.userName === userName);
    const createAt = new Date().toISOString();
    if (isAlreadyFollowing) {
      userFind.following = userFind.following.filter((followingUser) => followingUser.userName !== userName);
      newUser.followers = newUser.followers.filter((follower) => follower.userName !== userFind.userName);
    } else {
      userFind.following.push({ userName: userName });
      newUser.followers.push({ userName: userFind.userName });
    }

    await Promise.all([userFind.save(), newUser.save()]);
    res.status(200).json({ following: userFind.following });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserByUserName: RequestHandler = async (req, res) => {
  try {
    const { userName } = req.params;
    const userFind = await User.find({ userName: userName });
    if (!userFind) throw Error;
    console.log('name', userFind);
    res.status(200).json(userFind);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchUser: RequestHandler = async (req, res) => {
  try {
    const { query } = req.body;
    console.log('query ', query);
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Tìm kiếm không hợp lệ.' });
    }
    const regex = new RegExp(query, 'i');
    const users = await User.find({
      $or: [{ userName: { $regex: regex } }, { fullName: { $regex: regex } }],
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateBookmark: RequestHandler = async (req, res) => {
  try {
    const { tweetId } = req.params;
    console.log('hi', tweetId);
    const user = res.locals.user;
    const userFind = await User.findOne({ userName: user.userName });
    if (!userFind) {
      throw new Error('Tweet not found');
    }

    console.log(tweetId);
    if (userFind.bookmarks.find((element: { tweetId: string }) => element.tweetId === tweetId)) {
      const indexTweet = userFind.bookmarks.indexOf({ tweetId: tweetId });
      console.log('Hi', tweetId);

      userFind.bookmarks.splice(indexTweet, 1);
    } else {
      userFind.bookmarks.push({ tweetId: tweetId });
    }
    await userFind.save();
    console.log(userFind, 'dj');
    res.status(200).json(userFind);
  } catch (error) {
    console.log('rtytryrtytr', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getImageAvatarByUserName: RequestHandler = async (req, res) => {
  try {
    const userFind = await User.find({}, { imageAvatar: 1, userName: 1 });
    if (!userFind) throw new Error('user not found');
    res.status(200).json(userFind);
  } catch (error) {
    res.status(500).json('Internal server error');
  }
};
