import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export default function Custom({ title, children, open, onClose, onSubmit }) {
  const _onClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const _onSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={_onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{`${title}`}</DialogTitle>
        <DialogContent dividers>
          {children ? (
            children
          ) : (
            <DialogContentText>Text 123</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={_onClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={_onSubmit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
