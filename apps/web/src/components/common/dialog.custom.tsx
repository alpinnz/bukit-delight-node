import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ButtonCustom from "./button.custom";

const Transition = forwardRef<unknown, ComponentProps<typeof Slide>>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

type DialogCustomProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  onSubmit?: ComponentProps<typeof Button>["onClick"];
  loading?: boolean;
};

export default function AlertDialogSlide({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading,
}: DialogCustomProps) {
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
