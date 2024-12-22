import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import InputBox from "./components/InputBox";
import Options from "./components/Options";
import { useGet, useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import CommunityDrawer from "./components/Community/CommunityDrawer";
import { useEffect, useMemo, useState } from "react";
import useGetBotData from "@/Hooks/Bot/useGetBotData";
import ChatField from "./components/ChatField";
import { CreateNewConversation } from "./components/LeftSide";
import ConversationDrawer from "./components/ConversationDrawer";
import { AxiosResponse } from "axios";
import httpServices from "@/Services/httpServices";
import { clearConversation } from "@/Constants/api";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

const Chatbot = () => {
  //! State
  const theme = useTheme();
  const navigate = useNavigate();
  const save = useSave();
  const [isBrandNew, setIsBrandNew] = useState(false);

  const params = useParams();
  const botId = params?.botId;

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");
  const refetchHistory = useGet("REFETCH_LIST_CHAT");

  const payload = useMemo(() => {
    return {
      bot_id: botId as string,
    };
  }, [botId]);

  const { data: botData, isLoading } = useGetBotData(payload);

  const data = botData?.data.bot_data;
  //! Function

  const handleNewConversation = async () => {
    if (isBrandNew || !data?.all_conversation?.[0]) return;
    setIsBrandNew(true);
    try {
      const response: AxiosResponse<CreateNewConversation> =
        await httpServices.post(clearConversation, {
          conversation_id: data?.all_conversation?.[0],
        });

      if (response.data.status_code === 200 && response.data.conversation_id) {
        refetchHistory && (await refetchHistory());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create new conversation");
    }
  };

  useEffect(() => {
    if (data) {
      save(cachedKeys.BOT_DATA, data);
    }

    return () => {
      save(cachedKeys.BOT_DATA, null);
    };
  }, [data]);

  //! Render
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: theme.colors.custom.background,
      }}
    >
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <CommunityDrawer />
      <ConversationDrawer />
      <Box
        sx={{
          height: "74px",
          padding: "16px",
          background: theme.colors.custom.background,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          borderBottom: `solid 0.5px ${theme.colors.custom.borderColor}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <CommonStyles.Button
            isIcon
            sx={{
              padding: "8px",
              borderRadius: "8px",
            }}
            onClick={() => navigate("/")}
          >
            <CommonIcons.ArrowBackIosNew sx={{ widht: 16, height: 16 }} />
          </CommonStyles.Button>

          {data?.avatar_url && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={data?.avatar_url}
                alt="Team"
                style={{
                  height: "32px",
                  width: "32px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CommonStyles.Typography type="semiBold14">
                  {data?.bot_name}
                </CommonStyles.Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    display: "none",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <CommonIcons.Person sx={{ width: 12, height: 12 }} />
                  <CommonStyles.Typography type="normal12">
                    {data?.user_name}
                  </CommonStyles.Typography>
                </Box>
                <Box
                  sx={{
                    height: "16px",
                    width: "1px",
                    margin: "0 8px",
                    background: theme.colors.custom.normalColorTypo,
                  }}
                />
                <CommonStyles.Typography type="normal12">
                  Published 2 days ago
                </CommonStyles.Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            button: {
              padding: "8px 16px",
              borderRadius: "8px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              width: "96px",
              background: theme.colors.custom.backgroundCard,
            },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          <CommonStyles.Button variant="outlined">
            <CommonIcons.StarOutline sx={{ width: 16, height: 16 }} />
            <CommonStyles.Typography>{data?.stars}</CommonStyles.Typography>
          </CommonStyles.Button>
          <CommonStyles.Button sx={{ width: "96px" }} variant="outlined">
            <CommonStyles.Typography type="semiBold14">
              Share
            </CommonStyles.Typography>
          </CommonStyles.Button>
        </Box>
        <Box
          sx={{
            display: "none",
            [theme.breakpoints.down("sm")]: {
              display: "flex",
              gap: "12px",
            },
            button: {
              padding: "8px 16px",
              borderRadius: "8px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              background: theme.colors.custom.backgroundCard,
              svg: {
                width: 16,
                height: 16,
              },
            },
          }}
        >
          <CommonStyles.Button isIcon>
            <CommonIcons.Star />
          </CommonStyles.Button>
          <CommonStyles.Button isIcon>
            <CommonIcons.Share />
          </CommonStyles.Button>
        </Box>
      </Box>
      <div className="flex w-screen justify-center my-[10px]">
        <Box
          id="wrapper"
          className="p-[20px_14px_105px_14px] h-[calc(100vh-94px)] relative max-w-[calc(100vw-20px)] rounded-lg"
          sx={{
            background: data?.background_url
              ? `url(${data?.background_url})`
              : theme.colors.custom.background,
            backgroundSize: "cover",
            aspectRatio: "16/9",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-all duration-300 rounded-lg",
              isBrandNew ? "bg-[rgba(0,0,0,0)]" : "bg-[rgba(0,0,0,0.5)]"
            )}
          />

          <Box
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 100,
              display: "flex",
              gap: "8px",
            }}
          >
            {/* <Memory /> */}
            <Options />
            <CommonStyles.Button
              isIcon
              sx={{
                background: theme.colors.custom.backgroundCard,
                padding: "8px",
                borderRadius: "8px",
                boxShadow:
                  "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
              }}
              onClick={() => {
                save(cachedKeys.OPEN_DRAWER, true);
              }}
            >
              <CommonIcons.Menu />
            </CommonStyles.Button>
          </Box>

          <Box
            id="scrollbar-chatbot"
            sx={{
              maxHeight: "100%",
              mask: "linear-gradient(180deg,#fff 91.89%,hsla(0,0%,100%,0))",
              paddingBottom: "30px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              sx={{
                maxWidth: "640px",
                display: "flex",
                alignItems: "center",
                paddingTop: isBrandNew ? "50px" : "0",
                flexDirection: "column",
                margin: "auto",
              }}
            >
              {isBrandNew && (
                <Fragment>
                  <img
                    src={data?.avatar_url}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  />
                </Fragment>
              )}
              <ChatField
                setIsBrandNew={setIsBrandNew}
                isBrandNew={isBrandNew}
                key={conversationId}
              />
            </Box>
          </Box>
          <Box
            id="textbox"
            sx={{
              paddingBottom: "20px",
              position: "absolute",
              width: "100%",
              bottom: 0,
              left: 0,
            }}
          >
            <Box
              sx={{
                maxWidth: "640px",
                margin: "auto",
                position: "relative",
              }}
            >
              <CommonStyles.Button
                isIcon
                tooltip="New conversation"
                hasBorder={false}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "-50px",
                  svg: {
                    width: 20,
                    height: 20,
                  },
                }}
                disabled={isBrandNew}
                onClick={handleNewConversation}
              >
                <CommonIcons.Message />
              </CommonStyles.Button>
              {data && (
                <InputBox setIsBrandNew={setIsBrandNew} botData={data} />
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default Chatbot;
