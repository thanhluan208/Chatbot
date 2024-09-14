import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import { ReactNode } from "react";
import CommonIcons from "../../../Components/CommonIcons";
import { useNavigate } from "react-router-dom";

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
  permission_level?: string;
}

const BotCard = (props: BotCardProps) => {
  //! State
  const {
    creator,
    avatar,
    name,
    space,
    description,
    users,
    star,
    comments,
    permission_level,
    owner_id,
  } = props;
  const navigate = useNavigate();

  const isOwner = permission_level === "owner";
  //! Function

  //! Render

  return (
    <Box
      sx={{
        cursor: "pointer",
        position: "relative",
        maxWidth: "400px",
        width: "100%",
        "&:before": {
          content: '""',
          position: "absolute",
          height: "100%",
          width: "100%",
          bottom: "-12px",
          left: 0,
          background: "rgba(0,0,0,0.03)",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          height: "100%",
          width: "100%",
          bottom: "-24px",
          left: 0,
          background: "rgba(0,0,0,0.03)",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        },
        "&:hover": {
          boxShadow: "0 4px 12px 0px rgba(0,0,0,0.1)",
          "& .img": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px 0px rgba(0,0,0,0.25) !important",
          },
          "&:before": {
            background: "rgba(0,0,0,0.05)",
            bottom: "-16px",
          },
          "&:after": {
            background: "rgba(0,0,0,0.05)",
            bottom: "-32px",
          },
          "& .star": {
            opacity: 1,
          },
        },
      }}
      onClick={() => {
        navigate(`/bot-store/${props.id}?isOwner=${isOwner}`);
      }}
    >
      <Box
        sx={{
          background: "#fff",
          borderRadius: "8px",
          zIndex: 100,
          position: "relative",
          paddingBottom: "20px",
        }}
      >
        <Box
          sx={{
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-30px)",
            marginBottom: "-20px",
          }}
        >
          <img
            className="img"
            src={avatar}
            style={{
              aspectRatio: "1",
              width: "62px",
              borderRadius: "8px",
              height: "62px",
              boxShadow: "0 4px 12px 0px rgba(0,0,0,0.05)",
              transition: "all 0.3s",
            }}
          />
        </Box>

        <CommonStyles.Typography
          type="semiBold18"
          truncate
          sx={{
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          {name}
        </CommonStyles.Typography>
        <Box
          sx={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "center",
            marginBottom: "20px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/user/" + owner_id);
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
            <CommonStyles.Typography
              type="normal12"
              sx={{
                maxWidth: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
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
            <CommonStyles.Typography
              type="normal12"
              sx={{
                maxWidth: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
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
            padding: "0 20px",
            textAlign: "justify",
          }}
        >
          {description}
        </CommonStyles.Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            marginTop: "20px",
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

        <CommonStyles.Button
          isIcon
          className="star"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            transition: "all 0.3s",
            opacity: 0,
          }}
        >
          <CommonIcons.StarOutline />
        </CommonStyles.Button>
      </Box>
    </Box>
  );
};

export default BotCard;
