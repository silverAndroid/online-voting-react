import React from 'react';
import unfetch from 'isomorphic-unfetch';

import { getApiUrl } from '../helpers/api';
import { getAuthHeader } from '../helpers/auth';

export interface ApiProps {
  fetch: (pathUrl?: RequestInfo, options?: RequestInit) => Promise<Response>;
  apiUrl: string;
  data?: any;
}

export function withApi(Page: any) {
  return (path: string, loadData?: ({ ctx, fetch }) => Promise<any>) => {
    console.log('withApi');
    const apiUrl = getApiUrl(path);
    if (process.env.NODE_ENV === 'development') console.log(apiUrl);

    // eslint-disable-next-line arrow-body-style
    const easyFetch = (req?) => {
      // eslint-disable-next-line arrow-body-style
      return (pathUrl?: RequestInfo, options: RequestInit = {}) => {
        return unfetch(`${apiUrl}${pathUrl || ''}`, {
          ...options,
          headers: {
            Authorization: getAuthHeader(req),
            ...options.headers,
          },
        });
      };
    };
    const ApiWrapper = (props) => <Page {...props} fetch={easyFetch()} apiUrl={apiUrl} />;

    ApiWrapper.getInitialProps = async (ctx) => {
      const componentProps = await Page.getInitialProps?.call(this, ctx);
      let data;

      if (loadData) {
        console.log('withApi', 'loadData');
        const { req } = ctx;
        const fetch = easyFetch(req);

        data = await loadData({ ctx, fetch, ...componentProps });
      }

      return { ...componentProps, data, namespacesRequired: componentProps.namespacesRequired || [] };
    };

    return ApiWrapper;
  };
}
