import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/styles';

import logo from '../logo.png';

const useStyles = makeStyles({
  root: {
    padding: '16px 0',
  },
  link: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: 75,
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="sticky" className={classes.root}>
      <Toolbar>
        <a href="https://ieeeuottawa.ca" className={classes.link}>
          <img
            src={logo}
            alt="IEEE uOttawa Logo"
            className={classes.logo}
          />
        </a>
      </Toolbar>
    </AppBar>
  );
}
