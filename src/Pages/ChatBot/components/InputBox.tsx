import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { useId, useRef, useState } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { chatBot } from "@/Constants/api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useSave } from "@/Stores/useStore";
import { v4 as uuid } from "uuid";
import cachedKeys from "@/Constants/cachedKeys";
import { TextBoxType } from "./TextBox";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import { modelOptions } from "@/Constants/options";

interface InputBoxProps {
  setIsBrandNew: React.Dispatch<React.SetStateAction<boolean>>;
  botData: BotData
}

export interface BotResponse {
  data: string;
  event: string;
  id: string;
}

const REQUEST_TIMEOUT_MS = 60;

const InputBox = ({ setIsBrandNew, botData }: InputBoxProps) => {
  //! State
  const id = useId();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const params = useParams();
  const { userId, userData } = useAuth();
  const save = useSave();
  const botId = params.botId;

  const controller = new AbortController();

  const abortFetch = (id?: string, reason?: string) => {
    console.log("reason", reason);
    if (controller) {
      controller.abort();
    }
    setLoading(false);
    id &&
      save(`chat-${id}`, {
        id: id,
        status: "responded",
        type: TextBoxType.ERROR,
        msg: "Sorry, I'm having trouble processing your request.",
      });
  };

  const requestTimeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  //! Function
  const handleSubmit = async () => {
    if (loading || !botId || !userId || !text) return;

    setLoading(true);
    setIsBrandNew(false);
    setText("");

    const id = uuid();
    const idUser = uuid();
    save(
      cachedKeys.LIST_CHAT,
      (state: any) => {
        const chats = state[cachedKeys.LIST_CHAT] || [];
        return [
          ...chats,
          {
            id: idUser,
            avatar: "https://www.w3schools.com/w3images/avatar2.png",
            name: userData?.user_name || "User",
          },
          {
            id: id,
            avatar: modelOptions.find((elm) => elm.value === botData.llm.model)?.img || "https://www.w3schools.com/w3images/avatar2.png",
            name: botData.bot_name,
          },
        ];
      },
      true
    );
    save(`chat-${idUser}`, {
      id: idUser,
      status: "responded",
      type: TextBoxType.USER_CHAT,
      msg: text,
    });
    save(`chat-${id}`, {
      id: id,
      status: "pending",
      type: TextBoxType.BOT_CHAT,
    });
    let botResponse = "";
    let count = 0;
    let isFinished = false;
    let interval: NodeJS.Timeout;

    fetchEventSource(chatBot, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        bot_id: botId,
        user_id: userId,
        query: text,
      }),
      signal: controller.signal,

      async onopen(response) {
        clearTimeout(requestTimeoutId);
        const contentType = response.headers.get("content-type");
        console.log("success get resp", contentType, response);
      },
      onmessage(msg: BotResponse) {
        console.log(msg);
        if (msg.event === "done") {
          isFinished = true;
          return;
        }
        botResponse += `${msg.data} `;
        if (!interval) {
          interval = setInterval(() => {
            const text = botResponse.slice(0, count);
            count++;
            save(`chat-${id}`, {
              id: id,
              status: "responding",
              type: TextBoxType.BOT_CHAT,
              msg: text,
            });
            if (count > botResponse.length && isFinished) {
              clearInterval(interval);
              save(`chat-${id}`, {
                id: id,
                status: "responded",
                type: TextBoxType.BOT_CHAT,
                msg: botResponse,
              });
            }
          }, 20);
        }
      },
      onclose() {
        abortFetch(undefined, "Connection closed by server.");
        isFinished = true;
        save(`chat-${id}`, {
          id: id,
          status: "responded",
          type: TextBoxType.BOT_CHAT,
          msg: botResponse,
        });
        // You may want to handle cleanup here
      },
      onerror(err) {
        abortFetch(id, "There was an error from server" + JSON.stringify(err));
        interval && clearInterval(interval);
      },
    });
  };

  //! Render
  return (
    <form
      style={{
        width: "100%",
      }}
    >
      <Box
        id={id}
        onFocus={() => {
          const element = document.getElementById(id);
          if (element) {
            element.style.border = "1px solid #060709";
          }
        }}
        onBlur={() => {
          const element = document.getElementById(id);
          if (element) {
            element.style.border = "1px solid #0607090a";
          }
        }}
        sx={{
          padding: "8px 8px 8px 20px",
          borderRadius: "16px",
          border: "1px solid #0607090a",
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "end",
          textarea: {
            border: "none",
            resize: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "14px",
            height: text ? "auto" : "24px",
            overflow: "hidden",
            width: "100%",
          },
        }}
      >
        <PerfectScrollBar
          style={{
            maxHeight: "105px",
            width: "100%",
            paddingRight: "20px",
          }}
        >
          <textarea
            disabled={loading}
            ref={textAreaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && text) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onChange={(e) => {
              setText(e.target.value);
              textAreaRef.current!.style.height =
                textAreaRef.current!.scrollHeight + "px";
              const textBox = document.getElementById("textbox");
              const wrapper = document.getElementById("wrapper");

              if (textBox && wrapper) {
                wrapper.style.padding = `20px 14px ${Math.min(
                  textBox.getBoundingClientRect().height,
                  155
                )}px 14px`;
              }

              if (!e.target.value) {
                e.target.style.height = "24px";
              }
            }}
            value={text}
          />
        </PerfectScrollBar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            svg: {
              width: 20,
              height: 20,
            },
          }}
        >
          <CommonStyles.Button isIcon>
            <CommonIcons.AddCircle />
          </CommonStyles.Button>
          <Box
            sx={{
              height: "20px",
              width: "1px",
              background: "#0607090a",
              margin: "0 8px",
            }}
          />
          <CommonStyles.Button
            isIcon
            disabled={!text || loading}
            onClick={handleSubmit}
          >
            <CommonIcons.Send />
          </CommonStyles.Button>
        </Box>
      </Box>
    </form>
  );
};

export default InputBox;
