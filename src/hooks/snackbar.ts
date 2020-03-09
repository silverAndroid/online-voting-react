import { useState, SyntheticEvent } from 'react';

interface SnackbarState {
  messageInfo: { key?: number; message?: string; };
  shouldShowSnackbar: boolean;
  showMessage: (message: any) => void;
  onSnackbarClose: (_event: SyntheticEvent<Element, Event> | MouseEvent, reason?: string) => void;
  onSnackbarExit: () => void;
}

export function useSnackbar(): SnackbarState {
  let counter = 0;
  const messageQueue = [];
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});

  function showMessage(message) {
    messageQueue.push({
      // eslint-disable-next-line no-plusplus
      key: counter++,
      message,
    });

    if (showSnackbar) {
      setShowSnackbar(false);
    } else {
      processQueue();
    }
  }

  function processQueue() {
    if (messageQueue.length > 0) {
      setMessageInfo(messageQueue.shift());
      setShowSnackbar(true);
    }
  }

  function handleSnackbarClose(
    _event: React.SyntheticEvent | MouseEvent,
    reason?: string,
  ) {
    if (reason === 'clickaway') return;
    setShowSnackbar(false);
  }

  function handleSnackbarExit() {
    processQueue();
  }

  return {
    messageInfo,
    shouldShowSnackbar: showSnackbar,
    showMessage,
    onSnackbarClose: handleSnackbarClose,
    onSnackbarExit: handleSnackbarExit,
  };
}
