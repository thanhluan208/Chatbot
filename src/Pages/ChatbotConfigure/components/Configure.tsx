import CommonStyles from "@/Components/CommonStyles";
import { configures } from "../../../Constants/options";
import Section from "./Configure/Section";
import { Box } from "@mui/material";
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
        overflow: "hidden",
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
          />
        </Box>
      </CommonStyles.CollapseArea>
      {configures.map((conf) => {
        return (
          <Section title={conf.title} items={conf.items} key={conf.title} />
        );
      })}
    </Box>
  );
};

export default Configure;
