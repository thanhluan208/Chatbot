import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import TextBox, { TextBoxType } from "./TextBox";
import { useGet } from "@/Stores/useStore";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import { Role } from "@/Hooks/Bot/useGetBotChatHistory";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useMemo } from "react";
import { modelOptions } from "@/Constants/options";

const ChatBox = ({
  id,
  avatar,
  name,
  content,
  type,
  isByRole,
}: {
  id: string;
  avatar: string;
  name: string;
  content?: string;
  isByRole?: boolean;
  type?: TextBoxType;
}) => {
  //! State
  const botData: BotData = useGet("BOT_DATA");
  const { userData } = useAuth();

  const avatarRender = useMemo(() => {
    if (avatar && !isByRole) return avatar;
    if (name === Role.User)
      return "https://www.w3schools.com/w3images/avatar2.png";
    return (
      modelOptions.find((elm) => elm.value === botData?.llm?.model)?.img ||
      "https://www.w3schools.com/w3images/avatar2.png"
    );
  }, [botData, isByRole, name]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
      }}
    >
      <img
        src={avatarRender}
        style={{ width: "32px", height: "32px", borderRadius: "50%" }}
      />
      <Box>
        <CommonStyles.Typography sx={{ marginBottom: "8px" }}>
          {isByRole
            ? name === Role.Assistant
              ? botData?.bot_name
              : userData?.user_name
            : name}
        </CommonStyles.Typography>
        <TextBox
          id={id}
          text={content || ""}
          type={type || TextBoxType.USER_CHAT}
        />
      </Box>
    </Box>
  );
};

export default ChatBox;
