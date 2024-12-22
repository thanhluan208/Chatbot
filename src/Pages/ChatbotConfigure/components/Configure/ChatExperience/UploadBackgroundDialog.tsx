import { Box, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import { useState } from "react";
import useUploadBotBackground from "@/Hooks/Bot/useUploadBotBackground";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useParams } from "react-router-dom";

interface IUploadBackgroundDialog {
  toggle: () => void;
}

const UploadBackgroundDialog = (props: IUploadBackgroundDialog) => {
  //! State
  const { toggle } = props;
  const [background, setBackground] = useState<File | null>(null);
  const { mutate, isLoading } = useUploadBotBackground();
  const { userId } = useAuth();
  const { botId } = useParams();

  //! Function
  const handleUploadBackground = () => {
    if (isLoading || !botId || !userId) return;
    mutate({
      bot_id: botId,
      file_input: background as File,
      user_id: userId,
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
            Upload background
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
        <CommonStyles.UploadFile
          label={"Upload background"}
          files={background ? [background] : undefined}
          dropzoneProps={{
            onDrop: (acceptedFiles) => {
              setBackground(acceptedFiles[0]);
            },
          }}
          shouldShowImg
        />

        <div className="flex justify-end mt-3" onClick={handleUploadBackground}>
          <CommonStyles.Button variant="contained">
            <CommonStyles.Typography type="semiBold16">
              Upload
            </CommonStyles.Typography>
          </CommonStyles.Button>
        </div>
      </DialogContent>
    </Box>
  );
};

export default UploadBackgroundDialog;
