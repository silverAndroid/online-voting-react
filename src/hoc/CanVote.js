import { withApi } from './Api';
import { redirect } from '../helpers/router';

export function withCanVote(Page) {
  async function checkifVotingOpen({ fetch, ctx: { res } }) {
    const response = await fetch();

    if (response.ok) {
      return { canVote: true };
    }

    redirect('/canVote', res);
    return { canVote: false };
  }

  return withApi(Page)('/can-vote', checkifVotingOpen);
}
