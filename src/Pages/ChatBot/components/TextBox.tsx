import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { useMemo } from "react";

interface TextBoxProps {
  text: string;
  type?: TextBoxType;
  onClick?: () => void;
}

export enum TextBoxType {
  INIT_CHAT = "INIT_CHAT",
  BOT_HINT_CHAT = "BOT_HINT_CHAT",
}

const TextBox = ({ text, type = TextBoxType.INIT_CHAT, onClick }: TextBoxProps) => {
  //! State
  const styles = useMemo(() => {
    switch (type) {
      case TextBoxType.INIT_CHAT:
        return {
            background:"#0607090a"
        }
        case  TextBoxType.BOT_HINT_CHAT:
            return {
                border: "1px solid #0607090a",
                background: "#fff",
                "&:hover": {
                    background:"#0607091a"
                },
                cursor: "pointer",
            }
      default:
        return {};
    }
  }, [type]);

  //! Function

  //! Render
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
      <CommonStyles.Typography>{text}</CommonStyles.Typography>
    </Box>
  );
};

export default TextBox;