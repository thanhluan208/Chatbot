import { Box } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import UserDescription from "./components/UserDescription";
import CommonIcons from "../../Components/CommonIcons";
import Setting from "./components/Settings";
import Report from "./components/Report";
import { Fragment } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Work from "./components/Tabs/Work/Work";

const Stats = (props: { label: string; value: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      <CommonStyles.Typography color="#06070980">
        {props.label}
      </CommonStyles.Typography>
      <CommonStyles.Typography type="semiBold20">
        {props.value}
      </CommonStyles.Typography>
    </Box>
  );
};

export enum UserProfileTab {
  Work = "Work",
  Like = "Like",
  Collection = "Collection",
  Dialog_History = "Dialog History",
  Visit_History = "Visit History",
}

const UserProfile = () => {
  //! State
  const isOwner = true;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const tabQuery = queryParams.get("tab");

  //! Function
  const renderTab = useCallback(() => {
    switch (tabQuery) {
      case UserProfileTab.Work:
        return <Work />;
      case UserProfileTab.Like:
        return <div />;
      case UserProfileTab.Collection:
        return <div />;
      case UserProfileTab.Dialog_History:
        return <div />;
      default:
        return <Work />;
    }
  }, [tabQuery]);

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          paddingTop: "50px",
          display: "flex",
          justifyContent: "space-between",
          margin: "auto",
          maxWidth: "920px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <img
            src="https://p16-sg.tiktokcdn.com/img/user-avatar-alisg/ex2hhnz0dri8xc6ad0d31tfs791n4wt1~120x256.image"
            alt="user"
            style={{ width: "120px", height: "120px", borderRadius: "50%" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CommonStyles.Typography type="semiBold24">
                Username
              </CommonStyles.Typography>
              <CommonStyles.Typography color="#06070980">
                @luandang123
              </CommonStyles.Typography>
            </Box>
            <UserDescription description="This user is lazy and has not written anything yet." />
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Stats label="Follow" value="100" />
              <Stats label="Fans" value="100" />
              <Stats label="Like" value="100" />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {!isOwner && (
            <Fragment>
              <CommonStyles.Button
                startIcon={<CommonIcons.Add />}
                variant="contained"
                sx={{
                  height: "40px",
                  maxHeight: "unset",
                  padding: "10px 20px",
                }}
              >
                Follow
              </CommonStyles.Button>
              <Box
                sx={{
                  height: "20px",
                  width: "1px",
                  backgroundColor: "#06070980",
                  margin: "0 12px",
                }}
              />
            </Fragment>
          )}

          <CommonStyles.Button
            isIcon
            sx={{
              height: "40px",
              maxHeight: "unset",
              width: "40px",
              borderRadius: "8px",
              marginRight: "12px",
            }}
          >
            <CommonIcons.Share />
          </CommonStyles.Button>

          {isOwner ? <Setting /> : <Report />}
        </Box>
      </Box>
      <Box
        sx={{
          margin: "auto",
          maxWidth: "920px",
          display: "flex",
          gap: "24px",
          marginTop: "30px",
        }}
      >
        {Object.values(UserProfileTab).map((tab) => {
          const isActive =
            tabQuery === tab ||
            (tabQuery &&
              !Object.values(UserProfileTab).includes(
                tabQuery as UserProfileTab
              ) &&
              tab === UserProfileTab.Work) || (!tabQuery && tab === UserProfileTab.Work);
          return (
            <CommonStyles.Typography
              onClick={() => {
                navigate(`?tab=${tab}`);
              }}
              type="semiBold16"
              color={isActive ? "#4e40e5" : "#06070980"}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "#4e40e5",
                },
              }}
            >
              {tab === UserProfileTab.Work ? "Work (2)" : tab}
            </CommonStyles.Typography>
          );
        })}
      </Box>

      <Box
        sx={{
          margin: "auto",
          maxWidth: "920px",
          marginTop: "30px",
        }}
      >
        {renderTab()}
      </Box>
    </Fragment>
  );
};

export default UserProfile;
