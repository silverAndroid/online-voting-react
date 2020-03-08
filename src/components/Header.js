import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function Header() {
  return (
    <AppBar position="sticky" css={{ padding: '16px 0' }}>
      <Toolbar>
        <a href="https://ieeeuottawa.ca" css={{ flexGrow: 1 }}>
          <img
            css={{
              maxHeight: 75,
              display: 'flex',
              justifyContent: 'space-between',
            }}
            src="/logo.png"
            alt="IEEE uOttawa Logo"
          />
        </a>
      </Toolbar>
    </AppBar>
  );
}
