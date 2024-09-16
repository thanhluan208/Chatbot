import { isArray, isEmpty } from "lodash";
import { useGet, useSave } from "../../../../Stores/useStore";
import { Box, useTheme } from "@mui/material";
import Empty from "./components/Empty";
import EmptyCard from "./components/EmptyCard";
import CommonStyles from "../../../../Components/CommonStyles";
import CreateBotPersonal from "../CreateBotPersonal";
import CommonIcons from "../../../../Components/CommonIcons";
import moment from "moment";
import MoreOption from "./components/MoreOption";
import cachedKeys from "../../../../Constants/cachedKeys";
import { useLocation, useNavigate } from "react-router-dom";
import useGetListBot from "../../../../Hooks/Bot/useGetListBot";
import { useEffect, useMemo } from "react";
import { useAuth } from "../../../../Providers/AuthenticationProvider";
import Mansory from "@mui/lab/Masonry";

export interface IBotCard {
  bot_id: string;
  bot_name: string;
  description: string;
  isFavourite?: boolean;
}

export interface Workspace {
  label: string;
  type: string;
  value: string;
}

const listImg = [
  "https://i.imgur.com/SYxkcfJ.jpeg",
  "https://i.imgur.com/VUWXbmo.png",
  "https://i.imgur.com/UpI9KQ1.jpeg",
  "https://i.imgur.com/8SIRLa1.jpeg",
];

const BotCard = (props: IBotCard) => {
  //! State
  const { userData } = useAuth();
  const { bot_id, bot_name, description, isFavourite } = props;
  const openDialog = useGet("OPEN_DIALOG");

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const imgUrl = useMemo(() => {
    return listImg[Math.floor(Math.random() * listImg.length)];
  }, []);

  //! Function
  const handleClick = (e: any) => {
    if (openDialog) return;
    e.stopPropagation();
    navigate(location.pathname + "/bot/" + bot_id + "?isOwner=true");
  };

  const handleFav = (e: any) => {
    e.stopPropagation();
  };

  //! Render
  return (
    <Box
      onClick={handleClick}
      sx={{
        color: "unset",
        padding: "16px",
        maxWidth: "400px",
        background: theme.colors.custom.backgroundCard,
        borderRadius: "12px",
        transition: "all 0.3s",
        cursor: "pointer",
        ".btnGroup": {
          display: "none",

          "& button": {
            borderRadius: "8px",
          },
        },
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          background: theme.colors.custom.backgroundCardHover,
          ".btnGroup": {
            display: "flex",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            flex: 5,
          }}
        >
          <CommonStyles.Typography type="semiBold16">
            {bot_name}
          </CommonStyles.Typography>
          <CommonStyles.Typography color={theme.colors.custom.normalColorTypo}>
            {description}
          </CommonStyles.Typography>
        </Box>
        <Box>
          <img
            src={
              imgUrl ??
              "https://p16-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/9c9ef4e4c6f147339c0cae1408bb1f46~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727594320&x-signature=VTZfu6FleEdw6gvUsvvssaBeyLg%3D"
            }
            alt={""}
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Box>
      <Box display={"flex"}>
        <Box flex={5}>
          <Box mt={1} display={"flex"}>
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.normalColorTypo}
            >
              GPT-4 (8k)
            </CommonStyles.Typography>
            <CommonIcons.Circle
              sx={{
                width: "3px",
                height: "3px",
                margin: "auto 8px",
                color: theme.colors.custom.normalColorTypo,
              }}
            />
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.normalColorTypo}
            >
              Edited {moment().format("HH:mm")}
            </CommonStyles.Typography>
          </Box>
          <Box
            mt={1}
            sx={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <CommonStyles.Typography
              sx={{
                maxWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              {userData?.user_name}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              color={theme.colors.custom.normalColorTypo}
              sx={{
                maxWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              {userData?.email ? `@${userData?.email}` : "-"}
            </CommonStyles.Typography>
          </Box>
        </Box>
        <Box
          flex={2}
          display={"flex"}
          gap={"8px"}
          sx={{
            alignItems: "end",
            justifyContent: "flex-end",
          }}
        >
          <CommonStyles.Button
            isIcon
            className={isFavourite ? "" : "btnGroup"}
            onClick={handleFav}
          >
            {isFavourite ? (
              <CommonIcons.Star
                sx={{
                  color: theme.colors.custom.colorStar,
                }}
              />
            ) : (
              <CommonIcons.StarOutline />
            )}
          </CommonStyles.Button>
          <MoreOption
            bot={{
              bot_id,
              bot_name,
              description,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

function ListBot() {
  //! State
  const theme: any = useTheme();
  const save = useSave();
  const { data, isLoading, refetch } = useGetListBot();

  //! Function
  useEffect(() => {
    if (refetch) {
      save(cachedKeys.REFETCH_LIST_BOT, refetch);
    }
  }, [save, refetch]);

  //! Effect

  useEffect(() => {
    save(cachedKeys.LOADING_APP, isLoading);
  }, [isLoading]);

  //! Render

  if (isEmpty(data)) {
    return (
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Empty />
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <EmptyCard />
          </Box>
        </Box>
        <CommonStyles.Typography type="semiBold20" mt={3}>
          No results found!
        </CommonStyles.Typography>
        <CommonStyles.Typography
          mt={1}
          mb={3}
          sx={{
            color: theme.colors.custom.normalColorTypo,
          }}
        >
          Build an AI Bot with the power of LLM and plugins in minutes
        </CommonStyles.Typography>

        <CreateBotPersonal />
      </Box>
    );
  }

  return (
    <Mansory
      columns={{
        sm: 1,
        md: 2,
        xmd: 3,
        xl: 4,
      }}
      spacing={2}
      sx={{
        maxWidth: "1600px",
        margin:'auto'
      }}
    >
      {isArray(data) &&
        data.map((bot) => {
          return <BotCard key={bot.bot_id} {...bot} />;
        })}
    </Mansory>
  );
}

export default ListBot;
