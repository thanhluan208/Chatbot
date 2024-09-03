import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import CommunityReaction from "./CommunityReaction";
import { useEffect } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import CommunityReactionItems from "./CommunityReactionItems";
import CommunityReply from "./CommunityReply";
import CommunityComments from "./CommunityComments";

const CommunityDetail = () => {
  //! State
  const navigate = useNavigate();
  const location = useLocation();
  const save = useSave();

  //! Function
  useEffect(() => {
    return () => {
      save(cachedKeys.COMMUNITY_REACTION, null);
      save(cachedKeys.COMMUNITY_COMMENT, null);
    };
  }, [save]);

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          svg: {
            width: 14,
            height: 14,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <CommonStyles.Button
            isIcon
            sx={{
              padding: "8px",
              borderRadius: "8px",
            }}
            onClick={() => navigate(location.pathname)}
          >
            <CommonIcons.ArrowBackIosNew sx={{ widht: 16, height: 16 }} />
          </CommonStyles.Button>
          <CommonStyles.Typography type="semiBold16">
            Post details
          </CommonStyles.Typography>
          <CommonStyles.Button
            sx={{
              padding: "5px 5px 0",
              width: "24px",
              height: "24px",
              minWidth: "unset",
              color: "#060709",
              borderRadius: "8px",
            }}
          >
            <CommonIcons.Refresh />
          </CommonStyles.Button>
        </Box>
        <CommonStyles.Button isIcon>
          <CommonIcons.MoreHoriz />
        </CommonStyles.Button>
      </Box>
      <Box
        sx={{
          marginTop: "24px",
        }}
      >
        <CommonStyles.Typography type="semiBold16">
          无限flux 绘画
        </CommonStyles.Typography>
        <Box
          sx={{
            marginTop: "12px",
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <img
            src="https://p16-sg.tiktokcdn.com/img/user-avatar-alisg/xdq0hrppahq6vroh6gicd6mb4oqyefnv~120x256.image"
            style={{ height: 14, width: 14, borderRadius: "50%" }}
          />
          <CommonStyles.Typography type="normal12">
            FreeTimeAI
          </CommonStyles.Typography>
          <CommonStyles.Typography type="normal12" color="#9B9B9B">
            @freetimeai.eu.com
          </CommonStyles.Typography>
          <CommonStyles.Chip label="7h ago" />
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <CommunityReaction />
          <CommunityReactionItems />
        </Box>

        <CommunityReply />

        <CommunityComments />
      </Box>
    </Fragment>
  );
};

export default CommunityDetail;
