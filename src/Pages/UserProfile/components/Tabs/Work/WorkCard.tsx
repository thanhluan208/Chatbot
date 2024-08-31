import { Box } from "@mui/material";
import { commonBotCard } from "../../../../../Interfaces/common";
import CommonStyles from "../../../../../Components/CommonStyles";
import { useState } from "react";

interface WorkCard extends commonBotCard {
  users: number;
  collect: number;
}

const Stats = (props: { label: string; value: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      <CommonStyles.Typography type="normal12" color="#06070980">
        {props.label}
      </CommonStyles.Typography>
      <CommonStyles.Typography type="normal12" color="#06070980">
        {props.value}
      </CommonStyles.Typography>
    </Box>
  );
};

const WorkCard = (props: WorkCard) => {
  //! State
  const {
    name,
    avatar,
    category,
    space,
    creator,
    description,
    users,
    collect,
  } = props;
  const [isReadMore, setIsReadMore] = useState(false);
  //! Function

  //! Render
  return (
    <Box
      sx={{
        padding: "16px",
        background: "#fff",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={avatar}
          alt={name}
          style={{ width: "64px", height: "64px", borderRadius: "12px" }}
        />
      </Box>
      <Box sx={{ marginTop: "28px" }}>
        <CommonStyles.Typography type="semiBold16">
          {name}
        </CommonStyles.Typography>
        <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {space.avatar && (
            <img
              src={space.avatar}
              alt={space.name}
              style={{ width: "14px", height: "14px", borderRadius: "50%" }}
            />
          )}
          <CommonStyles.Typography type="normal12">
            {space.name}
          </CommonStyles.Typography>
          {creator.avatar && (
            <img
              src={creator.avatar}
              alt={creator.name}
              style={{ width: "12px", height: "12px" }}
            />
          )}
          <CommonStyles.Typography type="normal12">
            {creator.name}
          </CommonStyles.Typography>
        </Box>
        <p>
          <CommonStyles.Typography type="normal12">
            {description.length <= 270 || isReadMore ? description : description.substring(0, 270) + "..."}
          </CommonStyles.Typography>
          {description.length > 270 && (
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
      </Box>
      <Box sx={{ marginTop: "12px", display: "flex", gap: "16px" }}>
        <Stats value="Users" label={users.toString()} />
        <Stats value="Collect" label={collect.toString()} />
      </Box>
      <Box sx={{ marginTop: "12px", display: "flex", gap: "4px", flexWrap: 'wrap'}}>
        {(category ?? []).map((cate) => {
          return <CommonStyles.Chip label={cate} />;
        })}
      </Box>
    </Box>
  );
};

export default WorkCard;
