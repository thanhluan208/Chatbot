import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CommunityItemProps {
  title: string;
  image: string;
  id: string;
  name: string;
  email: string;
}

const CommunityItem = ({
  title,
  image,
  id,
  name,
  email,
}: CommunityItemProps) => {
  //! State
  const navigate = useNavigate();
  const theme = useTheme()
  //! Function

  //! Render
  return (
    <Box
      onClick={() => {
        navigate(`?community=${id}`);
      }}
      sx={{
        padding: "8px 10px 8px 12px",
        borderRadius: "8px",
        background: theme.colors.custom.backgroundCard,
        "&:hover": {
          background: theme.colors.custom.backgroundCardHover,
          boxShadow: "0px 4px 8px rgba(6, 7, 9, 0.04)",
        },
      }}
    >
      <CommonStyles.Typography
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </CommonStyles.Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          {image && (
            <img
              src={image}
              style={{
                height: 14,
                width: 14,
                borderRadius: "50%",
              }}
            />
          )}
          <CommonStyles.Typography
            type="normal12"
            sx={{
              maxWidth: "125px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </CommonStyles.Typography>
          <CommonStyles.Typography
            type="normal12"
            sx={{
              maxWidth: "125px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            color="#06070980"
          >
            {email}
          </CommonStyles.Typography>
        </Box>
        <Box
          sx={{
            height: "10px",
            width: "1px",
            background: "#0607091a",
            margin: "0 6px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "4px",
            alignItems: "end",
            svg: {
              width: 12,
              height: 12,
            },
          }}
        >
          <CommonIcons.Message />
          <CommonStyles.Typography type="normal10" color="#06070980">
            4
          </CommonStyles.Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityItem;
