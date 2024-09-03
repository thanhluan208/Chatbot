import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Fade, Popper } from "@mui/material";
import { cloneDeep, isArray } from "lodash";
import { useState } from "react";

const MoreReactions = ({
  reactions,
  onClick,
  max,
  total
}: {
  reactions: string[];
  onClick: (reaction: string) => void;
  max: number;
    total: number;
}) => {
  //! State
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  //! Function

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
                background: "#fff",
                marginTop: "12px ",
              }}
            >
              {reactions.map((reaction) => {
                return (
                  <CommonStyles.Button
                    onClick={() => onClick(reaction)}
                    key={reaction}
                    sx={{
                      padding: "4px 10px",
                      minWidth: "fit-content",
                      minHeight: "fit-content",
                      borderRadius: "8px",
                      background: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {reaction}
                    <CommonStyles.Typography type="normal12">
                      1
                    </CommonStyles.Typography>
                  </CommonStyles.Button>
                );
              })}
            </Box>
          </Fade>
        )}
      </Popper>
      <CommonStyles.Button
        isIcon
        variant="outlined"
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{
            borderRadius:'8px'
        }}
      >
        <CommonStyles.Typography type="normal12">
          +{total - max}
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Box>
  );
};

interface ICommunityReactionItems {
  handleClick?: (reaction: string) => void;
  reactionProps?: string[];
  max?: number;
}

const CommunityReactionItems = (props: ICommunityReactionItems) => {
  //! State
  const { handleClick, reactionProps, max } = props;
  const reactions = reactionProps ?? useGet("COMMUNITY_REACTION");
  const save = useSave();

  //! Function
  const onClick = (reaction: string) => {
    if (handleClick) {
      handleClick(reaction);
    } else {
      save(
        "COMMUNITY_REACTION",
        (state: any) => {
          const reactions = state["COMMUNITY_REACTION"] || [];
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
  if (!reactions || !isArray(reactions)) return null;
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {reactions.map((item, index) => {
        if (max && index > max) return null;
        if (max && index  === max && max < reactions.length)
          return (
            <MoreReactions max={max} total={reactions.length} reactions={cloneDeep(reactions).slice(max, reactions.length)} onClick={onClick} />
          );
        return (
          <CommonStyles.Button
            onClick={() => onClick(item)}
            key={item}
            sx={{
              padding: "4px 10px",
              minWidth: "fit-content",
              minHeight: "fit-content",
              borderRadius: "8px",
              background: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {item}
            <CommonStyles.Typography type="normal12">1</CommonStyles.Typography>
          </CommonStyles.Button>
        );
      })}
    </Box>
  );
};

export default CommunityReactionItems;
