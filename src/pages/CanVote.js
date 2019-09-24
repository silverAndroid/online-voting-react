import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import MessageCard from '../components/MessageCard';
import request from '../network';

export default function CanVote(props) {
  const { t } = useTranslation('CanVote');

  const [isLoading, setLoading] = useState(true);
  const [votingNotStarted, setNotStarted] = useState(false);
  const [votingEnded, setClosed] = useState(false);
  const [date, setDate] = useState(undefined);

  useEffect(() => {
    const updateState = (state) => {
      const { notStarted, isClosed, date: voteDate } = state;
      setNotStarted(notStarted);
      setClosed(isClosed);
      setDate(dayjs(voteDate).format(t('dateFormat')));
    };

    if (!props.location.state) {
      request.get('/can-vote')
        .ok(res => res.status < 500)
        .then(({ status, body }) => {
          if (status === 412) updateState(body);
          setLoading(false);
        });
    } else {
      updateState(props.location.state);
      setLoading(false);
    }
  }, [props.location.state]);

  if (isLoading) {
    return <MessageCard title={t('votingSystemOpen')} message={t('global:loading')} />;
  }

  if (votingNotStarted) {
    return <MessageCard message={t('votingStarts', { date })} title={t('votingSystemOpen')} />;
    // eslint-disable-next-line no-else-return
  } else if (votingEnded) {
    return <MessageCard message={t('votingEnds', { date })} title={t('votingSystemOpen')} />;
  } else {
    return <Redirect to="/login" />;
  }
}
