import { Box } from "@mui/material";
import CommunityItem from "./CommunityItem";
import { v4 as uuidv4 } from "uuid";
import { mockDescription } from "@/Helpers";

const Community = () => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "16px",
      }}
    >
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <CommunityItem
            key={index}
            id={uuidv4()}
            title={mockDescription()}
            name="FreeTimeAI"
            email="@freetimeai.eu.com"
            image="https://p16-sg.tiktokcdn.com/img/user-avatar-alisg/xdq0hrppahq6vroh6gicd6mb4oqyefnv~120x256.image"
          />
        );
      })}
    </Box>
  );
};

export default Community;
