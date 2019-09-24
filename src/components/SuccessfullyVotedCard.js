import React from 'react';
import { useTranslation } from 'react-i18next';

import MessageCard from './MessageCard';

export default function SuccessfullyVotedCard() {
  const { t } = useTranslation('MessageCard');
  return (
    <MessageCard
      title={t('global:thankVoting')}
      message={t('thankVoting')}
    />
  );
}
