import Router from 'next/router';

export function redirect(path: string, res?: any) {
  if (!!res && typeof window === 'undefined') {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    Router.push(path);
  }
}
