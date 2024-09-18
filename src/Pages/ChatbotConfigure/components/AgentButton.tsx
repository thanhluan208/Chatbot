import React, { Fragment, useId } from "react";
import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";
import { Box, Paper, Popover, useTheme } from "@mui/material";
import { Mode } from "./Develop";
import httpServices from "@/Services/httpServices";
import { changeBotMode, createMultiAgent } from "@/Constants/api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";
import { useGet, useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

const AgentButton = ({
  setMode,
  mode,
  hasMultiAgent,
}: {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  mode: Mode;
  hasMultiAgent?: boolean;
}) => {
  //! State
  const theme = useTheme();
  const agentId = useId();
  const save = useSave();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { userId } = useAuth();
  const params = useParams();
  const botId = params.botId;

  const refetchBotData = useGet("REFETCH_BOT_DATA");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? agentId : undefined;
  const isSingle = mode === Mode.Single_agent;

  //! Function
  const handleChangeMode = async (mode: Mode) => {
    const toastId = toast.loading("Switching to multi-agent mode...", {
      isLoading: true,
      autoClose: false,
    });
    save(cachedKeys.LOADING_APP, true);
    try {
      if (!hasMultiAgent) {
        const response = await httpServices.post(createMultiAgent, {
          bot_id: botId,
          user_id: userId,
        });

        if (response.data.status_code !== 200) {
          toast.update(toastId, {
            render: "Failed to switch mode",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          return;
        }
      }

      const responseSwitchMode = await httpServices.post(changeBotMode, {
        bot_id: botId,
        user_id: userId,
        bot_mode: mode,
      });

      if (responseSwitchMode.data.status_code === 200) {
        toast.update(toastId, {
          render: "Switched to multi-agent mode successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        setMode(Mode.Multi_agent);
        handleClose();
      } else {
        toast.update(toastId, {
          render: "Failed to switch mode",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      refetchBotData && (await refetchBotData());
      save(cachedKeys.LOADING_APP, false);
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to switch mode",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      save(cachedKeys.LOADING_APP, false);
    }
  };
  //! Render
  return (
    <Fragment>
      <CommonStyles.Button
        onClick={handleClick}
        sx={{
          gap: "8px",
          color: theme.colors.custom.normalColorTypo,
        }}
      >
        <CommonIcons.LooksOne sx={{ width: 16, height: 16 }} />
        <CommonStyles.Typography type="normal12">
          {isSingle ? "Single agent mode" : "Multi agent mode"}
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
              isActive={isSingle}
              disabled={mode === Mode.Single_agent}
              sx={{
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                maxWidth: "315px",
                width: "315px",
                minHeight: "unset",
                height: "fit-content",
                border: `1px solid ${theme.colors.custom.borderColor}`,
              }}
              onClick={() => {
                handleChangeMode(Mode.Single_agent);
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
              isActive={!isSingle}
              disabled={mode === Mode.Multi_agent}
              sx={{
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                maxWidth: "315px",
                width: "315px",
                minHeight: "unset",
                height: "fit-content",
                border: `1px solid ${theme.colors.custom.borderColor}`,
              }}
              onClick={() => handleChangeMode(Mode.Multi_agent)}
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
