import React from 'react';

import MessageCard from './MessageCard';

export default function AlreadyVotedCard() {
  return (
    <MessageCard
      title="Thanks for voting!"
      message={`Our system is showing that you've already voted. If you believe this is a mistake, please email ${process.env.REACT_APP_CONTACT_EMAIL}`}
    />
  );
}
