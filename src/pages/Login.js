import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/styles';
import { useTranslation, Trans } from 'react-i18next';

import request from '../network';
import AlreadyVotedCard from '../components/AlreadyVotedCard';
import MessageCard from '../components/MessageCard';

const useStyles = makeStyles({
  root: {
    padding: '0 16px',
  },
  margin: {
    marginTop: '16px',
  },
});

function Login(props) {
  const { t } = useTranslation('Login');
  const [canVote, setCanVote] = useState(true);
  const [canVoteBody, setCanVoteBody] = useState(undefined);
  const [hasAlreadyVoted, setAlreadyVoted] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidVoter, setIsValidVoter] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  let counter = 0;
  const messageQueue = [];
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});

  function processQueue() {
    if (messageQueue.length > 0) {
      setMessageInfo(messageQueue.shift());
      setShowSnackbar(true);
    }
  }

  function showMessage(message) {
    messageQueue.push({
      // eslint-disable-next-line no-plusplus
      key: counter++,
      message,
    });

    if (showSnackbar) {
      setShowSnackbar(false);
    } else {
      processQueue();
    }
  }

  function handleSnackbarClose() {
    setShowSnackbar(false);
  }

  function handleSnackbarExit() {
    processQueue();
  }

  useEffect(() => {
    if (props.location.state) showMessage(props.location.state.message);
  }, [props.location.state]);

  async function loginResponse({ tokenId, profileObj }) {
    if (tokenId) {
      const { name, email } = profileObj;
      const { ok, unauthorized, forbidden, status, text: token, body } = await request
        .post('/users/verify')
        .ok(res => res.status < 500)
        .set('Authorization', `Bearer ${tokenId}`)
        .send({ email });
      if (ok) {
        setSignedIn(true);
        setIsValidEmail(true);
        setIsValidVoter(true);
        localStorage.setItem('token', token);
      } else if (unauthorized) {
        setName(name);
        setEmail(email);
        setSignedIn(true);
        setIsValidVoter(true);
        setIsValidEmail(false);
      } else if (forbidden) {
        setName(name);
        setEmail(email);
        setSignedIn(true);
        setIsValidVoter(false);
        setIsValidEmail(true);
      } else if (status === 409) {
        setAlreadyVoted(true);
      } else if (status === 412) {
        setCanVoteBody(body);
        setCanVote(false);
      }
    }
  }

  function reset() {
    setSignedIn(false);
    setIsValidEmail(false);
    setIsValidVoter(false);
    setAlreadyVoted(false);
    setCanVote(true);
  }

  const classes = useStyles();

  if (localStorage.getItem('token') !== null) {
    return <Redirect to="/vote" />;
  }

  if (hasAlreadyVoted) {
    return <AlreadyVotedCard />;
  }

  if (!canVote) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: canVoteBody,
        }}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <div className={classes.root}>
        <Typography variant="body1" component="p" gutterBottom>
          <Trans i18nKey="voterAnonymity" ns="Login">
            We take voter anonymity very seriously. We only ask you to log in with your uOttawa email to let us know that you have voted but
            <strong>we can never trace back to who you voted for.</strong>
          </Trans>
        </Typography>
        <Typography className={classes.margin} variant="body1" component="p" gutterBottom>
          {t('browsers')}
        </Typography>
        <GoogleLogin
          className={classes.margin}
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText={t('login')}
          hostedDomain="uottawa.ca"
          onSuccess={loginResponse}
          onFailure={loginResponse}
        />
        {props.location.state && (
          <Snackbar
            key={messageInfo.key}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={showSnackbar}
            onClose={handleSnackbarClose}
            onExited={handleSnackbarExit}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{messageInfo.message}</span>}
          />
        )}
      </div>
    );
  }

  if (!isValidVoter) {
    return (
      <MessageCard
        className={classes.root}
        message={t('invalidVoter', { name, contactEmail: process.env.REACT_APP_CONTACT_EMAIL })}
        actions={[
          <Button key="okay-btn" color="secondary" onClick={reset}>{t('okay')}</Button>,
        ]}
      />
    );
  }

  if (!isValidEmail) {
    return (
      <MessageCard
        className={classes.root}
        message={t('invalidEmail', { name, email })}
        actions={[
          <Button key="okay-btn" color="secondary" onClick={reset}>{t('okay')}</Button>,
        ]}
      />
    );
  }

  return <Redirect to="/vote" />;
}

export default Login;
