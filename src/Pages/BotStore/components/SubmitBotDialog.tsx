import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Bot } from "@/Hooks/Bot/useGetListBot";
import usePulishBot from "@/Hooks/Bot/usePublishBot";
import { cn } from "@/lib/utils";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { Box, DialogContent, DialogTitle, useTheme } from "@mui/material";
import { isArray } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface SubmitBotDialogProps {
  data: Bot[];
  toggle: () => void;
}

const SubmitBotDialog = ({ data, toggle }: SubmitBotDialogProps) => {
  //! State
  const { t } = useTranslation("store");
  const theme = useTheme();
  const { userId } = useAuth();
  const handlePublish = usePulishBot();

  //! Function
  const handleClick = async (bot: Bot) => {
    if (handlePublish.isLoading) return;

    userId &&
      handlePublish.mutate({
        user_id: userId,
        bot_id: bot.bot_id,
      });
  };

  //! Render

  return (
    <Box>
      <DialogTitle>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={3}
        >
          <CommonStyles.Typography type="semiBold18">
            {t("botStore.submitBotDialog.title")}
          </CommonStyles.Typography>
          <CommonStyles.Button isIcon hasBorder={false} onClick={toggle}>
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>
      </DialogTitle>

      <DialogContent className="flex flex-col gap-3 p-[20px 28px]">
        {isArray(data) &&
          data.map((elm) => {
            return (
              <Box
                key={elm.bot_id}
                className={cn(
                  `flex items-center gap-4 px-2 py-3 rounded-md cursor-pointer`,
                  handlePublish.isLoading && "opacity-50"
                )}
                sx={{
                  transition: "background 0.3s",
                  "&:hover": {
                    background: theme.colors.custom.backgroundCard,
                  },
                }}
                onClick={() => handleClick(elm)}
              >
                <img
                  src={elm.avatar_url}
                  alt="bot"
                  className="w-12 h-12 min-w-12 min-h-12 rounded-sm"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-lg font-semibold font-[SegoeUI]">
                    {elm.bot_name}
                  </p>
                  <p className="text-sm truncate max-w-full opacity-70">
                    <span>{elm.description || "--  "}</span>
                    <span>
                      {t("botStore.submitBotDialog.createdAt")}:{" "}
                      {moment(elm.created_at).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </Box>
            );
          })}
      </DialogContent>
    </Box>
  );
};

export default SubmitBotDialog;
