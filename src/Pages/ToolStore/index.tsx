import CommonStyles from "@/Components/CommonStyles";
import useGetListTool from "@/Hooks/tool/useGetListTool";
import { Box, useTheme } from "@mui/material";
import { isArray } from "lodash";
import { useMemo } from "react";
import { Tool } from "../Workflow/Components/Toolbar/type";
import ToolCard from "./components/ToolCard";

const ToolStore = () => {
  const { data, isLoading } = useGetListTool();
  const theme = useTheme();

  const listTools = useMemo(() => {
    if (!data) return [];

    const tools: Tool[] = [];

    Object.entries(data).forEach(([_, providerInfo]) => {
      const { identity, provider, credentials_for_provider, ...rest } =
        providerInfo;

      Object.entries(rest).forEach(([toolName, toolInfo]) => {
        const info = toolInfo as Tool;

        tools.push({
          provider: identity,
          tags: identity.tags,
          description: info.description,
          name: toolName,
          identity: info.identity,
          parameters: info.parameters,
        });
      });
    });

    return tools;
  }, [data]);

  return (
    <div className="w-full">
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr minmax(auto, 480px) 1fr",
          padding: "24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: theme.colors.custom.backgroundSecondary,
        }}
      >
        <CommonStyles.Typography type="semiBold20" className="text-nowrap">
          Tool store
        </CommonStyles.Typography>
      </Box>

      <Box
        id="knowledge-store-category"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "24px",
          position: "sticky",
          top: "78px",
          zIndex: 100,
          background: theme.colors.custom.backgroundSecondary,
          transition: "box-shadow 0.3s",
        }}
      ></Box>

      <Box
        sx={{
          padding: "24px",
        }}
      >
        {listTools && isArray(listTools) && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "16px",
            }}
          >
            {listTools.map((item) => {
              return <ToolCard key={item.name} data={item} />;
            })}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ToolStore;
