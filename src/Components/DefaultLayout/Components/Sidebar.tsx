import { Box, Divider, useTheme } from "@mui/material";
import PriceTableDialog from "./PriceTableDialog";
import NavItem from "./NavItem";
import CommonIcons from "@/Components/CommonIcons";
import UserButton from "./UserButton";
import logo from "@/assets/logo.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import useRoutes from "@/Constants/routes";
import { sidebarWidth } from "..";
import CommonStyles from "@/Components/CommonStyles";
import CreateBotButton from "./CreateBotButton";
import { capitalize } from "lodash";
import { processNavLabel } from "@/Helpers";
import { useTranslation } from "react-i18next";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    //translation
    const { t } = useTranslation("store");

  //! State
  const Routes = useRoutes();
  const theme = useTheme();

  //! Function

  //! Render
  return (
    <PerfectScrollbar
      style={{
        maxHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: open ? `${sidebarWidth}px` : "0px",
          height: "100%",
          padding: open ? "24px 16px 200px 16px" : "0px",
          position: "relative",
          transition: "width .3s ease",
          overflow: "hidden",
          p: {
            textWrap: "nowrap",
          },
          background: theme.colors.custom.backgroundCard,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                height: "40px",
                alignItems: "center",
              }}
            >
              <img src={logo} style={{ width: "40px", height: "40px" }} />
              <CommonStyles.Typography type="semiBold24">
                Alphii
              </CommonStyles.Typography>
            </Box>
            <CommonStyles.Button
              isIcon
              hasBorder={false}
              style={{
                borderRadius: "8px",
              }}
              onClick={() => setOpen(false)}
            >
              <CommonIcons.KeyboardDoubleArrowLeft />
            </CommonStyles.Button>
          </Box>
          <Box sx={{ height: "40px" }}>
            <CreateBotButton />
          </Box>
        </Box>
        <Box mt={2}>
          {Object.entries(Routes).map(([keyPar, valPar]) => {
            return (
              <Box
                key={keyPar}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
                mt={2}
              >
                {keyPar !== "common" && (
                  <CommonStyles.Typography
                    type="normal14"
                    pl={"15px"}
                    color={theme.colors.custom.normalColorTypo}
                  >
                    {capitalize(keyPar)}
                  </CommonStyles.Typography>
                )}

                {Object.entries(valPar).map(([keyChi, valChi]) => {
                  console.log(processNavLabel(keyChi))
                  return (
                    <NavItem
                      icon={valChi.icon}
                      title={t(`sidebar.naviItem.${processNavLabel(keyChi)}`)}
                      path={valChi.path}
                      key={keyChi}
                    />
                  );
                })}

                <Divider
                  sx={{
                    mt: "8px",
                  }}
                />
              </Box>
            );
          })}
          {/* <Box mt={1} display="flex" flexDirection={"column"}>
              <Box display="flex" justifyContent={"space-between"}>
                <CommonStyles.Typography
                  type="normal14"
                  pl={"15px"}
                  color={theme.colors.custom.normalColorTypo}
                >
                  Teams
                </CommonStyles.Typography>
                <AddTeam />
              </Box>

              <ListTeam />
            </Box>
            <Divider
              sx={{
                mt: "8px",
              }}
            /> */}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            left: 0,
            padding: "0 16px 24px 16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              mt: "8px",
            }}
          >
            <PriceTableDialog />
            <NavItem
              icon={<CommonIcons.Token />}
              title="Alphii Token"
              path="/token"
              navActive
              endNum={10}
            />
          </Box>

          <Box>
            <UserButton />
          </Box>
        </Box>
      </Box>
    </PerfectScrollbar>
  );
}
