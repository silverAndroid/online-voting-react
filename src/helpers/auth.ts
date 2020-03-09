import Cookies, { CookieSetOptions } from 'universal-cookie';

const cookies = new Cookies();
const cookieOptions: CookieSetOptions = { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' };

export function saveToken(token: string) {
  cookies.set('token', token, cookieOptions);
}

export function getToken(req?: any): string {
  const tokenMatch = req?.headers.cookie?.split(/;\s?/).find((cookie) => cookie.startsWith('token'))?.match(/token=(.+);?/)?.[1];

  return tokenMatch || cookies.get('token', { doNotParse: true });
}

export function getAuthHeader(req?: any) {
  const token = getToken(req);
  return token ? `Bearer ${token}` : undefined;
}

export function deleteToken() {
  cookies.remove('token', cookieOptions);
}

export const auth = ({ req }) => getToken(req);
