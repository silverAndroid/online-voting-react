// @flow

import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from '../i18n';
import config from '../config';

interface VoteConfirmationDialogProps {
  handleConfirmation: () => void;
  handleCancel: () => void;
  show: boolean;
  positions: any;
}

export default function VoteConfirmationDialog({
  show, positions, handleConfirmation, handleCancel,
}: VoteConfirmationDialogProps) {
  const { t } = useTranslation('VoteConfirmationDialog');

  return (
    <Dialog open={show}>
      <DialogTitle>{t('confirmation')}</DialogTitle>
      <DialogContent>
        {
          Object.values(positions)
            .map(({ position, name }) => (
              <Typography key={position} variant="body1" gutterBottom>
                {t(`position:${position}`)}
                :
                {' '}
                <strong>{config.translateNames.some((translateName) => translateName === name) ? t(name) : name}</strong>
              </Typography>
            ))
        }
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleConfirmation}>{t('confirmAction')}</Button>
        <Button color="secondary" onClick={handleCancel}>{t('cancelAction')}</Button>
      </DialogActions>
    </Dialog>
  );
}
