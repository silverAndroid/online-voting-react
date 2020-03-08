// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

type MessageCardProps = {
  message: string,
  title?: string,
  actions?: React.Component<{}, {}>[];
}

export default function MessageCard({ message, title, actions }: MessageCardProps) {
  return (
    <Card
      css={{
        margin: '0 auto 32px',
        '@media screen and (min-width: 410px)': {
          width: '25%',
          minWidth: '369px',
        },
        '@media screen and (max-width: 409px)': {
          maxWidth: '369px',
          margin: '0 16px 32px',
          width: '92%',
        },
      }}
    >
      <CardContent>
        {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
        <Typography variant="body1">{message}</Typography>
      </CardContent>
      {
        actions && actions.length > 0 && (
          <CardActions>
            {actions}
          </CardActions>
        )
      }
    </Card>
  );
}
