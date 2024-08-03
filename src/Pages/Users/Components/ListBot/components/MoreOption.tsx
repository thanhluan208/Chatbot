import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import { Box,  Paper, Popper, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useSave } from "../../../../../Stores/useStore";
import cachedKeys from "../../../../../Constants/cachedKeys";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { processDelay } from "../../../../../Helpers";
import { toast } from "react-toastify";

interface IMoreOption {
  id: string;
}

function MoreOption(props: IMoreOption) {
  //! State
  const {} = props;
  const theme: any = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const save = useSave();

  const open = !!anchorEl;

  //! Function
  const handleDuplicate = async () => {
    setLoading(true);
    const toastId = toast.loading("Duplicating bot...", {
      isLoading: true,
      autoClose: false,
    });

    const callback = () => {
      save(
        cachedKeys.BOT,
        (rootState: any) => {
          const listBots = rootState?.[cachedKeys.BOT];
          const bot = listBots.find((bot: any) => bot.id === props.id);
          const newId = uuidv4();
          const newBot = {
            ...bot,
            id: newId,
            name: `${bot.name} - Copy `,
            lastEdit: new Date().toISOString(),
          };

          const newListBots = cloneDeep(listBots);
          newListBots.push(newBot);

          return newListBots;
        },
        true
      );
    };

    await processDelay(callback);

    toast.update(toastId, {
      isLoading: false,
      render: "Bot duplicated successfully!",
      type: "success",
      autoClose: 3000,
    });
    setLoading(false);
  };

  //! Render
  return (
    <Box onMouseLeave={() => setAnchorEl(null)}>
      <CommonStyles.Button
        isIcon
        className={anchorEl ? "" : "btnGroup"}
        onMouseEnter={(e) => {
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
        onBlur={() => setAnchorEl(null)}
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
            <CommonStyles.Button disabled={loading}>
              <CommonStyles.Typography
                type="semiBold14"
                color={theme.colors.custom.semiColorTypo}
              >
                Statistic
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <CommonStyles.Button disabled={loading} onClick={handleDuplicate}>
              <CommonStyles.Typography
                type="semiBold14"
                color={theme.colors.custom.semiColorTypo}
              >
                Duplicate
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <CommonStyles.Button disabled={loading}>
              <CommonStyles.Typography
                type="semiBold14"
                color={theme.colors.custom.colorErrorTypo}
              >
                Delete
              </CommonStyles.Typography>
            </CommonStyles.Button>
          </Paper>
        )}
      </Popper>
    </Box>
  );
}

export default MoreOption;
