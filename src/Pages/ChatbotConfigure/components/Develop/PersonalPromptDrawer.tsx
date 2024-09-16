import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer, useTheme } from "@mui/material";
import PersonaAndPrompt from "../PersonaAndPrompt";

export default function PersonalPromptDrawer({
  system_prompt,
}: {
  system_prompt: string;
}) {
  //! State
  const openDrawer = useGet("OPEN_PERSONALPROMP");
  const save = useSave();
  const theme = useTheme();

  //! Function
  const handleClose = () => {
    save(cachedKeys.OPEN_PERSONALPROMP);
  };

  //! Render
  return (
    <Drawer anchor="left" open={openDrawer} onClose={handleClose}>
      <Box
        sx={{
          width: "35vw",
          padding: "8px 12px",
          height: "100vh",
          background: theme.colors.custom.backgroundSecondary,
        }}
        role="presentation"
        
      >
        <PersonaAndPrompt systemPrompt={system_prompt} />
      </Box>
    </Drawer>
  );
}
