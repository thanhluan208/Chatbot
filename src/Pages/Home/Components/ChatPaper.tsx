import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import { cloneDeep, isEmpty } from "lodash";
import { v4 as uuid } from "uuid";

export interface IChatPaper {
  id: number;
  hint: string[];
  name: string;
  isBot?: boolean;
  avatar: string;
  content: string;
  hasFooter?: boolean;
  setChatData: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        isBot?: boolean;
        hint: string[];
        name: string;
        avatar: string;
        content: string;
      }[]
    >
  >;
}

function ChatPaper(props: IChatPaper) {
  //! State
  const { avatar, content, hint, name, isBot, setChatData } = props;
  const theme: any = useTheme();

  //! Function
  const handleClickHint = (item: string) => {
    const newChat = {
      id: uuid(),
      hint: [],
      name: "Thanh Luan",
      avatar:
        "https://lh3.googleusercontent.com/ogw/AF2bZyiUe-0HqdEyjNfKkkYM8ULbAwTiS0y9gqiDuJ8cvadeXw=s32-c-mo",
      content: item,
    };

    setChatData((prev) => {
      const newListChats = cloneDeep(prev);
      newListChats[newListChats.length - 1].hint = [];
      newListChats.push(newChat as any);

      return newListChats;
    });
  };

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        width: "100%",
        mt: "16px",
      }}
    >
      <Box>
        <img
          src={avatar}
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      </Box>
      <Box
        sx={{
          width: "calc(100% - 30px - 12px)",
        }}
      >
        <CommonStyles.Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {name}
        </CommonStyles.Typography>
        <Box
          sx={{
            background: isBot
              ? "#fff"
              : "linear-gradient(269deg,#a171ff -3.63%,#5d66ff 100.38%)",
            borderRadius: "12px",
            padding: "12px",
            mt: "8px",
            width: "fit-content",
            color: isBot ? "#000" : "#fff",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></Box>

        {!isEmpty(hint) && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              mt: "16px",
            }}
          >
            {hint.map((item, index) => {
              return (
                <CommonStyles.Button
                  onClick={() => handleClickHint(item)}
                  key={item + index}
                  sx={{
                    padding: "8px 16px",
                    width: "fit-content",
                    background: theme.colors.custom.backgroundButtonHover,
                  }}
                >
                  <CommonStyles.Typography type="normal14">
                    {item}
                  </CommonStyles.Typography>
                </CommonStyles.Button>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ChatPaper;
