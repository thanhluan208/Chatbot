import { cloneDeep, isArray, isEmpty } from "lodash";
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
import { useNavigate } from "react-router-dom";

export interface IBotCard {
  id: string;
  workspace: Workspace;
  name: string;
  description: string;
  profilePicture: string;
  lastEdit: Date;
  isFavourite?: boolean;
}

export interface Workspace {
  label: string;
  avatar: string;
  type: string;
  value: string;
}

const BotCard = (props: IBotCard) => {
  //! State

  const {
    id,
    workspace,
    name,
    description,
    profilePicture,
    lastEdit,
    isFavourite,
  } = props;

  const navigate = useNavigate();
  const theme: any = useTheme();
  const save = useSave();

  //! Function
  const handleClick = (e: any) => {
    e.stopPropagation();
    navigate(`/workspace/${workspace.value}/bot/${id}`);
  };

  const handleFav = (e: any) => {
    e.stopPropagation();
    save(
      cachedKeys.BOT,
      (rootState: any) => {
        const listBots = rootState?.[cachedKeys.BOT];
        const newListBots = cloneDeep(listBots).map((bot: IBotCard) => {
          if (bot.id === id) {
            bot.isFavourite = !bot.isFavourite;
            return bot;
          }
          return bot;
        });

        return newListBots;
      },
      true
    );
  };

  //! Render
  return (
    <Box
      onClick={handleClick}
      sx={{
        color: "unset",
        width: "30%",
        padding: "16px",
        background: "#fff",
        borderRadius: "12px",
        border: "solid 1px #ccc",
        transition: "all 0.3s",
        cursor: "pointer",
        [theme.breakpoints.down("lg")]: {
          width: "45%",
        },

        ".btnGroup": {
          display: "none",

          "& button": {
            borderRadius: "8px",
          },
        },
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
            {name}
          </CommonStyles.Typography>
          <CommonStyles.Typography
            color={theme.colors.custom.colorDisabledTypo}
          >
            {description}
          </CommonStyles.Typography>
        </Box>
        <Box>
          <img
            src={profilePicture}
            alt={name}
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
              color={theme.colors.custom.colorDisabledTypo}
            >
              GPT-4 (8k)
            </CommonStyles.Typography>
            <CommonIcons.Circle
              sx={{
                width: "3px",
                height: "3px",
                margin: "auto 8px",
                color: theme.colors.custom.colorDisabledTypo,
              }}
            />
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.colorDisabledTypo}
            >
              Edited {moment(lastEdit).format("HH:mm")}
            </CommonStyles.Typography>
          </Box>
          <Box
            mt={1}
            sx={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <img
              src={workspace.avatar}
              alt={workspace.label}
              style={{ width: "16px", height: "16px", borderRadius: "50%" }}
            />

            <CommonStyles.Typography>{workspace.label}</CommonStyles.Typography>
            <CommonStyles.Typography
              color={theme.colors.custom.colorDisabledTypo}
            >
              @luandang
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
          <MoreOption id={id} />
        </Box>
      </Box>
    </Box>
  );
};

function ListBot() {
  //! State
  const theme: any = useTheme();
  const listBots: IBotCard[] = useGet("BOT") || [];

  //! Function

  //! Render

  if (isEmpty(listBots)) {
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
            color: theme.colors.custom.colorDisabledTypo,
          }}
        >
          Build an AI Bot with the power of LLM and plugins in minutes
        </CommonStyles.Typography>

        <CreateBotPersonal />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {isArray(listBots) &&
        listBots.map((bot) => {
          return <BotCard key={bot.id} {...bot} />;
        })}
    </Box>
  );
}

export default ListBot;
