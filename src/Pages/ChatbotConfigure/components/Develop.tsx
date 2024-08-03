import { Box } from "@mui/material";
import AgentButton from "./AgentButton";
import EngineButton from "./EngineButton";
import PersonaAndPrompt from "./PersonaAndPrompt";
import PreviewChat from "./PreviewChat";
import Configure from "./Configure";

const Develop = () => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          padding: "16px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
          background: "#f9f9f9",
        }}
      >
        <AgentButton />
        <EngineButton />
      </Box>
      <Box display="flex" paddingTop="8px" height="calc(100vh - 138px)">
        <Box flex={2} paddingRight="10px">
          <PersonaAndPrompt />
        </Box>
        <Box flex={3} position="relative" paddingBottom="80px">
          <PreviewChat />
        </Box>
        <Box flex={2} padding="8px 10px 0 20px">
          <Configure />
        </Box>
      </Box>
    </Box>
  );
};

export default Develop;
