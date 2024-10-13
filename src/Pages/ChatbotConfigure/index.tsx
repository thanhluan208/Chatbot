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
import { toast } from "react-toastify";
import httpServices from "@/Services/httpServices";
import { publishBot, removeBotFromStore } from "@/Constants/api";

function ChatbotConfigure() {
  //! State
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const save = useSave();
  const botId = params?.botId;
  const userId = params?.id;

  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => {
    return {
      bot_id: botId,
      user_id: userId,
    };
  }, [botId, userId]);

  const [tab, setTab] = useState("develop");
  const { data, isLoading, refetch } = useGetBotData(
    payload as {
      bot_id: string;
      user_id: string;
    },
    !!botId && !!userId
  );

  const isOwner = data?.permission_level === "owner";
  const isPublished = data?.visibility === "public";

  //! Function

  const handlePublish = async () => {
    setLoading(true);
    const toastId = toast.loading("Publishing...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.post(publishBot, {
        user_id: userId,
        bot_id: botId,
      });

      await refetch();

      toast.update(toastId, {
        render: response?.data?.message ?? "Published successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setLoading(false);
    } catch (error) {
      console.log("err", error);
      toast.update(toastId, {
        render: "Publish failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const toastId = toast.loading("Removing...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.post(removeBotFromStore, {
        user_id: userId,
        bot_id: botId,
      });

      await refetch();

      toast.update(toastId, {
        render: "Removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setLoading(false);
    } catch (error) {
      console.log("err", error);
      toast.update(toastId, {
        render: "Remove failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      setLoading(false);
    }
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
      <CommonStyles.LoadingOverlay isLoading={isLoading || loading} />
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
                  {data?.bot_name}
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
            <CommonStyles.Button
              variant="contained"
              onClick={isPublished ? handleRemove : handlePublish}
            >
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
      {tab === "develop" && data && <Develop data={data} key={data?.mode} />}

      {/* {tab === "analysis" && <Analysis />} */}
    </Box>
  );
}

export default ChatbotConfigure;
