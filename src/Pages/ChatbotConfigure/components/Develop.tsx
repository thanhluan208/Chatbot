import { Box } from "@mui/material";
import AgentButton from "./AgentButton";
import EngineButton from "./EngineButton";
import { useState } from "react";
import SingleAgent from "./Develop/SingleAgent";
import MultiAgent from "./Develop/MultiAgent";

export enum Mode {
  Single_agent = "Single_agent",
  Multi_agent = "Multi_agent",
}

const Develop = () => {
  //! State
  const [mode, setMode] = useState(Mode.Multi_agent);

  //! Function

  //! Render
  const renderContent = () => {
    switch (mode) {
      case Mode.Single_agent:
        return <SingleAgent />;
      case Mode.Multi_agent:
        return <MultiAgent />;
    }
  }

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
        <AgentButton setMode={setMode} mode={mode}/>
        <EngineButton />
      </Box>
      <Box display="flex" paddingTop="8px" height="calc(100vh - 138px)">
        {renderContent && renderContent()}
      </Box>
    </Box>
  );
};

export default Develop;
