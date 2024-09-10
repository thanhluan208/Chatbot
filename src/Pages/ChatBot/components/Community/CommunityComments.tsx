import CommonIcons from "@/Components/CommonIcons";
import Comment from "@/Components/CommonIcons/Comment";
import CommonStyles from "@/Components/CommonStyles";
import { useGet, useSave } from "@/Stores/useStore";
import { Box } from "@mui/material";
import moment from "moment";
import CommunityReactionItems from "./CommunityReactionItems";
import CommunityReaction from "./CommunityReaction";
import cachedKeys from "@/Constants/cachedKeys";
import { useState } from "react";
import CommunityReply from "./CommunityReply";
import { v4 as uuidv4 } from "uuid";
import CommunityMore from "./CommunityMore";
import { insertNested } from "@/Helpers";

interface ICommentItems {
  id: string;
  comment: string;
  user: string;
  date: Date;
  reactions?: string[];
  replys?: ICommentItems[];
}

const CommentItems = (props: ICommentItems) => {
  //! State
  const { comment, user, date, reactions, id, replys } = props;
  const [openReply, setOpenReply] = useState(false);
  const save = useSave();

  //! Function
  const handleClick = (reaction: string) => {
    save(
      cachedKeys.COMMUNITY_COMMENT,
      (state: any) => {
        const comments = state[cachedKeys.COMMUNITY_COMMENT] || [];
        return comments.map((item: ICommentItems) => {
          if (item.id === id) {
            if (item.reactions?.includes(reaction)) {
              item.reactions = item.reactions?.filter(
                (item) => item !== reaction
              );
            } else {
              item.reactions = [...(item.reactions || []), reaction];
            }
          }
          return item;
        });
      },
      true
    );
  };

  const handleRemove = (reaction: string) => {
    save(
      cachedKeys.COMMUNITY_COMMENT,
      (state: any) => {
        const comments = state[cachedKeys.COMMUNITY_COMMENT] || [];
        return comments.map((item: ICommentItems) => {
          if (item.id === id) {
            item.reactions = item.reactions?.filter(
              (item) => item !== reaction
            );
          }
          return item;
        });
      },
      true
    );
  };

  const handleReply = (reply: string) => {
    save(
      cachedKeys.COMMUNITY_COMMENT,
      (state: any) => {
        const comments = state[cachedKeys.COMMUNITY_COMMENT] || [];
        const newCmt = {
          id: uuidv4(),
          comment: reply,
          user: "Luan Dang",
          date: new Date(),
        };
        const newComments = insertNested(comments, id, "replys", newCmt);
        return newComments;
      },
      true
    );
    setOpenReply(false);
  };

  const handleDiscardReply = () => {
    setOpenReply(false);
  };
  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
      }}
    >
      <img
        src="https://p16-card-sign-sg.ibyteimg.com/tos-alisg-i-8mmqwuruak-sg/7345128450490385413_1721316122677117096.gif~tplv-8mmqwuruak-image.image?rk3s=886be006&x-expires=1732780390&x-signature=Hk9GXijEEw0RMrc7WZGqSJrx4HM%3D"
        style={{
          height: 32,
          width: 32,
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width:'100%'
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexDirection: "column",
            verticalAlign: "center",
          }}
        >
          <CommonStyles.Typography type="semiBold12">
            {user}
            <CommonStyles.Chip
              label={moment(date).fromNow()}
              sx={{
                marginLeft: "8px",
              }}
            />
          </CommonStyles.Typography>
          <CommonStyles.Typography>{comment}</CommonStyles.Typography>
          <Box sx={{ display: "flex", gap: "6px" }}>
            <CommonStyles.Button
              variant="outlined"
              sx={{ color: "unset" }}
              startIcon={<CommonIcons.Reply />}
              onClick={() => setOpenReply(!openReply)}
            >
              <CommonStyles.Typography type="semiBold12">
                Reply
              </CommonStyles.Typography>
            </CommonStyles.Button>
            <CommunityMore id={id} />
            <CommunityReaction
              handleClick={handleClick}
              reactionProps={reactions ?? []}
            />
            <CommunityReactionItems
              handleClick={handleRemove}
              reactionProps={reactions ?? []}
              max={3}
            />
          </Box>
        </Box>
        {openReply && (
          <CommunityReply
            onCancel={handleDiscardReply}
            onSubmit={handleReply}
          />
        )}
        {replys &&
          replys.map((item) => {
            return (
              <Box
                key={item.id}
                sx={{
                  marginTop: "20px",
                }}
              >
                <CommentItems
                  comment={item.comment}
                  date={item.date}
                  id={item.id}
                  user={item.user}
                  reactions={item.reactions}
                  replys={item.replys}
                />
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

const CommunityComments = () => {
  //! State
  const comments = useGet("COMMUNITY_COMMENT");
  const isEmpty = !comments || comments.length === 0;
  //! Function

  //! Render
  return (
    <Box marginTop="20px">
      <CommonStyles.Typography type="semiBold14">
        {`${comments?.length || 0} comment(s)`}
      </CommonStyles.Typography>

      <Box sx={{ marginTop: "20px" }}>
        {isEmpty ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              svg: {
                width: 32,
                height: 32,
                color: "#7D7D7D",
              },
            }}
          >
            <Comment />
            <CommonStyles.Typography type="semiBold14">
              No comments yet
            </CommonStyles.Typography>
            <CommonStyles.Typography type="normal12" color="#7D7D7D">
              Be the first to leave a comment
            </CommonStyles.Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              flexDirection: "column",
            }}
          >
            {comments.map((item: ICommentItems) => {
              return (
                <CommentItems key={item.id} {...item} replys={item.replys} />
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommunityComments;
