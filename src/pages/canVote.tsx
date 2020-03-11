import React, { useEffect } from 'react';

function CanVote() {
  useEffect(() => console.log('can vote'), []);

  return <div>No vote</div>;
}

CanVote.getInitialProps = () => ({
  namespacesRequired: [],
});

export default CanVote;
