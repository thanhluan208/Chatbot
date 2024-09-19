import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles/index";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { Box, Tooltip, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

interface KnowledgeCardProps {
  avatar: string;
  isOfficial?: boolean;
  title: string;
  publisher: {
    avatar: string;
    name: string;
    email?: string;
  };
  description: string;
  botUsed?: string;
  favorite?: string;
  isFavorite?: boolean;
  id: string;
  owner_id: string;
}

const MaxChar = 60;

const Knowledgecard = (props: KnowledgeCardProps) => {
  //! State
  const {
    owner_id,
    id,
    avatar,
    isOfficial,
    title,
    publisher,
    description,
    botUsed,
    favorite,
    isFavorite,
  } = props;
  const [isReadMore, setIsReadMore] = useState(false);
  const { userId } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  //! Function
  const handleNavigate = () => {
    navigate(`/knowledge-store/${id}?isOwner=${owner_id === userId}`);
  };

  //! Render
  return (
    <Box
      onClick={handleNavigate}
      sx={{
        padding: "16px",
        background: theme.colors.custom.backgroundCard,
        border: "solid 1px #0607091a",
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 6px 8px 0 rgba(28,31,35,.06)",
          "& .favorite": {
            opacity: 1,
          },
          background: theme.colors.custom.backgroundCardHover,
        },
        position: "relative",
      }}
    >
      <CommonStyles.Button
        isIcon
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          opacity: isFavorite ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {isFavorite ? (
          <CommonIcons.Star
            sx={{
              color: "#fabf0c",
            }}
          />
        ) : (
          <CommonIcons.StarBorder />
        )}
      </CommonStyles.Button>
      <Box>
        <Box
          sx={{
            height: "48px",
            width: "fit-content",
            position: "relative",
          }}
        >
          <img
            src={avatar}
            style={{
              width: 48,
              height: 48,
              borderRadius: "6px",
              border: "solid 1px #0607091a",
            }}
          />
          {isOfficial && (
            <Tooltip title="Official" placement="top">
              <div
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  right: "-5px",
                  height: "20px",
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </Tooltip>
          )}
        </Box>
        <CommonStyles.Typography
          type="semiBold16"
          sx={{
            marginTop: "16px",
          }}
        >
          {title}
        </CommonStyles.Typography>
        <Box
          sx={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {publisher?.avatar && (
            <img
              src={publisher.avatar}
              style={{ width: 16, height: 16, borderRadius: "50%" }}
            />
          )}
          <CommonStyles.Typography
            sx={{
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {publisher?.name}
          </CommonStyles.Typography>
          <CommonStyles.Typography
            sx={{
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            type="normal12"
            color="#06070980"
          >
            {publisher?.email}
          </CommonStyles.Typography>
        </Box>
        <p style={{ marginTop: "20px" }}>
          <CommonStyles.Typography type="normal12" color="#06070980">
            {description.length <= MaxChar || isReadMore
              ? description
              : description.substring(0, MaxChar) + "..."}
          </CommonStyles.Typography>
          {description.length > MaxChar && (
            <CommonStyles.Typography
              type="normal12"
              color="#06070980"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline ",
                },
              }}
              onClick={() => setIsReadMore(!isReadMore)}
            >
              {isReadMore ? "Collapse" : "Read more"}
            </CommonStyles.Typography>
          )}
        </p>

        <Box
          sx={{
            display: "flex",
            marginTop: "16px",
          }}
        >
          <CommonStyles.Typography>
            {botUsed ?? 0} bots used
          </CommonStyles.Typography>
          <Box
            sx={{
              width: "3px",
              height: "3px",
              borderRadius: "99999px",
            }}
          />
          <CommonStyles.Typography>
            {favorite ?? 0} favourites
          </CommonStyles.Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Knowledgecard;
