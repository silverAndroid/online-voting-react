export function getApiUrl(path: string) {
  return `${process.env.REACT_APP_PROD_URL}${path}`;
}
