import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import React, { useId } from "react";
import { Box, Popover } from "@mui/material";
import CommonIcons from "../../../Components/CommonIcons";
import LocalUploadButton from "./LocalUploadButton";

const AddContentButton = () => {
  //! State
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const id = useId();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  //! Function

  //! Render
  return (
    <Fragment>
      <CommonStyles.Button
        onClick={handleClick}
        variant="outlined"
        sx={{ fontWeight: "500" }}
      >
        Add content
      </CommonStyles.Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              padding: "4px",
              border: "solid 1px #ccc",
              mt: "8px",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            button: {
              textAlign: "left",
              justifyContent: "flex-start",
              color: "unset",
              padding: "8px 16px",
              height: "38px",
              svg: {
                width: 16,
                height: 16,
              },
            },
          }}
        >
          <LocalUploadButton />
          <CommonStyles.Button startIcon={<CommonIcons.CloudUpload />}>
            <CommonStyles.Typography type="normal14">
              Online document
            </CommonStyles.Typography>
          </CommonStyles.Button>
        </Box>
      </Popover>
    </Fragment>
  );
};

export default AddContentButton;
