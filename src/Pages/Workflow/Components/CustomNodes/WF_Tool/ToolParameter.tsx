import CommonStyles from "@/Components/CommonStyles";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { capitalize, cloneDeep } from "lodash";
import EditorPromtpt from "../../misc/EditorPromtpt";
import { Parameter, ParameterOption } from "../../Toolbar/type";
import { NodeDataTool, ToolConfigurations, ToolParameters } from "./type";
import { memo, useMemo } from "react";
import useDebounce from "@/Hooks/useDebounce";
import CustomizeSelectField from "@/Components/CommonFields/CustomizeSelectField";
import { CommonOption } from "@/Types/common";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@mui/material";

interface ToolParameterProps {
  param: Parameter;
  toolParameter: ToolParameters;
  toolConfigurations: ToolConfigurations;
  isSelect?: boolean;
  isConfig?: boolean;
  nodeId: string;
  toolOptions: ParameterOption[];
}

const ToolParameter = ({
  param,
  isSelect,
  isConfig,
  toolParameter,
  toolConfigurations,
  nodeId,
  toolOptions,
}: ToolParameterProps) => {
  const theme = useTheme();
  const { handleUpdateNodeDataTool } = useWorkflowMutate();

  const handleUpdateParam = (value: string) => {
    const payload: Partial<NodeDataTool> = {};

    if (isConfig) {
      payload["tool_configurations"] = {
        [param.name]: value,
      };
    } else {
      payload["tool_parameters"] = {
        [param.name]: {
          value,
          type: toolParameter[param.name].type,
        },
      };
    }

    handleUpdateNodeDataTool(nodeId, payload);
  };

  const handleInputChange = useDebounce(handleUpdateParam);

  if (isSelect) {
    const customizeValue = (selectedOption: CommonOption) => {
      return (
        <div
          className="px-3 h-12 rounded-lg flex items-center justify-between w-full"
          style={{
            border: `1px solid ${theme.colors.custom.borderColor}`,
            background: theme.colors.custom.backgroundCard,
          }}
        >
          <CommonStyles.Typography type="semiBold16">
            {selectedOption.label}
          </CommonStyles.Typography>
          <div>
            <ChevronUp size={8} />
            <ChevronDown size={8} />
          </div>
        </div>
      );
    };

    const options = useMemo(() => {
      return cloneDeep(toolOptions).map((option) => {
        return {
          value: option.value,
          label: option.label.en_US,
        };
      });
    }, [toolOptions]);

    return (
      <div>
        <CommonStyles.Typography type="bold14" my={1}>
          {capitalize(param?.label.en_US)}
          {param?.required && <span className="text-red-500 ml-1">*</span>}
        </CommonStyles.Typography>
        <CustomizeSelectField
          options={options}
          initValue={
            (isConfig
              ? toolConfigurations[param.name]
              : toolParameter[param.name].value) || ""
          }
          afterOnChange={handleInputChange}
          customizeValue={customizeValue}
          classNameMenuContent="max-h-[300px] overflow-y-auto w-[400px]"
        />
      </div>
    );
  }

  return (
    <div>
      <CommonStyles.Typography type="bold14" my={1}>
        {capitalize(param?.label.en_US)}
        {param?.required && <span className="text-red-500 ml-1">*</span>}
      </CommonStyles.Typography>
      <EditorPromtpt
        id={`${nodeId}-${param.name}`}
        nodeId={nodeId}
        value={
          (isConfig
            ? toolConfigurations[param.name]
            : toolParameter[param.name].value) || ""
        }
        handleChangeEditor={(_, value) => {
          handleInputChange(value);
        }}
        className="min-h-10"
      />
    </div>
  );
};

export default memo(ToolParameter);
