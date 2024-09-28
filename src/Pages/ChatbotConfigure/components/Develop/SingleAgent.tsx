import { Fragment, useState } from "react";
import Configure from "../Configure";
import { Box, useTheme } from "@mui/material";
import ChatField from "@/Pages/ChatBot/components/ChatField";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import CommonIcons from "@/Components/CommonIcons";
import InputBox from "@/Pages/ChatBot/components/InputBox";
import { AxiosResponse } from "axios";
import { CreateNewConversation } from "@/Pages/ChatBot/components/LeftSide";
import httpServices from "@/Services/httpServices";
import { clearConversation } from "@/Constants/api";
import { toast } from "react-toastify";
import { BotData } from "@/Hooks/Bot/useGetBotData";

const SingleAgent = () => {
  //! State
  const theme = useTheme();
  const [isBrandNew, setIsBrandNew] = useState(true);

  const data: BotData = useGet("BOT_DATA");
  const refetchHistory = useGet("REFETCH_LIST_CHAT");

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");

  //! Function
  const handleNewConversation = async () => {
    if (isBrandNew || !data?.all_conversation?.[0]) return;
    setIsBrandNew(true);
    try {
      const response: AxiosResponse<CreateNewConversation> =
        await httpServices.post(clearConversation, {
          conversation_id: data?.all_conversation?.[0],
        });

      if (response.data.status_code === 200 && response.data.conversation_id) {
        refetchHistory && (await refetchHistory());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new conversation");
    }
  };

  //! Render
  return (
    <Fragment>
      {/* <ConversationDrawer /> */}
      <Box
        id="wrapper"
        sx={{
          padding: "20px 35px 105px 20px",
          height: "calc(100vh - 74px - 64px)",
          position: "relative",
          width: "67vw",
          transition: "all 0.5s ease",
        }}
      >
        <Box
          id="scrollbar-chatbot"
          sx={{
            maxHeight: "100%",
            mask: "linear-gradient(180deg,#fff 91.89%,hsla(0,0%,100%,0))",
            paddingBottom: "30px",
            overflowY: "auto",
            position: "relative",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box
            sx={{
              maxWidth: "640px",
              display: "flex",
              alignItems: "center",
              paddingTop: isBrandNew ? "50px" : "0",
              flexDirection: "column",
              margin: "auto",
            }}
          >
            {isBrandNew && (
              <Fragment>
                <img
                  src={data?.avatar_url}
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: "8px",
                    marginBottom: "12px",
                    objectFit: "cover",
                  }}
                />
              </Fragment>
            )}
            <ChatField
              setIsBrandNew={setIsBrandNew}
              isBrandNew={isBrandNew}
              key={conversationId}
            />
          </Box>
        </Box>
        <Box
          id="textbox"
          sx={{
            paddingBottom: "20px",
            position: "absolute",
            width: "80%",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Box
            sx={{
              maxWidth: "640px",
              margin: "auto",
              position: "relative",
              display: "flex",
              alignItems: "end",
            }}
          >
            <CommonStyles.Button
              isIcon
              tooltip="New Conversation"
              isRound={false}
              sx={{
                left: "-20px",
                svg: {
                  width: 20,
                  height: 20,
                },
              }}
              disabled={isBrandNew}
              onClick={handleNewConversation}
            >
              <CommonIcons.Message />
            </CommonStyles.Button>
            {data && <InputBox setIsBrandNew={setIsBrandNew} botData={data} />}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "33vw",
          padding: "8px 10px 0 20px",
          borderLeft: `solid 0.5px ${theme.colors.custom.borderColor}`,
          background: theme.colors.custom.backgroundSecondary,
        }}
      >
        <Configure system_prompt={data?.system_prompt} />
      </Box>
    </Fragment>
  );
};

export default SingleAgent;
