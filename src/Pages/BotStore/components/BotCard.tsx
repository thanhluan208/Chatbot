import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import { ReactNode } from "react";
import CommonIcons from "../../../Components/CommonIcons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";

const Stats = (props: { icon: ReactNode; value: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      {props.icon}
      <CommonStyles.Typography type="normal12">
        {props.value}
      </CommonStyles.Typography>
    </Box>
  );
};

interface BotCardProps {
  name: string;
  avatar: string;
  category: string;
  space: {
    avatar: string;
    name: string;
  };
  creator: {
    avatar?: string;
    name: string;
  };
  description: string;
  users: number;
  star: number;
  comments: number;
  id: string;
  owner_id: string;
}

const BotCard = (props: BotCardProps) => {
  //! State
  const { creator, avatar, name, space, description, users, star, comments } =
    props;
  const navigate = useNavigate();
  const { userId } = useAuth();

  const isOwner = userId === props.owner_id;
  console.log('isOwner', isOwner);
  //! Function

  //! Render
  return (
    <Box
      sx={{
        padding: "20px 20px 16px",
        background: "#fff",
        boxShadow: "0 6px 8px 0 rgba(28, 31, 35, 0.06)",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 6px 8px 0 rgba(28, 31, 35, 0.12)",
        },
      }}
      onClick={() => {
        navigate("/bot-store/123123123");
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          borderBottom: "1px solid #f5f5f5",
          paddingBottom: "20px",
          marginBottom: "16px",
        }}
      >
        <img
          src={avatar}
          style={{
            aspectRatio: "1",
            width: "62px",
            borderRadius: "8px",
            height: "62px",
          }}
        />

        <Box
          sx={{
            display: "inline-grid",
            gap: "8px",
          }}
        >
          <CommonStyles.Typography
            type="semiBold18"
            truncate
            sx={{
              maxWidth: "100%",
            }}
          >
            {name}
          </CommonStyles.Typography>
          <Box
            sx={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/user/123123123");
            }}
          >
            {space.avatar && (
              <img
                src={space.avatar}
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                }}
              />
            )}
            {space.name && (
              <CommonStyles.Typography type="normal12">
                {space.name}
              </CommonStyles.Typography>
            )}
            {creator.avatar && (
              <img
                src={creator.avatar}
                style={{
                  width: "12px",
                  height: "12px",
                }}
              />
            )}
            {creator.name && (
              <CommonStyles.Typography type="normal12">
                {creator.name}
              </CommonStyles.Typography>
            )}
          </Box>
          <CommonStyles.Typography
            type="normal14"
            sx={{
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            {description}
          </CommonStyles.Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            svg: {
              width: 12,
              height: 12,
            },
          }}
        >
          <Stats icon={<CommonIcons.People />} value={users} />
          <Stats icon={<CommonIcons.Comment />} value={comments} />
          <Stats icon={<CommonIcons.StarOutline />} value={star} />
        </Box>
        <CommonStyles.Button>Try it now</CommonStyles.Button>
      </Box>
    </Box>
  );
};

export default BotCard;
