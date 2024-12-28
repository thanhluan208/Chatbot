import CommonStyles from "@/Components/CommonStyles";
import { configures } from "../../../Constants/options";
import Section from "./Configure/Section";
import { Box, useTheme } from "@mui/material";
import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { updatePrompt } from "@/Constants/api";
import { toast } from "react-toastify";

const Configure = ({ system_prompt }: { system_prompt: string }) => {
  //! State
  const params = useParams();
  const botId = params?.botId;
  const { userId } = useAuth();
  const timeoutRef = useRef<any>(null);
  const theme = useTheme();

  //! Function
  const afterOnChangePrompt = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updatePrompt, {
            bot_id: botId,
            user_id: userId,
            system_prompt: event.target.value,
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, userId]
  );

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        border: `solid 1px ${theme.colors.custom.borderColor}`,
        borderRadius: "8px",
        padding: "12px 16px",
        height: "calc(100vh - 74px - 104px)",
        maxHeight: "100%",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <CommonStyles.CollapseArea
        sxContainer={{
          marginTop: "12px",
          "& .collapse-header": {
            marginBottom: "0",
          },
        }}
        label={
          <CommonStyles.Typography type="bold14">
            Persona & Prompt
          </CommonStyles.Typography>
        }
      >
        <Box
          sx={{
            padding: "12px 0",
            textarea: {
              padding: `12px 16px!important`,
            },
          }}
        >
          <CommonStyles.Input
            initValue={system_prompt}
            key={system_prompt}
            id="personaAndPrompt"
            name="personaAndPrompt"
            fullWidth
            multiline
            placeholder="Design the bot's persona, features and workflows using natural language."
            rows={5}
            autoFocus
            sx={{
              div: {
                background: "transparent",
              },
            }}
            afterOnchange={afterOnChangePrompt}
            maxChar={2048}
          />
        </Box>
      </CommonStyles.CollapseArea>
      {configures.map((conf) => {
        return (
          <Section title={conf.title} items={conf.items} key={conf.title} type={conf.type}/>
        );
      })}
    </Box>
  );
};

export default Configure;
