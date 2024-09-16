import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CreateBotPersonal from "./Components/CreateBotPersonal";
import { useCallback, useState } from "react";
import ListBot from "./Components/ListBot";

interface IUsers {}

const sectionList = ["Bots", ];

function Users(props: IUsers) {
  //! State
  const {} = props;
  const theme = useTheme();
  const [personalSection, setPersonalSection] = useState("Bots");

  //! Function

  const renderPersonalSection = useCallback(() => {
    switch (personalSection) {
      case "Bots":
        return <ListBot />;
      case "Plugins":
        return <div>Plugins</div>;
      case "Workflows":
        return <div>Workflows</div>;
      case "Knowledge":
        return <div>Knowledge</div>;
      case "Cards":
        return <div>Cards</div>;
      default:
        return <div>Bots</div>;
    }
  }, [personalSection]);

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
            src="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/FileBizType.BIZ_BOT_SPACE/personal.png?lk3s=50ccb0c5&x-expires=1717328691&x-signature=%2BTkPCkEyA%2Fx%2FG4NpeoobsIK0kAk%3D"
            style={{
              height: "32px",
              width: "32px",
              borderRadius: "50%",
            }}
          />
          <CommonStyles.Typography type="semiBold20">
            Personal
          </CommonStyles.Typography>
        </Box>
        <CreateBotPersonal />
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
                type={isActive ? "semiBold14" : "normal14"}
                sx={{
                  color: theme.colors.custom.normalColorTypo,
                  opacity: isActive ? 1 : 0.6
                }}
              >
                {item}
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
