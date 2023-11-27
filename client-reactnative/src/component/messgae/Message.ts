import Toast from 'react-native-toast-message';

export const Message = (content: string) => {
  Toast.show({
    type: 'success',
    position: 'bottom',
    text1: content,
    visibilityTime: 5000,
    autoHide: true,
  });
};

export const MessageError = (content: string) => {
    console.log('Calling MessageError with content:', content);
  Toast.show({
    type: 'error',
    position: 'bottom',
    text1: content,
    visibilityTime: 5000,
    autoHide: true,
  });
};
