import { Box, useTheme } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import Work from "./components/Tabs/Work/Work";
import { useAuth } from "@/Providers/AuthenticationProvider";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import UserInfos from "./components/Tabs/UserInfos/UserInfos";
import Avatar from "@/assets/avatar.png";
import useGetUserData from "@/Hooks/User/useGetUserData";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { useTranslation } from "react-i18next";

export enum UserProfileTab {
  USER_PROFILE = "User Profile",
  Work = "Work",
}

const UserProfile = () => {
  //Translation
  const { t } = useTranslation("store");

  //! State
  const theme = useTheme();
  const save = useSave();
  const location = useLocation();
  const { userData } = useAuth();
  const { userId } = useParams();

  const { data, refetch } = useGetUserData(userId as string, !!userId);

  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const tabQuery =
    queryParams.get("tab")?.toLowerCase() ||
    UserProfileTab.USER_PROFILE.toLowerCase();

  //! Function
  const renderTab = useCallback(() => {
    if (!data) return null;
    switch (tabQuery.toLowerCase()) {
      case UserProfileTab.Work.toLowerCase():
        return <Work />;
      case UserProfileTab.USER_PROFILE.toLowerCase():
        return <UserInfos userData={data} />;
      default:
        return <UserInfos userData={data} />;
    }
  }, [tabQuery, data]);

  useEffect(() => {
    save(cachedKeys.REFETCH_USER_DATA, refetch);

    return () => {
      save(cachedKeys.REFETCH_USER_DATA, null);
    };
  }, [refetch, save]);

  //! Render
  return (
    <Box
      sx={{
        padding: "24px",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <CommonStyles.Button
          isIcon
          isRound={false}
          onClick={() => navigate(-1)}
        >
          <CommonIcons.KeyboardArrowLeft />
        </CommonStyles.Button>
        <CommonStyles.Typography type="semiBold20">
          {t("personal.title")}
        </CommonStyles.Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          borderRadius: "8px",
          padding: "0px 24px",
          position: "relative",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {Object.values(UserProfileTab).map((option) => {
          const isSelected =
            tabQuery === option.toLowerCase() ||
            ((!tabQuery || Object.keys(UserProfileTab).every(elm => elm.toLowerCase() !== tabQuery)) &&
              option === UserProfileTab.USER_PROFILE);
          return (
            <CommonStyles.Button
              key={option}
              onClick={() => {
                navigate("?tab=" + option);
              }}
              fullWidth
              variant={isSelected ? "contained" : "outlined"}
            >
              <CommonStyles.Typography
                type={"semiBold14"}
                color={
                  isSelected ? "#fff" : theme.colors.custom.normalColorTypo
                }
              >
                {t(`personal.tabs.${option.toLowerCase()}`)}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}
      </Box>
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "auto",
          marginTop: "50px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: "32px",
            gridTemplateColumns: "1fr 2fr",
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={userData?.avatar_url || Avatar}
              alt="avatar"
              style={{
                width: "100%",
                maxWidth: "300px",
                aspectRatio: "1/1",
                margin: "auto",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          {renderTab()}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
