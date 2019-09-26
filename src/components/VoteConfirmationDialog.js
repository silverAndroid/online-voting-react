import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

import config from '../config';

export default function VoteConfirmationDialog({ show, positions, handleConfirmation, handleCancel }) {
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
                <strong>{config.translateNames.some(translateName => translateName === name) ? t(name) : name}</strong>
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

VoteConfirmationDialog.propTypes = {
  handleConfirmation: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  positions: PropTypes.object.isRequired,
};
