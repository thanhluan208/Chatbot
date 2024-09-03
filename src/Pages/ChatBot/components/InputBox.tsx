import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { useId, useRef, useState } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";

interface InputBoxProps {
  onSubmit: (text: string) => void;
}

const InputBox = ({  }: InputBoxProps) => {
  //! State
  const id = useId()
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  //! Function

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
            ref={textAreaRef}
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
          <CommonStyles.Button isIcon disabled={!text}>
            <CommonIcons.Send />
          </CommonStyles.Button>
        </Box>
      </Box>
    </form>
  );
};

export default InputBox;
