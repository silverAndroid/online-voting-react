import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

import Header from '../components/Header';
import MessageCard from '../components/MessageCard';

const Login = lazy(() => import('./Login'));
const Vote = lazy(() => import('./Vote'));
const CanVote = lazy(() => import('./CanVote'));

const useStyles = makeStyles({
  root: {
    padding: '16px 0',
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <>
        <Header />

        <div className={classes.root}>
          <Suspense fallback={<MessageCard message="Loading..." />}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/vote" component={Vote} />
              <Route component={CanVote} />
            </Switch>
          </Suspense>
        </div>
      </>
    </Router>
  );
};

export default App;
