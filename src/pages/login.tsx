import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { useTranslation, Trans } from '../i18n';
import AlreadyVotedCard from '../components/AlreadyVotedCard';
import MessageCard from '../components/MessageCard';
import { useSnackbar } from '../hooks/snackbar';
import { getToken, saveToken } from '../helpers/auth';
import { withTranslation } from '../hoc/Translation';
import { withApi } from '../hoc/Api';
import { withCanVote } from '../hoc/CanVote';
import { redirect } from '../helpers/router';

function Login({ isExpired, fetch }) {
  const { t } = useTranslation('Login');
  const [hasAlreadyVoted, setAlreadyVoted] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidVoter, setIsValidVoter] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const rootStyle = { margin: '0 16px' };
  const marginStyle = { margin: '16px' };

  const {
    messageInfo,
    shouldShowSnackbar,
    showMessage,
    onSnackbarClose,
    onSnackbarExit,
  } = useSnackbar();

  useEffect(() => {
    if (isExpired) showMessage(t('sessionExpired'));
  }, [isExpired]);

  function isOfflineGoogleResponse(loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline): loginResponse is GoogleLoginResponseOffline {
    return 'code' in loginResponse;
  }

  async function loginResponse({ tokenId: token, profileObj }: GoogleLoginResponse) {
    const { name, email } = profileObj;
    const response = await fetch(undefined, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setSignedIn(true);
      setIsValidEmail(true);
      setIsValidVoter(true);
      saveToken(await response.text());
    } else if (response.status === 401) {
      setName(name);
      setEmail(email);
      setSignedIn(true);
      setIsValidVoter(true);
      setIsValidEmail(false);
    } else if (response.status === 403) {
      setName(name);
      setEmail(email);
      setSignedIn(true);
      setIsValidVoter(false);
      setIsValidEmail(true);
    } else if (response.status === 409) {
      setAlreadyVoted(true);
    } else if (response.status === 412) {
      redirect('/canVote');
    }
  }

  function reset() {
    setSignedIn(false);
    setIsValidEmail(false);
    setIsValidVoter(false);
    setAlreadyVoted(false);
  }

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!getToken()) {
    redirect('/');
    return <MessageCard message={t('alreadyLoggedIn')} />;
  }

  if (hasAlreadyVoted) {
    return <AlreadyVotedCard />;
  }

  if (!isSignedIn) {
    return (
      <div css={[rootStyle]}>
        <Typography variant="body1" component="p" gutterBottom>
          <Trans i18nKey="voterAnonymity" ns="Login">
            We take voter anonymity very seriously. We only ask you to log in with your uOttawa email to let us know that you have voted but
            <strong>we can never trace back to who you voted for.</strong>
          </Trans>
        </Typography>
        <Typography css={[marginStyle]} variant="body1" component="p" gutterBottom>
          {t('browsers')}
        </Typography>
        <GoogleLogin
          css={[marginStyle]}
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText={t('login')}
          hostedDomain="uottawa.ca"
          onSuccess={loginResponse}
          onFailure={loginResponse}
        />
        {isExpired && (
          <Snackbar
            key={messageInfo.key}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={shouldShowSnackbar}
            onClose={onSnackbarClose}
            onExited={onSnackbarExit}
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
        css={[rootStyle]}
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
        css={[rootStyle]}
        message={t('invalidEmail', { name, email })}
        actions={[
          <Button key="okay-btn" color="secondary" onClick={reset}>{t('okay')}</Button>,
        ]}
      />
    );
  }

  redirect('/');
  return <MessageCard message={t('alreadyLoggedIn')} />;
}

Login.getInitialProps = ({ query: { expired } }) => ({ isExpired: !!expired });

export default withApi(withTranslation(withCanVote(Login))('Login'))('/users/verify');
