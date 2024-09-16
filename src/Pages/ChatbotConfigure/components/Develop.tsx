import { Box, useTheme } from "@mui/material";
import AgentButton from "./AgentButton";
import EngineButton from "./EngineButton";
import { useState } from "react";
import SingleAgent from "./Develop/SingleAgent";
import MultiAgent from "./Develop/MultiAgent";
import { BotData } from "@/Hooks/Bot/useGetBotData";

export enum Mode {
  Single_agent = "single_agent",
  Multi_agent = "multi_agent",
}

interface IDevelop {
  data: BotData
}

const Develop = (props : IDevelop) => {
  //! State
  const {data} = props
  const [mode, setMode] = useState(data.mode ?? Mode.Multi_agent);
  const theme = useTheme()
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
          background: theme.colors.custom.backgroundSecondary,
          height:'64px',
          borderBottom:`solid 0.5px ${theme.colors.custom.borderColor}`
        }}
      >
        <AgentButton setMode={setMode} mode={mode} hasMultiAgent={data.has_multi_agent} key={mode + data.has_multi_agent}/>
        {mode === Mode.Single_agent && (<EngineButton />)}
      </Box>
      <Box display="flex" height="calc(100vh - 138px)">
        {renderContent && renderContent()}
      </Box>
    </Box>
  );
};

export default Develop;
