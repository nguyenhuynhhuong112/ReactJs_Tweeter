interface TokenPayload {
    exp: number;
  }
  export const isTokenExpired = (token: string | null): boolean => {
    if (!token) {
      return true;
    }
    const tokenPayload: TokenPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  
    return tokenPayload.exp < currentTimeInSeconds;
  };
  