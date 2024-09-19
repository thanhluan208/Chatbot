import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, Fade, Popper, useTheme } from "@mui/material";
import { useState } from "react";
import { DiscardReply } from "./CommunityReply";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { removeNestedById } from "@/Helpers";

interface ICommunityMore {
  id: string;
}

const CommunityMore = (props: ICommunityMore) => {
  //! State
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const save = useSave();
  const theme = useTheme()

  //! Function
  const onDelete = () => {
    save(cachedKeys.COMMUNITY_COMMENT, (state: any) => {
      const comments = state[cachedKeys.COMMUNITY_COMMENT] || [];
      return removeNestedById(comments, props.id, "replys");
    },true);
  };

  //! Render
  return (
    <Box
      onMouseLeave={() => {
        setAnchorEl(null);
      }}
    >
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                background: theme.colors.custom.backgroundDialog,
                marginTop: "12px ",
              }}
            >
              <DiscardReply
                onCancel={onDelete}
                DeleteButton={
                  <Box sx={{
                    display:'flex',
                    gap:"8px",
                    color:"unset !important"
                  }}>
                    <CommonIcons.Delete />
                    <CommonStyles.Typography>
                      Delete comment
                    </CommonStyles.Typography>
                  </Box>
                }
              />
            </Box>
          </Fade>
        )}
      </Popper>
      <CommonStyles.Button
        variant="outlined"
        sx={{ color: "unset" }}
        startIcon={<CommonIcons.MoreHoriz />}
        onMouseEnter={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <CommonStyles.Typography type="semiBold12">
          More
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Box>
  );
};

export default CommunityMore;
