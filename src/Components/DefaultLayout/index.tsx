import { Box, useTheme } from "@mui/material";
import CommonStyles from "../CommonStyles";

import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import { useEffect, useState } from "react";
import CommonIcons from "../CommonIcons";

export const sidebarWidth = 232;

function DefaultLayout() {
  //! State
  const theme: any = useTheme();
  const [open, setOpen] = useState(window.innerWidth > 900);
  //! Function
  useEffect(() => {
    const onResize = () => {
      if(window.innerWidth < 900) {
        setOpen(false)
      } else {
        setOpen(true)
      }
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  },[])

  //! Render
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        id="main-content"
        sx={{
          width: `calc(100vw - ${open ? sidebarWidth : 0}px)`,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: theme.colors.custom.backgroundSecondary,
          position: "relative",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <CommonStyles.LoadingOverlay isLoadingApp />
        <Box
          sx={{
            paddingLeft: !open ? "20px" : "0px",
            position: "relative",
          }}
        >
          {!open && (
            <CommonStyles.Button
              isIcon
              style={{
                borderRadius: "8px",
                position:'absolute',
                top:'24px',
                zIndex:1000,
                left:'5px'
              }}
              onClick={() => setOpen(true)}
            >
              <CommonIcons.KeyboardDoubleArrowRight />
            </CommonStyles.Button>
          )}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DefaultLayout;
