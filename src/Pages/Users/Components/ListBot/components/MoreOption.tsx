import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import { Box, ClickAwayListener, Paper, Popper, useTheme } from "@mui/material";
import React from "react";

import { toast } from "react-toastify";
import DeleteBotButton from "./DeleteBotButton";
import { Bot } from "../../../../../Hooks/Bot/useGetListBot";

interface IMoreOption {
  bot: Bot;
}

function MoreOption(props: IMoreOption) {
  //! State
  const { bot } = props;
  const theme: any = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const open = !!anchorEl;

  //! Function
  const handleDuplicate = async () => {
    const toastId = toast.loading("Duplicating bot...", {
      isLoading: true,
      autoClose: false,
    });

    toast.update(toastId, {
      isLoading: false,
      render: "Bot duplicated successfully!",
      type: "success",
      autoClose: 3000,
    });
  };

  //! Render
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
      <CommonStyles.Button
        isIcon
        className={anchorEl ? "" : "btnGroup"}
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <CommonIcons.MoreVert />
      </CommonStyles.Button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"bottom-end"}
        keepMounted={false}
      >
        {() => (
          <Paper
            sx={{
              padding: "8px ",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              "& button": {
                justifyContent: "start",
              },
            }}
          >
            <CommonStyles.Button>
              <CommonStyles.Typography
                type="semiBold14"
                color={theme.colors.custom.semiColorTypo}
              >
                Statistic
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <CommonStyles.Button onClick={handleDuplicate}>
              <CommonStyles.Typography
                type="semiBold14"
                color={theme.colors.custom.semiColorTypo}
              >
                Duplicate
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <DeleteBotButton bot={bot} />
          </Paper>
        )}
      </Popper>
    </Box>
    </ClickAwayListener>
  );
}

export default MoreOption;
