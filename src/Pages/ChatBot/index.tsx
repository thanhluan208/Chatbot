import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import TextBox, { TextBoxType } from "./components/TextBox";
import PerfectScrollBar from "react-perfect-scrollbar";
import InputBox from "./components/InputBox";
import { RightSide } from "./components/RightSide";
import { ConfigurationItemEnum } from "./components/ConfigurationItem";
import Options from "./components/Options";
import Memory from "./components/Memory";

const Chatbot = () => {
  //! State
  const theme: any = useTheme();
  const navigate = useNavigate();
  const isBrandNew = true;

  //! Function

  //! Render
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      {/* <CommonStyles.LoadingOverlay isLoading={isLoading} /> */}
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
                  𓃑 5-Minutes READING
                </CommonStyles.Typography>
              </Box>
              <Box display="flex" alignItems="center">
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
      </Box>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          id="wrapper"
          sx={{
            flex: 2,
            padding: "20px 14px 105px 14px",
            height: "calc(100vh - 74px)",
            position: "relative",
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
          </Box>
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
                paddingTop: isBrandNew && "50px",
                flexDirection: "column",
                margin: "auto",
              }}
            >
              <Fragment>
                <img
                  src="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/FileBizType.BIZ_BOT_ICON/7324531881696740353_1709446935623746040_NTTNr8Qd9X.png?lk3s=50ccb0c5&x-expires=1725787903&x-signature=m2YstH4Ioil36NxAz5lMbggcUKU%3D"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
                <CommonStyles.Typography type="semiBold20">
                  Korean Master
                </CommonStyles.Typography>
                <Box
                  sx={{
                    marginTop: "12px",
                    display: "flex",
                    gap: "8px",
                    flexDirection: "column",
                  }}
                >
                  <TextBox text="안녕하세요! (Annyeonghaseyo! - Hello!) I'm your dedicated Korean teacher, designed to guide you on your journey to mastering Korean in a fun and efficient way. Whether you're starting from scratch, looking to practice daily conversations, or seeking to refine your grammar, I'm here to support your learning every step of the way." />
                  <TextBox
                    text="I'm familiar with Korean characters and basic expressions. Can we practice some everyday dialogues to improve my conversational skills?"
                    type={TextBoxType.BOT_HINT_CHAT}
                  />
                  <TextBox
                    text="I'm familiar with Korean characters and basic expressions. Can we practice some everyday dialogues to improve my conversational skills?"
                    type={TextBoxType.BOT_HINT_CHAT}
                  />
                  <TextBox
                    text="As a complete beginner, I'm eager to learn about Hangul. Could you guide me through the basics of Korean characters?"
                    type={TextBoxType.BOT_HINT_CHAT}
                  />
                  <TextBox
                    text="I've been studying Korean for a while and would like to deepen my understanding of Korean grammar. Can you provide guidance or exercises on specific grammatical concepts?"
                    type={TextBoxType.BOT_HINT_CHAT}
                  />
                </Box>
              </Fragment>
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
              <InputBox onSubmit={(text) => console.log(text)} />
            </Box>
          </Box>
        </Box>
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
      </Box>
    </Box>
  );
};

export default Chatbot;
