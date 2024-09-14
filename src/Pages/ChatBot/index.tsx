import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import PerfectScrollBar from "react-perfect-scrollbar";
import InputBox from "./components/InputBox";
import Options from "./components/Options";
import Memory from "./components/Memory";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import CommunityDrawer from "./components/Community/CommunityDrawer";
import { useEffect, useMemo, useState } from "react";
import useGetBotData from "@/Hooks/Bot/useGetBotData";
import ChatField from "./components/ChatField";
import LeftSide from "./components/LeftSide";

const Chatbot = () => {
  //! State
  const theme: any = useTheme();
  const navigate = useNavigate();
  const save = useSave();
  const [isBrandNew, setIsBrandNew] = useState(false);
  const [openConversation, setOpenConversation] = useState(true);

  const params = useParams();
  const botId = params?.botId;

  const payload = useMemo(() => {
    return {
      bot_id: botId as string,
    };
  }, [botId]);

  const { data, isLoading } = useGetBotData(payload);

  //! Function
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
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <CommunityDrawer />
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="https://p19-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/9c9ef4e4c6f147339c0cae1408bb1f46~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727684157&x-signature=Ih3gvJWf0wpTxDhC%2BQAi7lpJJ6o%3D"
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
                  <img
                    src="https://sf16-passport-sg.ibytedtos.com/img/user-avatar-alisg/4d26373f2eedfe14710becde336c2450~300x300.image"
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                    }}
                  />
                  <CommonStyles.Typography type="normal12">
                    Prompcase
                  </CommonStyles.Typography>
                  <img
                    src="https://sf16-bot-platform-tos-sign.coze.com/obj/bot-studio-bot-platform-sg/FileBizType.BIZ_LABEL_ICON/0_1721634266433275972_F2UPYqurVT.image/png?lk3s=50ccb0c5&x-expires=1725088720&x-signature=9B3UH8Ry%2BD1HFPjjfU39rzLDFiM%3D"
                    style={{
                      width: "12px",
                      height: "12px",
                    }}
                  />
                  <CommonStyles.Typography type="normal12">
                    Luan Dang
                  </CommonStyles.Typography>
                </Box>
                <Box
                  sx={{
                    height: "16px",
                    width: "1px",
                    margin: "0 8px",
                    background: theme.colors.custom.colorDisabledTypo,
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
              border: "solid 1px #e6e8ea",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              width: "96px",
              background: "#fff",
            },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          <CommonStyles.Button>
            <CommonIcons.StarOutline sx={{ width: 16, height: 16 }} />
            <CommonStyles.Typography>14</CommonStyles.Typography>
          </CommonStyles.Button>
          <CommonStyles.Button sx={{ width: "96px" }}>
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
              border: "solid 1px #e6e8ea",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              background: "#fff",
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
      <Box
        sx={{
          display: "flex",
          width: "100vw",
        }}
      >
        <Box
          sx={{
            maxWidth: "300px",
            width: openConversation ? "300px" : "0px",
            transition: "all 0.5s ease",
            [theme.breakpoints.down("lg")]: {
              display: "none",
            },
            overflow: "hidden",
          }}
        >
          <LeftSide setOpenConversation={setOpenConversation} />
        </Box>

        <Box
          id="wrapper"
          sx={{
            padding: "20px 14px 105px 14px",
            height: "calc(100vh - 74px)",
            position: "relative",
            width: "100vw",
            transition: "all 0.5s ease",
            [theme.breakpoints.down("lg")]: {
              flex: 1,
            },
          }}
        >
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
            <Memory />
            <Options />
              <CommonStyles.Button
                isIcon
                sx={{
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
                }}
                onClick={() => {
                  save(cachedKeys.OPEN_DRAWER,true);
                }}
              >
                <CommonIcons.Menu />
              </CommonStyles.Button>
          </Box>
          {!openConversation && (
            <Box
              sx={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 100,
              }}
            >
              <CommonStyles.Button
                isIcon
                sx={{
                  background: "#fff",
                  padding: "8px",
                  borderRadius: "8px",
                  boxShadow:
                    "0 2px 4px 0 rgba(0,0,0,.04),0 0 1px 0 rgba(0,0,0,.08)",
                }}
                onClick={() => {
                  setOpenConversation(true);
                }}
              >
                <CommonIcons.Note />
              </CommonStyles.Button>
            </Box>
          )}
          <PerfectScrollBar
            id="scrollbar"
            style={{
              maxHeight: "100%",
              mask: "linear-gradient(180deg,#fff 91.89%,hsla(0,0%,100%,0))",
              paddingBottom: "30px",
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
              {isBrandNew ? (
                <Fragment>
                  <img
                    src="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/FileBizType.BIZ_BOT_ICON/7342794110727701510_1724933118523505822_yxm0POQ2JJ.gif?lk3s=50ccb0c5&x-expires=1726843125&x-signature=33gB0Q3PT8%2FCKhBm3paQslW%2Fvzo%3D"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  />
                </Fragment>
              ) : (
                <ChatField />
              )}
            </Box>
          </PerfectScrollBar>
          <Box
            id="textbox"
            sx={{
              paddingBottom: "20px",
              position: "absolute",
              width: "100%",
              bottom: 0,
              left: 0,
              background: "#fff",
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
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "-40px",
                  svg: {
                    width: 20,
                    height: 20,
                  },
                }}
              >
                <CommonIcons.Message />
              </CommonStyles.Button>
              {data && (
                <InputBox setIsBrandNew={setIsBrandNew} botData={data} />
              )}
            </Box>
          </Box>
        </Box>

        {/* <Box
          sx={{
            maxWidth: "500px",
            width: openComment ? "500px" : "0px",
            transition: "all 0.5s ease",
            [theme.breakpoints.down("lg")]: {
              display: "none",
            },
          }}
        >
          <RightSide
            configuration={{
              model: "GPT-3 (16K)",
              items: [
                ConfigurationItemEnum.PRIVATE_KNOWLEDGE,
                ConfigurationItemEnum.PRIVATE_PLUGIN,
              ],
            }}
            conversation={Math.floor(Math.random() * 456789 + 3000000)}
            user={Math.floor(Math.random() * 34567 + 100000)}
            like={Math.floor(Math.random() * 1000)}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default Chatbot;
