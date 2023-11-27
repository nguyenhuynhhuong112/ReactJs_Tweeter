import axios from 'axios';
import { customFetch } from './customFetch';
jest.mock('axios');
describe('utilities customFetch', () => {
  test('should make a successful request', async () => {
    const data = {
      userName: 'huongquadeo',
      password: '123456',
    };
    // const successfulLoginResponse = {
    //   data: {
    //     message: 'Login successful',
    //     token: 'exampleToken',
    //     userName: 'huongquadeo',
    //     fullName: 'Huong Qua Deo',
    //   },
    //   status: 200,
    // };
    const x = jest.fn().mockImplementation(() => axios.post);
    const expectedResponse = {
      message: 'Login successful',
      token: 'exampleToken',
      userName: 'huongquadeo',
      fullName: 'Huong Qua Deo',
    };
    (axios.post as jest.Mock).mockReturnValue({ data });
    const response = await customFetch({ method: 'POST', data }, '/login');
    console.log('test dmm', response);
    expect(x).toHaveBeenCalled();
    const test = response && response.data;
    expect(test).toEqual(expectedResponse);
  });
});
