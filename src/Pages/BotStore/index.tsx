import { Box, InputAdornment, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import HighlightCard from "./components/HightlightCard";
import { useLayoutEffect, useState } from "react";
import { capitalize, isArray } from "lodash";
import BotCard from "./components/BotCard";
import Mansory from "@mui/lab/Masonry";
import CommonIcons from "../../Components/CommonIcons";
import useGetBotsStore from "@/Hooks/Bot/useGetBotsStore";
import { useTranslation } from "react-i18next";

export enum BotStoreCategory {
  RECOMMENDED = "recommended",
  NEW = "new",
  POPULAR = "popular",
  WRITING = "writing",
  DESIGN = "design",
  MARKETING = "marketing",
  DEVELOPMENT = "development",
  OTHERS = "others",
  EFFICIENCY_HACKATHON = "efficiency hackathon",
}

const BotStore = () => {
  //translation
  const { t } = useTranslation("store");

  //! State
  const [filters, setFilters] = useState({
    category: BotStoreCategory.RECOMMENDED,
  });
  const theme = useTheme();

  const { data, isLoading } = useGetBotsStore();

  //! Function
  useLayoutEffect(() => {
    const handleScroll = () => {
      const botStoreCategory = document.getElementById("bot-store-category");
      if (botStoreCategory) {
        const top = botStoreCategory.getBoundingClientRect().top;
        if (top === 80) {
          botStoreCategory.style.boxShadow = "0px 2px 4px 0px #1E1E1F0A";
        } else {
          botStoreCategory.style.boxShadow = "0px 0px 0px 0px transparent";
        }
      }
    };

    const mainContent = document.getElementById("main-content");
    mainContent?.addEventListener("scroll", handleScroll);

    return () => {
      mainContent?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //! Render

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          display: "flex",
          padding: "24px",
          position: "sticky",
          top: 0,
          zIndex: 500,
          background: theme.colors.custom.backgroundSecondary,
          justifyContent: "space-between",
        }}
      >
        <CommonStyles.Typography type="semiBold20">
          Bot store
        </CommonStyles.Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            [theme.breakpoints.up("sm")]: {
              width: `50%`,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            },
          }}
        >
          <CommonStyles.Input
            fullWidth
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ marginLeft: "16px" }}>
                  <CommonIcons.Search />
                </InputAdornment>
              ),
            }}
            sx={{
              fieldset: {
                boxShadow: theme.colors.custom.boxShadow,
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          <CommonStyles.Button variant="contained">
            Submit bot
          </CommonStyles.Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          background: theme.colors.custom.backgroundSecondary,
        }}
      >
        <Box
          sx={{
            padding: "16px 0",
          }}
        >
          <img
            src="https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/mf/marketplace/static/image/brand-daily-rec.48709716.png"
            style={{
              aspectRatio: "75 / 28",
              width: "75px",
            }}
          />
          <CommonStyles.Typography
            type="bold40"
            sx={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            📝 Your content writing assistant powered by AI
          </CommonStyles.Typography>
          <CommonStyles.Typography type="normal16" color={"#1d1c2399"}>
            Generate high-quality content with just a few clicks
          </CommonStyles.Typography>

          <CommonStyles.Button
            sx={{
              padding: "10px 32px",
              height: "40px",
              maxHeight: "unset",
              borderRadius: "32px",
              marginTop: "20px",
              background: "#000",
              "&:hover": {
                background: "#000",
              },
            }}
          >
            <CommonStyles.Typography type="semiBold14" color="#fff">
              Try it now
            </CommonStyles.Typography>
          </CommonStyles.Button>
        </Box>
        <HighlightCard
          category="Writing"
          name="WriteMe #1 AI-powered content writing"
          space="BuilderPro"
          creator="@Luandang123"
        />
      </Box>

      <Box
        id="bot-store-category"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "24px",
          position: "sticky",
          top: "80px",
          zIndex: 500,
          background: theme.colors.custom.backgroundSecondary,
          transition: "box-shadow 0.3s",
        }}
      >
        {Object.values(BotStoreCategory).map((cate) => {
          console.log(t("recommended"));
          const name = t(`botStoreCategory.${cate}`)
            .split(" ")
            .map((word) => capitalize(word))
            .join(" ");
          const isActive = filters.category === cate;
          return (
            <CommonStyles.Button
              key={cate}
              onClick={() =>
                setFilters((prev) => ({ ...prev, category: cate }))
              }
              variant={isActive ? "contained" : "outlined"}
              sx={{
                padding: "4px 12px",
                background: isActive
                  ? "#4e40e5"
                  : theme.colors.custom.backgroundCard,
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                boxShadow: "0px 2px 4px 0px #1E1E1F0A",
                "&:hover": {
                  background: isActive
                    ? "#4e40e5"
                    : theme.colors.custom.backgroundCardHover,
                },
              }}
            >
              {name}
            </CommonStyles.Button>
          );
        })}
      </Box>

      <Box
        sx={{
          padding: "24px",
        }}
      >
        {isArray(data) && (
          <Mansory
            columns={{
              xs: 1,
              md: 2,
              lg: 3,
              xl: 4,
            }}
            sx={{
              maxWidth: "1600px",
              margin: "auto",
            }}
            spacing={2}
          >
            {data.map((item: any) => {
              return (
                <Box
                  key={item?.bot_id}
                  sx={{
                    padding: "30px 0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BotCard
                    id={item?.bot_id}
                    avatar="https://p16-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/9c9ef4e4c6f147339c0cae1408bb1f46~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727594320&x-signature=VTZfu6FleEdw6gvUsvvssaBeyLg%3D"
                    category=""
                    name={item?.bot_name || "Bot name"}
                    space={{
                      avatar:
                        "https://sf16-passport-sg.ibytedtos.com/img/user-avatar-alisg/4d26373f2eedfe14710becde336c2450~300x300.image",
                      name: item?.user_name || "User name",
                    }}
                    creator={{
                      name: `@${item?.user_name || "User name"}`,
                      avatar:
                        Math.floor(Math.random()) % 2 === 0
                          ? "https://sf16-bot-platform-tos-sign.coze.com/obj/bot-studio-bot-platform-sg/FileBizType.BIZ_LABEL_ICON/0_1721634266433275972_F2UPYqurVT.image/png?lk3s=50ccb0c5&x-expires=1725088720&x-signature=9B3UH8Ry%2BD1HFPjjfU39rzLDFiM%3D"
                          : "",
                    }}
                    description={item?.description || ""}
                    users={Math.floor(Math.random() * 1000 + 3000)}
                    owner_id={item?.owner_id}
                    permission_level={item?.permission_level}
                  />
                </Box>
              );
            })}
          </Mansory>
        )}
      </Box>
    </Box>
  );
};

export default BotStore;
