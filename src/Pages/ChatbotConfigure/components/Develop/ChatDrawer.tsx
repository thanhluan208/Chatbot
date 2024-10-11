import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { clearConversation } from "@/Constants/api";
import cachedKeys from "@/Constants/cachedKeys";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import ChatField from "@/Pages/ChatBot/components/ChatField";
import InputBox from "@/Pages/ChatBot/components/InputBox";
import { CreateNewConversation } from "@/Pages/ChatBot/components/LeftSide";
import httpServices from "@/Services/httpServices";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer, useTheme } from "@mui/material";
import { AxiosResponse } from "axios";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChatDrawer() {
  //! State
  const openDrawer = useGet("OPEN_CHAT");
  const save = useSave();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isBrandNew, setIsBrandNew] = useState(true);

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");

  const data: BotData = useGet("BOT_DATA");
  //! Function
  const handleClose = (_: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick") return;
    save(cachedKeys.OPEN_CHAT, false);
  };

  const handleNewConversation = async () => {
    if (isBrandNew || !data?.all_conversation?.[0]) return;
    setIsBrandNew(true);
    try {
      const response: AxiosResponse<CreateNewConversation> =
        await httpServices.post(clearConversation, {
          conversation_id: data?.all_conversation?.[0],
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
    <Drawer
      variant="persistent"
      anchor="right"
      open={openDrawer}
      onClose={handleClose}
      hideBackdrop
    >
      <Box
        id="wrapper"
        sx={{
          width: "50vw",
          padding: "60px 14px 105px 14px",
          height: "100vh",
          background: theme.colors.custom.backgroundCard,
          transition: "all 0.5s ease",
          position: "relative",
        }}
        role="presentation"
      >
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 100,
            display: "flex",
            gap: "8px",
            button: {
              background: theme.colors.custom.backgroundCard,
              padding: "8px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
            },
          }}
        >
          <CommonStyles.Button
            isIcon
            className="iconButton"
            onClick={() => {
              save(cachedKeys.OPEN_CHAT, false);
            }}
          >
            <CommonIcons.Close />
          </CommonStyles.Button>
        </Box>
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
            width: "100%",
            bottom: 0,
            left: 0,
          }}
        >
          <Box
            sx={{
              maxWidth: "640px",
              margin: "auto",
              position: "relative",
              width: "80%",
              display: "flex",
              alignItems: "end",
            }}
          >
            <CommonStyles.Button
              isIcon
              sx={{
                bottom: "10px",
                left: "-40px",
                svg: {
                  width: 20,
                  height: 20,
                },
              }}
              disabled={isBrandNew}
              isRound={false}
              tooltip="New conversation"
              onClick={handleNewConversation}
            >
              <CommonIcons.Message />
            </CommonStyles.Button>
            {data && <InputBox setIsBrandNew={setIsBrandNew} botData={data} />}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
