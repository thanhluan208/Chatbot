import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Bot } from "@/Hooks/Bot/useGetListBot";
import { Box, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

interface SubmitBotDialogProps {
  data: Bot[];
  toggle: () => void;
}

const SubmitBotDialog = ({ data, toggle }: SubmitBotDialogProps) => {
  //! State
  const { t } = useTranslation("store");

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

      <DialogContent
        sx={{
          padding: "20px 28px",
        }}
      >
        
      </DialogContent>
    </Box>
  );
};

export default SubmitBotDialog;
