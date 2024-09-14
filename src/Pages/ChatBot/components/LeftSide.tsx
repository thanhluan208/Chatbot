import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";

const LeftSide = ({setOpenConversation}: {
    setOpenConversation: any;
}) => {
  //! State
  const theme = useTheme();

  //! Function

  //! Render

  return (
    <Box
      sx={{
        [theme.breakpoints.down("lg")]: {
          "& .main-scrollbar": {
            maxHeight: "calc(100vh) !important",
            minHeight: "calc(100vh) !important",
          },
        },
      }}
    >
      <PerfectScrollbar
        className="main-scrollbar"
        style={{
          background: "#f9f9f9",
          padding: "24px",
          maxHeight: "calc(100vh - 74px)",
          minHeight: "calc(100vh - 74px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CommonStyles.Button
            isIcon
            onClick={() => {
              setOpenConversation(false);
            }}
          >
            <CommonIcons.ViewSidebar />
          </CommonStyles.Button>

          <CommonStyles.Button isIcon>
            <CommonIcons.RateReview />
          </CommonStyles.Button>
        </Box>
      </PerfectScrollbar>
    </Box>
  );
};

export default LeftSide;
