import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserProfileTab } from "../../..";
import Masonry from "@mui/lab/Masonry";
import useGetListBot from "@/Hooks/Bot/useGetListBot";
import { useCallback, useEffect, useMemo } from "react";
import { BotCard } from "@/Pages/Users/Components/ListBot";
import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import KnowledgeFolder from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeFolder";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

enum WorkTab {
  Bots = "Bots",
  Knowledges = "Knowledges",
}

const Work = () => {
  //! State
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const save = useSave();
  const { userId } = useParams();
  const queryParams = new URLSearchParams(location.search);

  const subTabQuery = queryParams.get("subTab");
  const tabQuery = queryParams.get("tab");

  const knowledgeFilters = useMemo(() => {
    return {
      user_id: userId,
      visual_option: "shared",
    };
  }, [userId]);

  const {
    data: listBots,
    isLoading: isLoadingBots,
    refetch,
  } = useGetListBot(
    knowledgeFilters,
    subTabQuery === WorkTab.Bots || !subTabQuery
  );
  const { data: listKnowledges, isLoading: isLoadingKnowledges } =
    useGetListFolderKnowledge(knowledgeFilters);

  //! Function
  const renderWorkTab = useCallback(() => {
    switch (subTabQuery) {
      case WorkTab.Bots:
        return (
          listBots?.data?.list_bots?.map((bot) => {
            return <BotCard key={bot.bot_id} {...bot} />;
          }) || []
        );
      case WorkTab.Knowledges:
        return (
          listKnowledges.map((item) => {
            return <KnowledgeFolder key={item.id} {...item} />;
          }) || []
        );
      default:
        return (
          listBots?.data?.list_bots?.map((bot) => {
            return <BotCard key={bot.bot_id} {...bot} />;
          }) || []
        );
    }
  }, [tabQuery, subTabQuery, listBots, listKnowledges]);

  useEffect(() => {
    save(cachedKeys.REFETCH_LIST_BOT, refetch);
  }, [refetch, save]);

  //! Render
  return (
    <Box>
      <Box sx={{ display: "flex", gap: "8px" }}>
        {Object.values(WorkTab).map((workTab) => {
          const isActive =
            subTabQuery === workTab ||
            (!subTabQuery && workTab === WorkTab.Bots);
          return (
            <CommonStyles.Button
              onClick={() => {
                navigate(
                  `?tab=${tabQuery ?? UserProfileTab.Work}&subTab=${workTab}`
                );
              }}
              sx={{
                background: isActive ? "#4e40e538" : "transparent",
              }}
            >
              <CommonStyles.Typography type="semiBold14">
                {workTab}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}
      </Box>

      <Box
        sx={{
          marginTop: "20px",
          overflow: "hidden",
          [theme.breakpoints.down("md")]: {
            padding: "0 25px",
          },

          "& .MuiMasonry-root": {
            margin: 0,
          },
        }}
      >
        <CommonStyles.LoadingOverlay
          isLoading={isLoadingBots || isLoadingKnowledges}
        />
        <Masonry
          columns={{
            xs: 1,
            lg: 2,
          }}
          spacing={2}
          sx={{
            [theme.breakpoints.between("md", "lg")]: {
              "& .botCard": {
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
              },
            },
            "& .botCard": {
              border: "1px solid transparent",
              "&:hover": {
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: theme.colors.custom.boxShadow,
              },
            },
          }}
        >
          {renderWorkTab()}
        </Masonry>
      </Box>
    </Box>
  );
};

export default Work;
