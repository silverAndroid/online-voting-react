import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import App from './pages/App';

import './index.css';

const bugsnagClient = bugsnag(process.env.REACT_APP_BUGSNAG_API_KEY);
bugsnagClient.use(bugsnagReact, React);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: blue,
  },
  typography: {
    useNextVariants: true,
  },
});

const ErrorBoundary = bugsnagClient.getPlugin('react');
// eslint-disable-next-line no-undef
ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
