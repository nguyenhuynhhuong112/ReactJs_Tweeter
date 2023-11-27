import axios, { AxiosRequestConfig } from 'axios'; // Import axios and AxiosError
import AsyncStorage from "@react-native-async-storage/async-storage";

export const customFetch = async ({ method = 'GET', data = {}, headers }: AxiosRequestConfig, path?: string) => {
  const baseURL = 'http://localhost:8080';
  const url = baseURL + path;
  const token = await AsyncStorage.getItem('token');

  try {
    const { data: response, status } = await axios({
      baseURL: url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      data,
    });

    if (status >= 200 && status < 300) {
      console.log('Request successful with status code', status);
      return { data: response };
    } 
  } catch (error: any) {
     console.log('Exception:', error);
      return { error: error.message, fullError: error };
  }
};
