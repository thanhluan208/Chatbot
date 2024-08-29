import {
  Dialog,
  DialogProps,
  useTheme,
} from "@mui/material";
import React from "react";

interface IMUIDialog {
  children: React.ReactNode;
  toggle: () => void;
}

function MUIDialog(props: IMUIDialog & DialogProps) {
  //! State
  const { children, toggle } = props;
  const theme: any = useTheme();
  //! Function

  //! Render
  return (
    <Dialog
      onClose={(e: any) => {
        e.stopPropagation();
        toggle();
      }}
      {...props}
      PaperProps={{
        sx: {
          background: theme.colors.custom.backgroundDialog,
        },
      }}
    >
      {children}
    </Dialog>
  );
}

export default MUIDialog;
