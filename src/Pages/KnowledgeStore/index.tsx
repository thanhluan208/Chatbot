import { Box, InputAdornment, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import { useLayoutEffect, useState } from "react";
import { capitalize, isArray } from "lodash";
import Mansory from "@mui/lab/Masonry";
import CommonIcons from "../../Components/CommonIcons";
import Knowledgecard from "./components/KnowledgeCard";
import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";

export enum BotStoreCategory {
  RECOMENDED = "recomended",
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
  //! State
  const [filters, setFilters] = useState({
    category: "recomended",
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
          Knowledge store
        </CommonStyles.Typography>
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
        <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <CommonStyles.Button>
            <CommonIcons.Mail />
          </CommonStyles.Button>
          <CommonStyles.Button variant="contained" sx={{
            width:'fit-content',
            maxWidth:'unset',
            textWrap:"nowrap"
          }}>
            Publish knowledge
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
          const name = cate
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
        {data && isArray(data) && (
          <Mansory columns={3} spacing={2}>
            {data.map((item) => {
              return (
                <Knowledgecard
                  owner_id={item.owner_id as string}
                  id={item.id as string}
                  key={item.id}
                  title={item.title || "Anonymous knowledge"}
                  description={item.description || ""}
                  publisher={{
                    name: item.userName || "Anonymous",
                    avatar: "https://i.pravatar.cc/300",
                    email: "@luandang123",
                  }}
                  avatar="https://p19-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/ee3cb1c8af2d4f478c54fab5d1f0282c~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727614368&x-signature=7F9a7ywdqP%2FddcqJwNtnmQOM4XM%3D"
                  // botUsed={formatNumber(
                  //   Math.floor(Math.random() * 345678 + 800000)
                  // )}
                  // favorite={formatNumber(
                  //   Math.floor(Math.random() * 34567 + 80000)
                  // )}
                  // isOfficial={Math.random() > 0.3}
                  isFavorite={Math.random() > 0.5}
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
