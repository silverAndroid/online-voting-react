import React from 'react';

import { useTranslation } from '../i18n';
import MessageCard from './MessageCard';

export default function AlreadyVotedCard() {
  const { t } = useTranslation('MessageCard');
  return (
    <MessageCard
      title={t('common:thankVoting')}
      message={t('alreadyVoted', { contactEmail: process.env.REACT_APP_CONTACT_EMAIL })}
    />
  );
}
