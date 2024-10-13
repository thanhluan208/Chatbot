import { Box, useTheme,  } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CreateBotPersonal from "./Components/CreateBotPersonal";
import { useCallback, useState } from "react";
import ListBot from "./Components/ListBot";
import CreateKnowledgeButton from "./Components/CreateKnowledgeButton";
import ListKnowledge from "./Components/ListKnowledge";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useTranslation } from "react-i18next";

const sectionList = ["Bots","Knowledges" ];

function Users() {
  //Translation
  const { t } = useTranslation("store");

  //! State
  const [personalSection, setPersonalSection] = useState("Bots");
  const theme = useTheme()
  const {userData} = useAuth()

  //! Function

  const renderPersonalSection = useCallback(() => {
    switch (personalSection) {
      case "Bots":
        return <ListBot />;
      case "Plugins":
        return <div>Plugins</div>;
      case "Workflows":
        return <div>Workflows</div>;
      case "Knowledges":
        return <ListKnowledge />;
      case "Cards":
        return <div>Cards</div>;
      default:
        return <div>Bots</div>;
    }
  }, [personalSection]);

  const renderCreateButton = useCallback(() => {
    switch (personalSection) {
      case "Bots":
        return <CreateBotPersonal />;
      case "Knowledges": 
        return <CreateKnowledgeButton />
      default:
        return null
    }
  },[personalSection])

  //! Render
  return (
    <Box
      sx={{
        padding: "24px",
        maxWidth:'100%',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display={"flex"} gap="8px">
          <img
            src={userData?.avatar_url}
            style={{
              height: "32px",
              width: "32px",
              borderRadius: "50%",
            }}
          />
          <CommonStyles.Typography type="semiBold20">
            {t("personal.title")}
          </CommonStyles.Typography>
        </Box>
        {renderCreateButton()}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          mt: "24px",
        }}
      >
        {sectionList.map((item) => {
          const isActive = personalSection === item;
          return (
            <CommonStyles.Button
              key={item}
              onClick={() => setPersonalSection(item)}
              variant={isActive ? "contained" : 'outlined'}
              sx={{
                "&:hover": {
                  "& p": {
                    fontWeight: "500 !important",
                  },
                },
              }}
            >
              <CommonStyles.Typography
                type={"semiBold14"}
                color={isActive ? "#fff" : theme.colors.custom.normalColorTypo}
              >
                {t(`personal.work.tabs.${item.toLowerCase()}`)}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}
      </Box>

      <Box mt={"24px"} >{renderPersonalSection()}</Box>
    </Box>
  );
}

export default Users;
