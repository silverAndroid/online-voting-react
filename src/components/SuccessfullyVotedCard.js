import React from 'react';

import { useTranslation } from '../i18n';
import MessageCard from './MessageCard';

export default function SuccessfullyVotedCard() {
  const { t } = useTranslation('MessageCard');
  return (
    <MessageCard
      title={t('common:thankVoting')}
      message={t('thankVoting')}
    />
  );
}
