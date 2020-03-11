/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export function withTranslation(Page: any) {
  return (...namespaces: string[]) => {
    console.log('withTranslation');
    const TranslationWrapper = (props) => <Page {...props} />;

    TranslationWrapper.getInitialProps = async (ctx) => {
      const componentProps = await Page.getInitialProps?.call(this, ctx);
      return { ...componentProps, namespacesRequired: namespaces };
    };

    return TranslationWrapper;
  };
}
