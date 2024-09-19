import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Fade, Popper, useTheme } from "@mui/material";
import React from "react";

const listReactions = ["👍", "👎", "😂", "🤯", "🙏"];

interface ICommunityReaction {
  handleClick?: (reaction: string) => void;
  reactionProps?: string[];
}

const CommunityReaction = (props: ICommunityReaction) => {
  //! State
  const { handleClick, reactionProps } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const reactions = reactionProps ?? useGet(cachedKeys.COMMUNITY_REACTION);

  const save = useSave();
  const theme = useTheme()

  //! Function
  const onClick = (reaction: string) => {
    if (handleClick) {
      handleClick(reaction);
    } else {
      save(
        cachedKeys.COMMUNITY_REACTION,
        (state: any) => {
          const reactions = state[cachedKeys.COMMUNITY_REACTION] || [];
          if (reactions.includes(reaction)) {
            return reactions.filter((item: string) => item !== reaction);
          }
          return [...reactions, reaction];
        },
        true
      );
    }
  };

  //! Render
  return (
    <Box
      onMouseLeave={() => {
        setAnchorEl(null);
      }}
    >
      <Popper open={open} anchorEl={anchorEl} placement="top" transition>
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
                marginBottom: "12px ",
              }}
            >
              {listReactions.map((reaction, index) => {
                const isChosen = reactions?.includes(reaction);
                return (
                  <CommonStyles.Button
                    onClick={() => {
                      onClick(reaction);
                    }}
                    key={index}
                    sx={{
                      padding: "8px",
                      width: "32px",
                      height: "32px",
                      minWidth: "unset",
                      color: "#060709",
                      borderRadius: "8px",
                      background: isChosen ? "#f0f0f0" : "transparent",
                    }}
                  >
                    {reaction}
                  </CommonStyles.Button>
                );
              })}
            </Box>
          </Fade>
        )}
      </Popper>
      <CommonStyles.Button
        isIcon
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <CommonIcons.Mood />
      </CommonStyles.Button>
    </Box>
  );
};

export default CommunityReaction;
