import CommonStyles from "@/Components/CommonStyles";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import { formatName } from "@/Helpers";
import { Tooltip, useTheme } from "@mui/material";
import { Tool, ToolProvider } from "./type";

interface ToolListProps {
  toolProviders: ToolProvider[];
}

const ToolList = ({ toolProviders }: ToolListProps) => {
  const theme = useTheme();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    tool: Tool,
    providerName: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: `tool.${providerName}.${tool.name}` })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Command
      className="rounded-sm "
      style={{
        backgroundColor: theme.colors.custom.backgroundCard,
        color: theme.colors.custom.normalColorTypo,
      }}
    >
      <CommandList className="max-h-[50vh]">
        <CommandEmpty>No tool found!.</CommandEmpty>

        {toolProviders.map((provider) => {
          return (
            <CommandGroup
              key={provider.provider}
              heading={formatName(provider.provider, "_")}
            >
              {provider.tools.map((tool) => {
                return (
                  <CommandItem
                    key={tool.name}
                    value={tool.name}
                    style={{
                      backgroundColor: theme.colors.custom.backgroundCard,
                      color: theme.colors.custom.normalColorTypo,
                    }}
                  >
                    <div
                      className="px-3 w-full py-1 backdrop-blur cursor-grab border-none flex justify-between items-center rounded-md border "
                      onDragStart={(event) =>
                        onDragStart(event, tool, provider.provider)
                      }
                      draggable
                    >
                      <Tooltip title={tool.name} placement="top-start">
                        <div className="flex gap-3 items-start">
                          <img
                            src={
                              provider.identity.icon.includes("icon.")
                                ? "https://i.pinimg.com/736x/99/3e/b9/993eb9aa891797e59a40ab89b0648213.jpg"
                                : provider.identity.icon
                            }
                            alt="icon"
                            className="rounded-lg w-8 h-8 object-cover object-center translate-y-2"
                          />
                          <div>
                            <CommonStyles.Typography
                              type="semiBold16"
                              className="max-w-[200px] truncate"
                            >
                              {formatName(tool.name, "_")}
                            </CommonStyles.Typography>
                            <CommonStyles.Typography
                              type="normal10"
                              sx={{
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                display: "-webkit-box",
                                textAlign: "justify",
                                opacity: 0.5,
                              }}
                            >
                              {tool.description.human.en_US}
                            </CommonStyles.Typography>
                          </div>
                        </div>
                      </Tooltip>
                      {/* <CommonStyles.Button
                        variant="outlined"
                        startIcon={<CommonIcons.Add />}
                        sx={{
                          border: `1px solid ${theme.palette.primary.main}`,
                        }}
                        onClick={() => {
                          handleAddNode(tool);
                        }}
                      >
                        <CommonStyles.Typography type="semiBold16">
                          Add
                        </CommonStyles.Typography>
                      </CommonStyles.Button> */}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
      </CommandList>
    </Command>
  );
};

export default ToolList;
