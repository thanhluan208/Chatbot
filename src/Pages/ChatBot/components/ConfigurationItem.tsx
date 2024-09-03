import PrivateKnowledge from "@/Components/CommonIcons/PrivateKnowledge";
import PrivatePlugin from "@/Components/CommonIcons/PrivatePlugin";
import PrivateWorkflow from "@/Components/CommonIcons/PrivateWorkflow";
import { Box, Tooltip } from "@mui/material";
import { useMemo } from "react";

interface ConfigurationItemProps {
  type: ConfigurationItemEnum;
}

export enum ConfigurationItemEnum {
  PRIVATE_PLUGIN = "PRIVATE_PLUGIN",
  PRIVATE_KNOWLEDGE = "PRIVATE_KNOWLEDGE",
  PRIVATE_WORKFLOW =  "PRIVATE_WORKFLOW",
}

const ConfigurationItem = ({ type }: ConfigurationItemProps) => {
  //! State
  const Icon = useMemo(() => {
    switch (type) {
      case ConfigurationItemEnum.PRIVATE_PLUGIN:
        return {
          element: <PrivatePlugin />,
          background: "#ca61ff",
        };
      case ConfigurationItemEnum.PRIVATE_KNOWLEDGE:
        return {
          element: <PrivateKnowledge />,
          background: "#ff811a",
        };
      case ConfigurationItemEnum.PRIVATE_WORKFLOW:
        return {
          element: <PrivateWorkflow />,
          background: "#00b83e",
        };
      default:
        return {
          element: <div />,
          background: "",
        };
    }
  }, [type]);

  //! Function

  //! Render
  return (
    <Tooltip
      title={type
        .split("_")
        .map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
        )
        .join(" ")}
      placement="top"
      arrow
      
    >
      <Box sx={{
        svg: {
          background: Icon.background,
          padding:'2px',
          borderRadius:'4px'
        },
      }}>
        <div>{Icon.element}</div>
      </Box>
    </Tooltip>
  );
};

export default ConfigurationItem;
