import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CommonIcons from "../../Components/CommonIcons";

import Team from "../../assets/team.png";
import { useNavigate, useParams } from "react-router-dom";
import {  useSave } from "../../Stores/useStore";
import { useEffect, useState } from "react";
import Develop from "./components/Develop";
import Analysis from "./components/Analysis";
import useGetBotData from "../../Hooks/Bot/useGetBotData";
import cachedKeys from "../../Constants/cachedKeys";

interface IChatbotConfigure {}

function ChatbotConfigure(props: IChatbotConfigure) {
  //! State
  const {} = props;
  const theme: any = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const save = useSave();
  const botId = params?.botId;

  const [tab, setTab] = useState("develop");
  const {  isLoading, refetch } = useGetBotData(botId, !!botId);


  //! Function
  useEffect(() => {
    save(cachedKeys.REFETCH_BOT_DATA, refetch);
  }, [refetch]);

  //! Render
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          height: "74px",
          padding: "16px",
          background: theme.colors.custom.backgroundSecondary,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
          }}
        >
          <CommonStyles.Button
            isIcon
            sx={{
              padding: "8px",
              borderRadius: "8px",
            }}
            onClick={() => navigate(-1)}
          >
            <CommonIcons.ArrowBackIosNew />
          </CommonStyles.Button>

          <Box>
            <img
              src={Team}
              alt="Team"
              style={{
                height: "32px",
                width: "32px",
                borderRadius: "8px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CommonStyles.Typography type="semiBold14">
                  hehe
                </CommonStyles.Typography>
                <CommonStyles.Button
                  isIcon
                  sx={{
                    padding: "4px",
                    width: "fit-content",
                    height: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <CommonIcons.BorderColor sx={{ width: 14, height: 14 }} />
                </CommonStyles.Button>
              </Box>
              <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <CommonIcons.Person sx={{ width: 12, height: 12 }} />
                <CommonStyles.Typography type="normal12">
                  Personal
                </CommonStyles.Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "24px",
          }}
        >
          <CommonStyles.Button
            isIcon
            sx={{
              borderRadius: "8px",
              border: `1px solid ${theme.colors.custom.colorDisabledTypo}`,
            }}
          >
            <CommonIcons.Restore />
          </CommonStyles.Button>
          <CommonStyles.Button variant="contained" sx={{ width: "96px" }}>
            Publish
          </CommonStyles.Button>
        </Box>
        <Box
          display={"flex"}
          gap={"16px"}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <CommonStyles.Typography
            type={tab === "develop" ? "bold18" : "semiBold18"}
            color={tab === "develop" ? theme.palette.primary.main : ""}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setTab("develop")}
          >
            Develop
          </CommonStyles.Typography>
          <CommonStyles.Typography
            type={tab !== "develop" ? "bold18" : "semiBold18"}
            color={tab !== "develop" ? theme.palette.primary.main : ""}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setTab("analysis")}
          >
            Analysis
          </CommonStyles.Typography>
        </Box>
      </Box>
      {tab === "develop" && <Develop />}

      {tab === "analysis" && <Analysis />}
    </Box>
  );
}

export default ChatbotConfigure;
