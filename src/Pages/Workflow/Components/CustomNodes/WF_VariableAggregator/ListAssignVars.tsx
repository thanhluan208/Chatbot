import { useTranslation } from "react-i18next";
import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import VarSelectorSelect from "./VarSelectorSelect";
import { cloneDeep } from "lodash";
import { Group } from "./type";
import { Folder, Trash } from "lucide-react";

interface ListAssignVarsProps {
  variables: string[][];
  nodeId: string;
  output_type: string;
  isGroupItem?: boolean;
  groupName?: string;
  handleUpdateGroup?: (groupData: Group, isRemove?: boolean) => void;
  disabledRemove?: boolean;
}

export interface VarSelectorOptionInterface {
  node: string;
  vars: Vars[];
}

export type Vars = {
  value: string;
  type: string;
  name: string;
  node?: string;
};

const ListAssignVars = ({
  variables,
  output_type,
  nodeId,
  isGroupItem,
  groupName,
  handleUpdateGroup,
  disabledRemove,
}: ListAssignVarsProps) => {
  const { t } = useTranslation("node");
  const theme = useTheme();

  const [type, setType] = useState("");

  const timeoutRef = useRef<number | null>(null);

  const { data: varSelectors } = useGetVariableSelectors(nodeId);
  const { handleUpdateNodeDataVarAgg } = useWorkflowMutate();

  const varSelectorOptions = useMemo(() => {
    if (!varSelectors) return [];

    const options: VarSelectorOptionInterface[] = [];

    varSelectors.variable_selectors?.forEach((vars) => {
      if (type && vars?.type !== type) return;

      const index = options.findIndex((elm) => elm.node === vars.value?.[0]);

      if (index !== -1) {
        options[index]?.vars.push({
          value: `${vars.value?.[0]}-${vars.value?.[1]}`,
          type: vars.type,
          name: vars.value?.[1],
        });
      } else {
        options.push({
          node: vars.value?.[0],
          vars: [
            {
              value: `${vars.value?.[0]}-${vars.value?.[1]}`,
              type: vars.type,
              name: vars.value?.[1],
            },
          ],
        });
      }
    });

    return options;
  }, [type, varSelectors]);


  const handleSelectVar = (vars: Vars, oldVars?: string) => {
    let hasAdded = false;

    const newVars = cloneDeep(variables).map((elm) => {
      if (elm.join("-") === oldVars) {
        hasAdded = true;
        return vars.value.split("-");
      }
      return elm;
    });

    if (!hasAdded) {
      newVars.push(vars.value.split("-"));
    }

    if (isGroupItem) {
      return (
        handleUpdateGroup &&
        handleUpdateGroup({
          group_name: groupName || "",
          output_type: output_type,
          variables: newVars,
        })
      );
    } else {
      handleUpdateNodeDataVarAgg(nodeId, {
        output_type: vars.type,
        variables: newVars,
      });
    }
  };

  const handleRemoveVar = (vars: string) => {
    const newVars = variables.filter((elm) => elm.join("-") !== vars);

    const payload = {
      output_type: newVars.length === 0 ? "none" : output_type,
      variables: newVars,
    };

    if (isGroupItem) {
      return (
        handleUpdateGroup &&
        handleUpdateGroup({
          group_name: groupName || "",
          output_type: output_type,
          variables: newVars,
        })
      );
    }

    handleUpdateNodeDataVarAgg(nodeId, payload);
  };

  const handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!event.target.value) return;
      handleUpdateGroup &&
        handleUpdateGroup({
          group_name: groupName || "",
          output_type: output_type,
          variables: variables,
          newName: event.target.value,
        });
    }, 500);
  };

  const handleRemoveGroup = () => {
    handleUpdateGroup &&
      handleUpdateGroup(
        {
          group_name: groupName || "",
          output_type: output_type,
          variables: variables,
        },
        true
      );
  };

  useEffect(() => {
    if (output_type) {
      setType(output_type === "none" ? "" : output_type);
    }
  }, [output_type]);

  return (
    <div>
      <Box
        className="flex items-center justify-between mt-4"
        sx={{
          "&:hover": {
            button: {
              opacity: 1,
            },
          },
        }}
      >
        {isGroupItem ? (
          <div className="flex gap-2 items-center">
            <Folder size={16} />
            <CommonStyles.Input
              initValue={groupName}
              key={groupName}
              afterOnchange={handleChangeGroupName}
              sxContainer={{
                div: {
                  background: "transparent",
                  borderRadius: "8px",
                  "&:hover": {
                    background: theme.colors.custom.background,
                  },
                },
                input: {
                  height: "10px",
                  width: "fit-content",
                  transform: "translateY(-1px)",
                  padding: "8px !important",
                },
                fieldset: {
                  border: "none",
                  borderRadius: "8px !important",
                },
                "& .Mui-focused": {
                  fieldset: {
                    border: "solid 1px ",
                  },
                },
              }}
            />
            {!disabledRemove && (
              <CommonStyles.Button
                isIcon
                hasBorder={false}
                className="max-w-6 max-h-6 opacity-0 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveGroup();
                }}
              >
                <Trash size={16} />
              </CommonStyles.Button>
            )}
          </div>
        ) : (
          <CommonStyles.Typography type="semiBold16">
            {t("WF_VarAgg.assign_variables")}
          </CommonStyles.Typography>
        )}

        {output_type !== "none" && (
          <div
            className="px-3 py-1 rounded-md"
            style={{
              backgroundColor: theme.colors.custom.backgroundCard,
              border: `1px solid ${theme.colors.custom.borderColor}`,
            }}
          >
            {output_type}
          </div>
        )}
      </Box>
      <div className="mt-4 flex flex-col gap-2 mb-2">
        {variables?.map((vars) => {
          return (
            <VarSelectorSelect
              key={`${vars?.[0]}-${vars?.[1]}`}
              handleSelectVar={handleSelectVar}
              varSelectorOptions={varSelectorOptions}
              variables={variables}
              value={`${vars?.[0]}-${vars?.[1]}`}
              handleRemoveVar={handleRemoveVar}
            />
          );
        })}

        <VarSelectorSelect
          handleSelectVar={handleSelectVar}
          varSelectorOptions={varSelectorOptions}
          variables={variables}
        />
      </div>
    </div>
  );
};

export default memo(ListAssignVars);
