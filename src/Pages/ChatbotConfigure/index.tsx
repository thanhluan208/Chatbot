import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CommonIcons from "../../Components/CommonIcons";

import Team from "../../assets/team.png";
import { useNavigate, useParams } from "react-router-dom";
import { useSave } from "../../Stores/useStore";
import { useEffect, useMemo, useState } from "react";
import Develop from "./components/Develop";
import useGetBotData from "../../Hooks/Bot/useGetBotData";
import cachedKeys from "../../Constants/cachedKeys";
import usePulishBot from "@/Hooks/Bot/usePublishBot";
import useRemoveBot from "@/Hooks/Bot/useRemoveBot";

function ChatbotConfigure() {
  //! State
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const save = useSave();
  const botId = params?.botId;
  const userId = params?.id;

  const payload = useMemo(() => {
    return {
      bot_id: botId,
      user_id: userId,
    };
  }, [botId, userId]);

  const [tab, setTab] = useState("develop");
  const {
    data: botData,
    isLoading,
    refetch,
  } = useGetBotData(
    payload as {
      bot_id: string;
      user_id: string;
    },
    !!botId && !!userId
  );

  const data = botData?.data;


  const isOwner = data?.permission_level === "owner";
  const isPublished = data?.bot_data.visibility === "public";

  const handlePublish = usePulishBot();
  const handleRemove = useRemoveBot();

  //! Function
  const handleClick = () => {
    if (handlePublish.isLoading || handleRemove.isLoading) return;

    !isPublished &&
      userId &&
      botId &&
      handlePublish.mutate({
        user_id: userId,
        bot_id: botId,
      });

    isPublished &&
      userId &&
      botId &&
      handleRemove.mutate({
        user_id: userId,
        bot_id: botId,
      });
  };

  useEffect(() => {
    save(cachedKeys.REFETCH_BOT_DATA, refetch);
  }, [refetch]);

  useEffect(() => {
    save(cachedKeys.BOT_DATA, data);
  }, [save, data]);

  useEffect(() => {
    return () => {
      save(cachedKeys.BOT_DATA, null);
    };
  }, []);

  //! Render
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <CommonStyles.LoadingOverlay
        isLoading={
          isLoading || handleRemove.isLoading || handlePublish.isLoading
        }
      />
      <Box
        sx={{
          height: "74px",
          padding: "16px",
          background: theme.colors.custom.backgroundCard,
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
            hasBorder={false}
            isRound={false}
            onClick={() => navigate(-1)}
          >
            <CommonIcons.ArrowBackIosNew />
          </CommonStyles.Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
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
                  {data?.bot_data?.bot_name}
                </CommonStyles.Typography>
                {/* <CommonStyles.Button
                  isIcon
                  hasBorder={false}
                  sx={{
                    padding: "4px",
                    width: "fit-content",
                    height: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <CommonIcons.BorderColor sx={{ width: 14, height: 14 }} />
                </CommonStyles.Button> */}
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
          {isOwner && (
            <CommonStyles.Button variant="contained" onClick={handleClick}>
              {isPublished ? "Remove from store" : "Publish to store"}
            </CommonStyles.Button>
          )}
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
          {/* <CommonStyles.Typography
            type={tab !== "develop" ? "bold18" : "semiBold18"}
            color={tab !== "develop" ? theme.palette.primary.main : ""}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setTab("analysis")}
          >
            Analysis
          </CommonStyles.Typography> */}
        </Box>
      </Box>
      {tab === "develop" && data && <Develop data={data?.bot_data} key={data?.bot_data?.mode} />}

      {/* {tab === "analysis" && <Analysis />} */}
    </Box>
  );
}

export default ChatbotConfigure;
