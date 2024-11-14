import CommonStyles from "@/Components/CommonStyles";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Box, useTheme } from "@mui/material";
import { Check, ChevronsUpDown, Trash, Variable } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Vars, VarSelectorOptionInterface } from "./ListAssignVars";
import { cn } from "@/lib/utils";
import { WORKFLOW_ICON } from "@/Constants/common";

interface VarSelectorSelectProps {
  varSelectorOptions: VarSelectorOptionInterface[];
  variables: string[][];
  handleSelectVar: (vars: Vars, oldVar?: string) => void;
  value?: string;
  handleRemoveVar?: (vars: string) => void;
}

const VarSelectorSelect = ({
  varSelectorOptions,
  variables,
  handleSelectVar,
  handleRemoveVar,
  value,
}: VarSelectorSelectProps) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation("node");
  const theme = useTheme();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full "
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Box
            className="w-full justify-between flex items-center"
            sx={{
              "&:hover": {
                button: {
                  opacity: 1,
                },
              },
            }}
          >
            <div className="flex items-center gap-2">
              {!value ? (
                <Variable size={14} />
              ) : (
                WORKFLOW_ICON[
                  `customNode_WF_${
                    value?.split("-")?.[0]
                  }` as keyof typeof WORKFLOW_ICON
                ]
              )}
              <CommonStyles.Typography type="semiBold14">
                {value || t("WF_VarAgg.choose_variable")}
              </CommonStyles.Typography>
              {value && (
                <CommonStyles.Button
                  className="opacity-0 transition-opacity duration-200 max-h-6 max-w-6"
                  isIcon
                  hasBorder={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVar && handleRemoveVar(value);
                  }}
                >
                  <Trash size={14} />
                </CommonStyles.Button>
              )}
            </div>
            <ChevronsUpDown className="opacity-50" />
          </Box>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(min(50vw,600px)-48px)] p-0 "
        style={{
          zIndex: 9999,
          borderColor: theme.colors.custom.borderColor,
        }}
      >
        <Command
          className="rounded-sm"
          style={{
            backgroundColor: theme.colors.custom.backgroundCard,
            color: theme.colors.custom.normalColorTypo,
          }}
        >
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No variables found!.</CommandEmpty>
            <CommandGroup>
              {varSelectorOptions &&
                varSelectorOptions?.map((nodes) => {
                  return (
                    <div key={nodes?.node}>
                      <CommonStyles.Typography
                        type="semiBold16"
                        sx={{
                          marginLeft: "12px",
                          marginTop: "12px",
                        }}
                      >
                        {nodes?.node?.toUpperCase()}
                      </CommonStyles.Typography>
                      {nodes?.vars?.map((vars) => {
                        const isSelected = variables.some(
                          (elm) => `${elm?.[0]}-${elm?.[1]}` === vars.value
                        );
                        return (
                          <CommandItem
                            key={vars.value}
                            value={vars.value}
                            onSelect={() => {
                              if (isSelected) return;
                              handleSelectVar(vars, value);
                              setOpen(false);
                            }}
                            className="flex items-center justify-between hover:opacity-85 cursor-pointer"
                            style={{
                              background: theme.colors.custom.backgroundCard,
                            }}
                          >
                            <Box
                              className="flex items-center gap-2"
                              sx={{
                                svg: {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            >
                              <Check
                                className={
                                  (cn("ml-auto"),
                                  isSelected ? "opacity-1" : "opacity-0")
                                }
                              />
                              {
                                WORKFLOW_ICON[
                                  `customNode_WF_${nodes.node}` as keyof typeof WORKFLOW_ICON
                                ]
                              }
                              <CommonStyles.Typography type="semiBold14">
                                {vars.name}
                              </CommonStyles.Typography>
                            </Box>

                            <CommonStyles.Typography className="opacity-50">
                              {vars.type}
                            </CommonStyles.Typography>
                          </CommandItem>
                        );
                      })}
                    </div>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VarSelectorSelect;
