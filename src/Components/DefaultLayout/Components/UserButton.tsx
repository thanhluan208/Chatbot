import { Avatar, Box, Fade, Paper, Popper, useTheme } from "@mui/material";
import NavItem from "./NavItem";
import React, { Fragment } from "react";
import CommonStyles from "../../CommonStyles";
import { useAuth } from "../../../Providers/AuthenticationProvider";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from '@/assets/avatar.png'
import { useTranslation } from "react-i18next";

function UserButton() {
  //translation
  const { t } = useTranslation("store");

  //! State
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const theme = useTheme()

  const open = !!anchorEl;
  const { logout, userData, userId } = useAuth();
  //! Function

  //! Render
  return (
    <Fragment>
      <Box onBlur={() => setAnchorEl(null)}>
        <NavItem
          icon={
            <Avatar src={userData?.avatar_url || DefaultAvatar} />
          }
          title={userData?.display_name}
          navActive
          buttonSx={{
            mt: "12px",
            height: "fit-content",
            width: '100%'
          }}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          }}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"top-start"}
        transition
        keepMounted={false}
        onBlur={() => setAnchorEl(null)}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                padding: "8px ",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                button: {
                  color: theme.colors.custom.normalColorTypo,
                  fontWeight: 500,
                },
              }}
            >
              <CommonStyles.Button
                onClick={() => {
                  navigate(`/user/${userId}?isOwner=true`);
                }}
              >
                {t("sidebar.button.settings")}
              </CommonStyles.Button>
              <CommonStyles.Button onClick={logout}>
                {t("sidebar.button.logOut")}
              </CommonStyles.Button>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
}

export default UserButton;
