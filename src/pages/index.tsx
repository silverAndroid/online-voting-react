import { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CardActions from '@material-ui/core/CardActions';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import MessageCard from '../components/MessageCard';
import AlreadyVotedCard from '../components/AlreadyVotedCard';
import SuccessfullyVotedCard from '../components/SuccessfullyVotedCard';
import VoteConfirmationDialog from '../components/VoteConfirmationDialog';

import config from '../config';
import { withApi } from '../hoc/Api';
import { withCanVote } from '../hoc/CanVote';
import { useTranslation, Trans } from '../i18n';
import { deleteToken, getToken } from '../helpers/auth';
import { redirect } from '../helpers/router';
import { useSnackbar } from '../hooks/snackbar';
import { withTranslation } from '../hoc/Translation';

function Vote({ fetch, candidatesObj }) {
  const { t } = useTranslation('Vote');

  const [hasAlreadyVoted, setAlreadyVoted] = useState(false);
  const [hasSuccessfullyVoted, setSuccessfullyVoted] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const [showConfirmationDialog, setShowDialog] = useState(false);

  const {
    messageInfo,
    shouldShowSnackbar,
    showMessage,
    onSnackbarClose,
    onSnackbarExit,
  } = useSnackbar();

  useEffect(() => {
    Object.entries(candidatesObj).reduce((obj, [position, candidates]) => {
      const newObj = obj;
      const { id, position: positionName, name: candidate } = (candidates as any).filter(
        ({ name }) => name === 'Abstain',
      )[0];
      newObj[position] = {
        id,
        position: positionName,
        name: candidate,
      };
      return newObj;
    }, {});
  }, []);

  function onCandidateSelected(event) {
    const node = event.target;

    const position = node.parentNode.parentNode.parentNode.parentNode.getAttribute(
      'aria-label',
    );

    const radioButton = node.parentNode.parentNode.parentNode;
    const id = radioButton.children[0].children[0].children[1].getAttribute(
      'value',
    );
    const name = radioButton.children[1].innerText;

    setSelected({
      ...selected,
      [position]: {
        position,
        id,
        name,
      },
    });
  }

  function handleShowConfirmationDialog() {
    setShowDialog(true);
  }

  function closeConfirmationDialog() {
    setShowDialog(false);
  }

  async function submitVote() {
    closeConfirmationDialog();
    showMessage(t('submit'));

    try {
      const response = await fetch('/vote/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidates: Object.values(selected).map(({ id }) => id),
        }),
      });

      if (response.ok) {
        deleteToken();
        setSuccessfullyVoted(true);
      } else if (response.status === 401 || response.status === 403) {
        deleteToken();
        redirect('/login?expired');
      } else if (response.status === 409) {
        setAlreadyVoted(true);
      } else if (response.status === 412) {
        redirect('/canVote');
      } else {
        showMessage(t('submitFail'));
      }
    } catch (e) {
      showMessage(t('submitFail'));
    }
  }

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
        <MessageCard message={t('common:loading')} />
      </div>
    );
  }

  if (hasAlreadyVoted) {
    return <AlreadyVotedCard />;
  }

  if (hasSuccessfullyVoted) {
    return <SuccessfullyVotedCard />;
  }

  return (
    <>
      <Typography css={{ margin: '0 16px' }} variant="body1" gutterBottom>
        <Trans i18nKey="informationalHeader" ns="Vote">
          text
          <strong>bold</strong>
          text
          <strong>bold</strong>
        </Trans>
      </Typography>
      <Card css={{ maxWidth: '21rem', margin: '16px auto 0 auto' }}>
        <CardHeader css={{ paddingBottom: 0 }} title={t('voteNextHeader')} />
        <CardContent>
          <FormControl component="fieldset">
            {Object.entries(candidatesObj).map(
              ([position, candidates], index) => (
                <div key={position}>
                  <FormLabel
                    key={`${position}-header`}
                    component="legend"
                    css={index > 0 ? [{ marginTop: '16px' }] : []}
                  >
                    {t(`position:${position}`)}
                  </FormLabel>
                  <RadioGroup
                    aria-label={position}
                    name={position}
                    value={selected[position].id.toString()}
                    onChange={onCandidateSelected}
                  >
                    {(candidates as any[]).map(({ id, name }) => (
                      <FormControlLabel
                        key={`${position}-${name}`}
                        control={<Radio color="secondary" />}
                        label={
                          config.translateNames.some(
                            (translateName) => translateName === name,
                          )
                            ? t(name)
                            : name
                        }
                        value={id.toString()}
                      />
                    ))}
                  </RadioGroup>
                </div>
              ),
            )}
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="secondary"
            onClick={() => handleShowConfirmationDialog()}
          >
            {t('submitAction')}
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        key={messageInfo.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={shouldShowSnackbar}
        autoHideDuration={2000}
        onClose={onSnackbarClose}
        onExited={onSnackbarExit}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{messageInfo.message}</span>}
      />
      <VoteConfirmationDialog
        show={showConfirmationDialog}
        handleConfirmation={submitVote}
        positions={selected}
        handleCancel={closeConfirmationDialog}
      />
    </>
  );
}

Vote.getInitialProps = async ({ req, res }) => {
  if (!getToken(req)) {
    redirect('/login', res);
  }

  return {};
};

async function getCandidates({ fetch }) {
  console.log('fetching candidates');
  const response = await fetch();

  if (response.ok) {
    const candidates = await response.json();
    return { candidates };
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(await response.json());
  }
  return { candidates: [] };
}

export default withApi(
  withApi(withTranslation(withCanVote(Vote))('Vote'))('/vote/candidates', getCandidates)
)('');
