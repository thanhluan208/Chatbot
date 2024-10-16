import { Box, InputAdornment, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import { useLayoutEffect, useState } from "react";
import { capitalize, isArray } from "lodash";
import Mansory from "@mui/lab/Masonry";
import CommonIcons from "../../Components/CommonIcons";
import Knowledgecard from "./components/KnowledgeCard";
import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { useTranslation } from "react-i18next";

export enum BotStoreCategory {
  RECOMENDED = "recommended",
  RECENT = "recent",
  NEWS_AND_READING = "news and reading",
  WRITING = "writing",
  PHOTOGRAPHY = "photography",
  DESIGN = "design",
  TOOL = "tool",
  LIFESTYLE = "lifestyle",
  SCIENCE_AND_EDUCATION = "science and education",
  SOCIAL = "social",
}

const KnowledgeStore = () => {
  //translation
  const { t } = useTranslation("store");

  //! State
  const [filters, setFilters] = useState({
    category: "recommended",
  });

  const { data, isLoading } = useGetListFolderKnowledge();
  const theme = useTheme()

  //! Function
  useLayoutEffect(() => {
    const handleScroll = () => {
      const knowledgeCategory = document.getElementById(
        "knowledge-store-category"
      );
      if (knowledgeCategory) {
        const top = knowledgeCategory.getBoundingClientRect().top;
        if (top === 80) {
          knowledgeCategory.style.boxShadow = "0px 2px 4px 0px #1E1E1F0A";
        } else {
          knowledgeCategory.style.boxShadow = "0px 0px 0px 0px transparent";
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
          display: "grid",
          gridTemplateColumns: "1fr minmax(auto, 480px) 1fr",
          padding: "24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: theme.colors.custom.backgroundSecondary,
        }}
      >
        <CommonStyles.Typography type="semiBold20">
          {t("knowledgeStore.heading.main")}
        </CommonStyles.Typography>
        <CommonStyles.Input
          fullWidth
          placeholder={t("knowledgeStore.placeholder.search")}
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
        <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <CommonStyles.Button>
            <CommonIcons.Mail />
          </CommonStyles.Button>
          <CommonStyles.Button variant="contained" sx={{
            width:'fit-content',
            maxWidth:'unset',
            textWrap:"nowrap"
          }}>
            {t("knowledgeStore.button.publish")}
          </CommonStyles.Button>
        </Box>
      </Box>

      <Box
        id="knowledge-store-category"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "24px",
          position: "sticky",
          top: "80px",
          zIndex: 100,
          background: theme.colors.custom.backgroundSecondary,
          transition: "box-shadow 0.3s",
        }}
      >
        {Object.values(BotStoreCategory).map((cate) => {
          const name = t(`knowledgeStore.category.${cate}`)
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
              variant={isActive ? 'contained' : 'outlined'}
              sx={{
                padding: "4px 12px",
                // background: isActive ? "#4e40e5" : theme.colors.custom.backgroundCard,
                fontSize: "14px",
                fontWeight: "500",
                opacity: isActive ? 1 : .6,
                cursor: "pointer",
                boxShadow: "0px 2px 4px 0px #1E1E1F0A",
                
              }}
            >
              {name}duy 
            </CommonStyles.Button>
          );
        })}
      </Box>

      <Box
        sx={{
          padding: "24px",
        }}
      >
        {data && isArray(data) && (
          <Mansory columns={3} spacing={2}>
            {data.map((item) => {
              return (
                <Knowledgecard
                  owner_id={item.owner_id as string}
                  id={item.id as string}
                  key={item.id}
                  title={item.title || "Anonymous knowledge"}
                  description={item.description || "--"}
                  publisher={{
                    name: item.userName || "Anonymous",
                    avatar: "https://i.pravatar.cc/300",
                  }}
                  avatar={item.avatar}
                  size={item.size}
                  quantity={item.quantity}
                />
              );
            })}
          </Mansory>
        )}
      </Box>
    </Box>
  );
};

export default KnowledgeStore;
