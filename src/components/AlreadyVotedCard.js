import React from 'react';
import { useTranslation } from 'react-i18next';

import MessageCard from './MessageCard';

export default function AlreadyVotedCard() {
  const { t } = useTranslation('MessageCard');
  return (
    <MessageCard
      title={t('global:thankVoting')}
      message={t('alreadyVoted', { contactEmail: process.env.REACT_APP_CONTACT_EMAIL })}
    />
  );
}
