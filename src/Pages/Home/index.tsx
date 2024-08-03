import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import ChatFrame from "./Components/ChatFrame";
import InputChat from "./Components/Inputchat";

interface IHome {}

function Home(props: IHome) {
  //! State
  const {} = props;
  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        paddingTop: "20px",

        background:
          'url("https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/obric/coze/static/image/coze_home_bg.88e1d4d3.png") 50% / cover no-repeat',
      }}
    >
      <Box
        sx={{
          maxHeight: "calc(100vh - 130px)",
          marginBottom: "10px",
          overflowY: "auto",
        }}
      >
        <CommonStyles.Typography type="bold56" textAlign={"center"} mt="36px">
          Welcome to Coze
        </CommonStyles.Typography>
        <CommonStyles.Typography
          type="bold32"
          textAlign={"center"}
          sx={{
            color: theme.palette.primary.main,
          }}
        >
          Create your own AI bot
        </CommonStyles.Typography>

        <ChatFrame />
      </Box>

      <InputChat />
    </Box>
  );
}

export default Home;
