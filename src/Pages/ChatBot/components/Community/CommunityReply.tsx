import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import { Box, ClickAwayListener, Fade, Popper, useTheme } from "@mui/material";
import React, { useId, useRef } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";
import { v4 as uuidv4 } from "uuid";

export const DiscardReply = ({
  setText,
  onCancel,
  DeleteButton,
}: {
  setText?: (text: string) => void;
  onCancel?: () => void;
  DeleteButton?: React.ReactNode;
}) => {
  //! State
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const theme = useTheme()

  //! Function

  //! Render
  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null);
      }}
    >
      <Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  background: theme.colors.custom.backgroundDialog,
                  marginTop: "12px ",
                  maxWidth: "300px",
                }}
              >
                <CommonStyles.Typography type="semiBold14">
                  Do you want to discard this reply?
                </CommonStyles.Typography>
                <CommonStyles.Typography type="normal12" color="#06070980">
                  You have a comment in progress. After discarding, the draft
                  will not be saved. Are you sure you want to discard it?
                </CommonStyles.Typography>

                <CommonStyles.Button
                  sx={{
                    marginTop: "12px",
                    background: "#f22435",
                    color: "#fff",
                    "&:hover": {
                      background: "#f22435",
                    },
                  }}
                  onClick={() => {
                    setText && setText("");
                    setAnchorEl(null);
                    onCancel && onCancel();
                  }}
                >
                  Discard
                </CommonStyles.Button>
              </Box>
            </Fade>
          )}
        </Popper>
        {
          <CommonStyles.Button
            variant="outlined"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
            sx={{ color: "unset" }}
          >
            {DeleteButton || "Cancel"}
          </CommonStyles.Button>
        }
      </Box>
    </ClickAwayListener>
  );
};

interface ICommunityReply {
  onSubmit?: (text: string) => void;
  onCancel?: () => void;
}

const CommunityReply = (props: ICommunityReply) => {
  //! State
  const { onSubmit, onCancel } = props;
  const [text, setText] = React.useState("");
  const id = useId();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const save = useSave();

  //! Function
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(text);
      return;
    }
    save(
      cachedKeys.COMMUNITY_COMMENT,
      (state: any) => {
        const comments = state[cachedKeys.COMMUNITY_COMMENT] || [];
        return [
          ...comments,
          {
            id: uuidv4(),
            comment: text,
            date: new Date(),
            user: "Luan Dang",
          },
        ];
      },
      true
    );
    setText("");
    textAreaRef.current!.style.height = "24px";
  };

  //! Render
  return (
    <Box
      id={id}
      onClick={() => {
        textAreaRef.current?.focus();
      }}
      onFocus={() => {
        const element = document.getElementById(id);
        if (element) {
          element.style.border = "1px solid #060709";
        }
        textAreaRef.current?.focus();
      }}
      onBlur={() => {
        const element = document.getElementById(id);
        if (element) {
          element.style.border = "1px solid #0607090a";
        }
      }}
      sx={{
        cursor: "text",
        padding: "8px 8px 8px 20px",
        borderRadius: "16px",
        border: "1px solid #0607090a",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "end",
        marginTop: "20px",
        position: "relative",
        textarea: {
          border: "none",
          resize: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "inherit",
          fontSize: "14px",
          height: text ? "fit-content" : "24px",
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
          height: text ? "fit-content" : "24px",
        }}
      >
        <textarea
          ref={textAreaRef}
          onChange={(e) => {
            if (e.target.value.length > 4000) return;
            if (e.target.value === "") {
              textAreaRef.current!.style.height = "24px";
              setText(e.target.value);
              return;
            }
            setText(e.target.value);
            textAreaRef.current!.style.height =
              textAreaRef.current!.scrollHeight + "px";
          }}
          value={text}
        />
      </PerfectScrollBar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "8px",
        }}
      >
        <CommonStyles.Typography type="normal12">{`${text.length}/4000`}</CommonStyles.Typography>
      </Box>
      {text.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            right: "0",
            bottom: "-40px",
            display: "flex",
            gap: "8px",
          }}
        >
          <DiscardReply setText={setText} onCancel={onCancel} />
          <CommonStyles.Button variant="contained" onClick={handleSubmit}>
            Send
          </CommonStyles.Button>
        </Box>
      )}
    </Box>
  );
};

export default CommunityReply;
