import React, { Fragment, useId } from "react";
import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";
import { Box, Paper, Popover, useTheme } from "@mui/material";

const AgentButton = () => {
  //! State
  const theme: any = useTheme();
  const agentId = useId();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? agentId : undefined;

  //! Function

  //! Render
  return (
    <Fragment>
      <CommonStyles.Button
        onClick={handleClick}
        sx={{
          gap: "8px",
          color: theme.colors.custom.colorDisabledTypo,
        }}
      >
        <CommonIcons.LooksOne sx={{ width: 16, height: 16 }} />
        <CommonStyles.Typography type="normal12">
          Single agent mode
        </CommonStyles.Typography>
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
              borderRadius: "12px",
            },
          },
        }}
      >
        <Paper
          sx={{
            padding: "24px",
            borderRadius: "12px",
            overflow: "hidden",
            button: {
              color: "#000",
              padding: "12px 16px",
            },
          }}
        >
          <CommonStyles.Typography type="normal18">
            Change mode
          </CommonStyles.Typography>
          <Box
            mt="24px"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <CommonStyles.Button
              isActive
              sx={{
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                maxWidth: "315px",
                width: "315px",
                minHeight: "unset",
                height: "fit-content",
              }}
            >
              <CommonStyles.Typography>
                Single agent mode
              </CommonStyles.Typography>
              <CommonStyles.Typography sx={{ fontWeight: 100 }}>
                The bot only contains a single agent. This is recommended for
                bots with simple logic.
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <CommonStyles.Button
              sx={{
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                maxWidth: "315px",
                width: "315px",
                minHeight: "unset",
                height: "fit-content",
                border: `1px solid ${theme.colors.custom.colorDisabledTypo}`,
              }}
            >
              <CommonStyles.Typography>
                Multi agent mode
              </CommonStyles.Typography>
              <CommonStyles.Typography sx={{ fontWeight: 100 }}>
                Set multiple agents collaborating in one bot to deal with
                complex logic.
              </CommonStyles.Typography>
            </CommonStyles.Button>
          </Box>
        </Paper>
      </Popover>
    </Fragment>
  );
};

export default AgentButton;
