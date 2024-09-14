import { Fragment, useState } from "react";
import PersonaAndPrompt from "../PersonaAndPrompt";
import Configure from "../Configure";
import { Box, useTheme } from "@mui/material";
import ChatField from "@/Pages/ChatBot/components/ChatField";
import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import CommonIcons from "@/Components/CommonIcons";
import InputBox from "@/Pages/ChatBot/components/InputBox";
import ConversationDrawer from "@/Pages/ChatBot/components/ConversationDrawer";

const SingleAgent = () => {
  //! State
  const theme = useTheme();
  const [isBrandNew, setIsBrandNew] = useState(true);
  const save = useSave();

  const data = useGet("BOT_DATA");

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");


  //! Function

  //! Render
  return (
    <Fragment>
      <ConversationDrawer />

      <Box flex={2} paddingRight="10px">
        <PersonaAndPrompt />
      </Box>
      <Box
        id="wrapper"
        sx={{
          padding: "20px 14px 105px 14px",
          height: "calc(100vh - 74px - 64)",
          position: "relative",
          width: "60vw",
          transition: "all 0.5s ease",
          [theme.breakpoints.down("lg")]: {
            flex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
            display: "flex",
            gap: "8px",
          }}
        >
          {/* <Memory />
            <Options /> */}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 100,
          }}
        >
          <CommonStyles.Button
            isIcon
            sx={{
              background: "#fff",
              padding: "8px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
            }}
            onClick={() => {
              save(cachedKeys.OPEN_CONVERSATION, true);
            }}
          >
            <CommonIcons.Note />
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
                  src="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/FileBizType.BIZ_BOT_ICON/7342794110727701510_1724933118523505822_yxm0POQ2JJ.gif?lk3s=50ccb0c5&x-expires=1726843125&x-signature=33gB0Q3PT8%2FCKhBm3paQslW%2Fvzo%3D"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
              </Fragment>
            )}
            <ChatField setIsBrandNew={setIsBrandNew} isBrandNew={isBrandNew} key={conversationId}/>
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
            background: "#fff",
          }}
        >
          <Box
            sx={{
              maxWidth: "640px",
              margin: "auto",
              position: "relative",
            }}
          >
            <CommonStyles.Button
              isIcon
              sx={{
                position: "absolute",
                bottom: "10px",
                left: "-40px",
                svg: {
                  width: 20,
                  height: 20,
                },
              }}
            >
              <CommonIcons.Message />
            </CommonStyles.Button>
            {data && <InputBox setIsBrandNew={setIsBrandNew} botData={data} />}
          </Box>
        </Box>
      </Box>
      <Box flex={2} padding="8px 10px 0 20px">
        <Configure />
      </Box>
    </Fragment>
  );
};

export default SingleAgent;
