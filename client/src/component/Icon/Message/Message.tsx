import { message } from 'antd';

export const Message = (content: string) => {
  message.success(content, 5);
};

export const MessageError = (content: string) => {
  message.error(content, 5);
};
