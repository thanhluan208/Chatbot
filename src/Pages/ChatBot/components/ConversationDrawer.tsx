import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer, useTheme } from "@mui/material";
import LeftSide from "./LeftSide";

const ConversationDrawer = () => {
  //! State
  const openDrawer = useGet("OPEN_CONVERSATION");
  const save = useSave();
  const theme = useTheme()

  //! Function
  const handleClose = () => {
    save(cachedKeys.OPEN_CONVERSATION, false);
  };

  //! Render
  return (
    <Drawer anchor="left" open={openDrawer} onClose={handleClose} >
      <Box sx={{ width: 300,height:'100vh', background: theme.colors.custom.backgroundSecondary }} role="presentation">
        <LeftSide />
      </Box>
    </Drawer>
  );
};

export default ConversationDrawer;
