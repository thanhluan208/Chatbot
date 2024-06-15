interface IChatFrame {}
import { Box } from "@mui/material";
import Coze from "../../../assets/coze.png";
import { isEmpty } from "lodash";
import ChatPaper from "./ChatPaper";
import { useState } from "react";

const data = [
  {
    id: 1,
    isBot: true,
    hint: [
      "How does Plugin work in Coze",
      "I want to create bot",
      "How to use workflow? Do you have any examples?",
    ],
    name: "Coze Assistant",
    avatar: Coze,
    content:
      "<h1 id='hi-welcome-aboard-🎉' class='header_36220 auto-hide-last-sibling-br'>Hi, welcome aboard 🎉</h1><br class='container_e695a wrapper_ad07b undefined'><div class='auto-hide-last-sibling-br paragraph_1252f paragraph-element'>Coze is a next-generation AI Bot development platform. Coze enables users with all levels of programming experience to create various chatbots and deploy them across social platforms and messaging apps like <em>Discord, Telegram, LINE &amp; Slack</em>!</div><br class='container_e695a wrapper_ad07b undefined'><div class='auto-hide-last-sibling-br paragraph_1252f paragraph-element'>Don't forget to drop by <a class='link_da148' href='https://www.coze.com/store/bot' target='_blank'>Bot Store</a> any time. You'll be amazed at the incredible bots other developers have created ⚡️</div><br class='container_e695a wrapper_ad07b undefined'><div class='auto-hide-last-sibling-br paragraph_1252f paragraph-element'>At Coze Home, I can discuss a variety of topics with you 💬, so always feel free to reach out! You can also <strong>type @ to chat with bots</strong> you've added to favorites in the Bot Store, and even get multiple bots to collaborate on tasks 🤝</div><br class='container_e695a wrapper_ad07b undefined'><div class='auto-hide-last-sibling-br paragraph_1252f paragraph-element'>What's more, if you're feeling inspired, just type <em><strong>'I want to create a bot'</strong></em> and I can help you do it 💪</div><br class='container_e695a wrapper_ad07b undefined'>",
  },
];

function ChatFrame(props: IChatFrame) {
  //! State
  const {} = props;
  const [chatData, setChatData] = useState(data);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "50%",
        margin: "0 auto",
        paddingBottom: "32px",
      }}
    >
      {!isEmpty(data) &&
        chatData?.map((item) => {
          return (
            <ChatPaper key={item.id} {...item} setChatData={setChatData} />
          );
        })}
    </Box>
  );
}

export default ChatFrame;
