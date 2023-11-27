import express, { RequestHandler } from 'express';
import { Tweet } from '../model';

export const addComment: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const user = res.locals.user;

    const { content } = req.body;
    const { tweetId } = req.params;
    const tweet = await Tweet.findOne({ _id: tweetId });
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const newComment = {
      userName: user.userName,
      content,
      createdAt: new Date(),
      updatedAt: null,
    };
    tweet.comments.push(newComment);

    await tweet.save();
    return res.status(200).json(tweet);
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getCommentsByTweet: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { tweetId } = req.params;

    const tweet = await Tweet.findOne({ _id: tweetId });
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    tweet.comments.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

    return res.status(200).json(tweet.comments);
  } catch (error) {
    console.error('Error getting comments for tweet:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const deleteComment: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    // const user = res.locals.user;
    const { tweetId, commentId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const comment = tweet.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    tweet.comments.remove({ _id: comment._id });
    await tweet.save();

    return res.status(200).json(tweet);
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateComment: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const user = res.locals.user;
    const { tweetId, commentId } = req.params;
    console.log('asdasdasd', req.headers, 'wtf', req.body);
    const { content } = req.body;
    // console.log("asdsd", tweetId,commentId,content)
    const tweet = await Tweet.findOne({ _id: tweetId });
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    const comment = tweet.comments.find((comment) => comment.id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userName !== user.userName) {
      return res.status(403).json({ message: 'You are not allowed to update this comment' });
    }
    console;
    comment.content = content;
    comment.updatedAt = new Date();
    await tweet.save();
    return res.status(200).json(tweet);
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const likesComment: RequestHandler = async (req: express.Request, res: express.Response) => {
  try {
    const user = res.locals.user;
    const { tweetId, commentId } = req.params;
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const comment = tweet.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const liked = comment.likescomment.find((like) => like.userName === user.userName);
    if (liked) {
      comment.likescomment = comment.likescomment.filter((like) => like.userName !== user.userName);
    } else {
      comment.likescomment.push({ userName: user.userName });
    }
    await tweet.save();

    return res.status(200).json(tweet);
  } catch (error) {
    console.error('Error like comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
