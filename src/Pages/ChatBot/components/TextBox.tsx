import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { isString } from "lodash";
import { useEffect, useMemo } from "react";

interface TextBoxProps {
  id: string;
  text: string;
  type?: TextBoxType;
  onClick?: () => void;
  shouldAnimation?: boolean;
}

export enum TextBoxType {
  INIT_CHAT = "INIT_CHAT",
  BOT_HINT_CHAT = "BOT_HINT_CHAT",
  USER_CHAT = "USER_CHAT",
  BOT_CHAT = "BOT_CHAT",
  ERROR = "ERROR",
}

export interface Data {
  id: string;
  status: string;
  type: string;
  msg: string;
}

const TextBox = ({
  id,
  text,
  type = TextBoxType.INIT_CHAT,
  onClick,
}: TextBoxProps) => {
  //! State
  const data: Data = useGet(`chat-${id}` as any);
  const theme = useTheme()

  const botType = data ? data.type : type;

  const styles = useMemo(() => {
    switch (botType) {
      case TextBoxType.ERROR:
        return {
          background: "#f6d2d2",
          color: "#f00",
        };
      case TextBoxType.BOT_CHAT:
        return {
          background: theme.colors.custom.backgroundSecondary,
        };
      case TextBoxType.USER_CHAT:
        return {
          background: "#9498f770",
        };
      case TextBoxType.INIT_CHAT:
        return {
          background: "#0607090a",
        };
      case TextBoxType.BOT_HINT_CHAT:
        return {
          border: "1px solid #0607090a",
          background: "#fff",
          "&:hover": {
            background: "#0607091a",
          },
          cursor: "pointer",
        };
      default:
        return {};
    }
  }, [botType]);

  //! Function

  const renderContent = () => {
    if (!data) return <CommonStyles.Typography sx={{
      whiteSpace: "pre-line"
    }}>{text}</CommonStyles.Typography>;
    switch (data.status) {
      case "pending":
        return <CircularProgress size={14} />;
      case "responding":
        return (
          <CommonStyles.Typography sx={{
            whiteSpace: "pre-line"
          }}>
            <span id={data.id}></span>{" "}
            <CircularProgress size={14} sx={{ marginLeft: "4px" }} />
          </CommonStyles.Typography>
        );
      case "responded":
        return (
          <CommonStyles.Typography sx={{
            whiteSpace: "pre-line"
          }}>
            <span id={data.id}></span>
          </CommonStyles.Typography>
        );
      default:
        return <CommonStyles.Typography sx={{
          whiteSpace: "pre-line"
        }}>{text}</CommonStyles.Typography>;
    }
  };

  //! Render
  useEffect(() => {
    if (data && isString(data?.msg)) {
      const formattedMsg = data.msg.replace(/<break_line>/g, "<br>");

      const element = document.getElementById(data.id);
      if (element) {
        element.innerHTML = formattedMsg;
      }
    }
  }, [data?.msg, data?.id]);

  return (
    <Box
      sx={{
        ...styles,
        padding: "12px 16px",
        width: "fit-content",
        borderRadius: "8px",
      }}
      onClick={onClick}
    >
      {renderContent()}
    </Box>
  );
};

export default TextBox;
