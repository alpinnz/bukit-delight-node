import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ButtonCustom from "./../../components/common/button.custom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const { open, onClose, title, children, onSubmit, loading } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
      >
        <DialogTitle>{title || "title"}</DialogTitle>
        <DialogContent dividers>
          {children || <DialogContentText>DialogContent</DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text" color="primary">
            Cancel
          </Button>

          <ButtonCustom
            loading={loading}
            disabled={loading}
            onClick={onSubmit}
            label="Submit"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
