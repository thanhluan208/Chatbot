import { Fragment, useState } from "react";
import Configure from "../Configure";
import { Box,  useTheme } from "@mui/material";
import ChatField from "@/Pages/ChatBot/components/ChatField";
import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import CommonIcons from "@/Components/CommonIcons";
import InputBox from "@/Pages/ChatBot/components/InputBox";
import ConversationDrawer from "@/Pages/ChatBot/components/ConversationDrawer";
import { AxiosResponse } from "axios";
import { CreateNewConversation } from "@/Pages/ChatBot/components/LeftSide";
import httpServices from "@/Services/httpServices";
import { newConversation } from "@/Constants/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import cachedKeys from "@/Constants/cachedKeys";

const SingleAgent = () => {
  //! State
  const theme = useTheme();
  const [isBrandNew, setIsBrandNew] = useState(true);
  const navigate = useNavigate();

  const save = useSave();
  const params = useParams();
  const botId = params?.botId;

  const { userId } = useAuth();

  const data: BotData = useGet("BOT_DATA");

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");

  //! Function
  const handleNewConversation = async () => {
    if (isBrandNew) return;
    setIsBrandNew(true);
    try {
      const response: AxiosResponse<CreateNewConversation> =
        await httpServices.post(newConversation, {
          bot_id: botId,
          user_id: userId,
        });

      if (response.data.status_code === 200 && response.data.conversation_id) {
        const isOwner = query.get("isOwner");
        navigate(
          window.location.pathname +
            `?isOwner=${isOwner}&conversation=${response.data.conversation_id}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new conversation");
    }
  };

  //! Render
  return (
    <Fragment>
      <ConversationDrawer />
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
        <CommonStyles.Button
          isIcon
          tooltip="Open Conversation"
          isRound={false}
          onClick={() => {
            save(cachedKeys.OPEN_CONVERSATION, true);
          }}
        >
          <CommonIcons.Note />
        </CommonStyles.Button>
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
                  src="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/FileBizType.BIZ_BOT_ICON/7342794110727701510_1724933118523505822_yxm0POQ2JJ.gif?lk3s=50ccb0c5&x-expires=1726843125&x-signature=33gB0Q3PT8%2FCKhBm3paQslW%2Fvzo%3D"
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: "8px",
                    marginBottom: "12px",
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
              display:'flex',
              alignItems:'end',
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
          background: theme.colors.custom.backgroundCard,
        }}
      >
        <Configure system_prompt={data?.system_prompt} />
      </Box>
    </Fragment>
  );
};

export default SingleAgent;
