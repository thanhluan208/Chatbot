import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer } from "@mui/material";
import { RightSide } from "../RightSide";
import { ConfigurationItemEnum } from "../ConfigurationItem";

const CommunityDrawer = () => {
  //! State
  const openDrawer = useGet("OPEN_DRAWER");
  const save = useSave();

  //! Function
  const handleClose = () => {
    save(cachedKeys.OPEN_DRAWER, false);
  };


  //! Render
  return (
    <Drawer anchor="right" open={openDrawer} onClose={handleClose}>
      <Box sx={{ width: 500 }} role="presentation">
        <RightSide
          configuration={{
            model: "GPT-3 (16K)",
            items: [
              ConfigurationItemEnum.PRIVATE_KNOWLEDGE,
              ConfigurationItemEnum.PRIVATE_PLUGIN,
              ConfigurationItemEnum.PRIVATE_WORKFLOW,
            ],
          }}
          conversation={Math.floor(Math.random() * 456789 + 3000000)}
          user={Math.floor(Math.random() * 34567 + 100000)}
          like={Math.floor(Math.random() * 1000)}
        />
      </Box>
    </Drawer>
  );
};

export default CommunityDrawer;
