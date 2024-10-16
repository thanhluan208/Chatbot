import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import { Box, ClickAwayListener, Paper, Popper } from "@mui/material";
import React from "react";

import { toast } from "react-toastify";
import DeleteBotButton from "./DeleteBotButton";
import { Bot } from "../../../../../Hooks/Bot/useGetListBot";
import httpServices from "@/Services/httpServices";
import { duplicateBot } from "@/Constants/api";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useGet } from "@/Stores/useStore";
import { useTranslation } from "react-i18next";

interface IMoreOption {
  bot: Bot;
}

function MoreOption(props: IMoreOption) {
  //Translation
  const { t } = useTranslation("store");
  //! State
  const { bot } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const refetchBotList = useGet("REFETCH_LIST_BOT");
  const { userId } = useAuth();

  const open = !!anchorEl;

  //! Function
  const handleDuplicate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAnchorEl(null);
    const toastId = toast.loading(t("common.toast.duplicating", {param: "bot"}), {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.post(duplicateBot, {
        user_id: userId,
        original_bot_id: bot.bot_id,
      });

      refetchBotList && (await refetchBotList());

      if (response?.data?.status_code !== 200) {
        toast.update(toastId, {
          isLoading: false,
          render: t("common.toast.duplicateFail", {param: "bot"}),
          type: "error",
          autoClose: 3000,
        });
        return;
      }

      toast.update(toastId, {
        isLoading: false,
        render: t("common.toast.duplicateSuccess", {param: "Bot"}),
        type: "success",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        isLoading: false,
        render: t("common.toast.duplicateFail", {param: "bot"}),
        type: "error",
        autoClose: 3000,
      });
    }
  };

  //! Render
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <CommonStyles.Button
          isIcon
          isRound={false}
          hasBorder={false}
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
          onClick={(e) => {
            e.stopPropagation();
          }}
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
              <CommonStyles.Button onClick={handleDuplicate}>
                <CommonStyles.Typography type="semiBold14">
                  {t("common.button.duplicate")}
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
