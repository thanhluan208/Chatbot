import { Box, Tooltip } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";

const NameTag = (props: {
  name: string;
  avatar: string;
  tooltip?: string;
  round?: boolean;
}) => {
  return (
    <div className="flex gap-4 justify-center">
      <Tooltip title={props.tooltip}>
        <img
          className="min-w-7 min-h-7 w-7 h-7 rounded-full"
          src={props.avatar}
        />
      </Tooltip>
      <CommonStyles.Typography type="normal12" color={"#ffffffc9"}>
        {props.name}
      </CommonStyles.Typography>
    </div>
  );
};

interface HighlightCardProps {
  background?: string;
  name: string;
  category: string;
  space: string;
  creator: string;
}

const HighlightCard = (props: HighlightCardProps) => {
  //! State
  const {
    category,
    creator,
    name,
    space,
    background = "https://i.pinimg.com/564x/83/a5/d4/83a5d4d329ace4b153356a1f59ad38ad.jpg",
  } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        width: "480px",
        height: "270px",
        background: `url(${background})`,
        backgroundSize: "contain",
        borderRadius: "12px",
        boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          padding: "32px 24px 24px",
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
          bottom: "0",
          left: 0,
          width: "100%",
          display: "flex",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            color: "#fff",
          }}
        >
          <CommonStyles.Typography type="normal10">
            {category}
          </CommonStyles.Typography>
          <CommonStyles.Typography type="semiBold18">
            {name}
          </CommonStyles.Typography>
          <Box sx={{ display: "flex", gap: "4px" }}>
            <NameTag
              name={space}
              round
              avatar="https://sf16-passport-sg.ibytedtos.com/img/user-avatar-alisg/88b9207c15f5deb3ebda52eb369b85a8~300x300.image"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HighlightCard;
