import CommonStyles from "../../../../../Components/CommonStyles";
import { Box, Paper, Popper } from "@mui/material";
import CommonIcons from "../../../../../Components/CommonIcons";
import React, { useId } from "react";

interface IHint {
  content: React.ReactNode;
}

const Hint = (props: IHint) => {
  //! State
  const { content } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const id = useId();

  const open = Boolean(anchorEl);
  //! Function

  //! Render

  return (
    <Box onMouseLeave={() => setAnchorEl(null)}>
      <CommonStyles.Button
        isIcon
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <CommonIcons.InfoOutlined sx={{ height: 16, width: 16 }} />
      </CommonStyles.Button>
      <Popper
        open={open}
        id={id}
        anchorEl={anchorEl}
        sx={{
          borderRadius: "12px",
          zIndex: 9999,
        }}
        //   onClose={()}
      >
        <Paper
          sx={{
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            width: "224px",
            gap: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            "& button": {
              justifyContent: "start",
            },
            ul: {
              paddingLeft: "17.5px",
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {content}
        </Paper>
      </Popper>
    </Box>
  );
};

export default Hint;
