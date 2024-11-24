import { NodeProps } from "@xyflow/react";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useTheme } from "@mui/material";
import { Pickaxe, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import DescriptionInput from "../../DescriptionInput";
import { NodeDataParamExtractor, Output } from "./type";
import FormModel from "../../misc/FormModel";
import { useTranslation } from "react-i18next";
import EditorPrompt from "../../misc/EditorPromtpt";
import OutputItem from "./OutputItem";
import { useMemo } from "react";
import { StartNodeInputType } from "@/Types/workflow";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { v4 as uuid } from "uuid";
import { cloneDeep } from "lodash";

interface ParamExtractorDrawerProps {
  node: NodeProps;
}
const ParamExtractorDrawer = ({ node }: ParamExtractorDrawerProps) => {
  const theme = useTheme();
  const { t } = useTranslation("node");
  const { workflowId } = useParams();
  const save = useSave();
  const { handleUpdateNodeDataParamExtractor } = useWorkflowMutate();

  const nodeData = node?.data as unknown as NodeDataParamExtractor;

  const outputList = useMemo(() => {
    const list: Output[] = [];

    Object.entries(nodeData?.outputs).map(([key, value]) => {
      list.push({
        id: uuid(),
        name: key,
        type: value.type,
        desc: value.desc,
      });
    });

    return list;
  }, [nodeData?.outputs]);

  const handleUpdate = (payload: Partial<any>) => {
    handleUpdateNodeDataParamExtractor(node?.id, payload);
  };

  const handleChangePrompt = (id: string, value: string) => {
    handleUpdateNodeDataParamExtractor(id, {
      prompt_template: value,
    });
  };

  const handleChangeInstruction = (id: string, value: string) => {
    handleUpdateNodeDataParamExtractor(id, {
      outputs_instruction: value,
    });
  };

  const handleAddOutVar = () => {
    const newOutput = cloneDeep(nodeData?.outputs);

    newOutput[`output_${Object.keys(nodeData.outputs).length + 1}`] = {
      type: StartNodeInputType.TEXT_INPUT,
      desc: "",
    };

    handleUpdateNodeDataParamExtractor(node?.id, {
      outputs: newOutput,
    });
  };

  const handleUpdateOutput = (payload: Output) => {
    const updateOutput = outputList.find(
      (item) => item.id === payload.id
    )?.name;

    const newOutputs = cloneDeep(nodeData?.outputs);

    if (updateOutput) {
      delete newOutputs[updateOutput];
    }

    newOutputs[payload.name] = {
      type: payload.type,
      desc: payload.desc,
    };

    handleUpdateNodeDataParamExtractor(node?.id, {
      outputs: newOutputs,
    });
  };

  const handleRemoveOutput = (name: string) => {
    const newOutputs = cloneDeep(nodeData?.outputs);

    console.log("newOutputs", newOutputs[name]);

    delete newOutputs[name];

    handleUpdateNodeDataParamExtractor(node?.id, {
      outputs: newOutputs,
    });
  }

  return (
    <div
      className="py-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 ">
            <div
              className="w-6 h-6 flex items-center justify-center rounded-md"
              style={{
                background: theme.palette.primary.main,
              }}
            >
              <Pickaxe className="w-3.5 h-3.5" color="#fff" />
            </div>
            <EditLabelNode nodeId={node.id} workflowId={workflowId} />
          </div>

          <CommonStyles.Button
            isIcon
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={() => {
              save(cachedKeys.NODE_EDITING, null);
            }}
          >
            <X size={24} />
          </CommonStyles.Button>
        </div>
        <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />
      </div>

      <FormModel
        handleUpdateNodeData={handleUpdateNodeDataParamExtractor}
        model={nodeData?.model}
        nodeId={node?.id}
      />

      <div className="my-3 px-4">
        <CommonStyles.Typography type="semiBold16">
          {t("WF_ParamExtractor.prompt_template")}
        </CommonStyles.Typography>

        <EditorPrompt
          handleChangeEditor={handleChangePrompt}
          id={`${node.id}-prompt`}
          value={nodeData?.prompt_template}
          nodeId={node?.id}
        />
      </div>

      <div className="my-3 px-4">
        <CommonStyles.Typography type="semiBold16">
          {t("WF_ParamExtractor.outputs_instruction")}
        </CommonStyles.Typography>

        <EditorPrompt
          handleChangeEditor={handleChangeInstruction}
          id={`${node.id}-outputs_instruction`}
          value={nodeData?.prompt_template}
          nodeId={node?.id}
        />
      </div>

      <CollapseArea
        label={
          <CommonStyles.Typography type="semiBold16">
            {t("common.variable_out")}
          </CommonStyles.Typography>
        }
      >
        <div className="px-4">
          {outputList.map((item) => {
            return (
              <OutputItem
                data={item}
                key={item.name}
                handleUpdate={handleUpdateOutput}
                handleRemoveOutput={handleRemoveOutput}
              />
            );
          })}

          <CommonStyles.Button
            variant="contained"
            sx={{ mt: "20px" }}
            onClick={handleAddOutVar}
          >
            Add Output Variable
          </CommonStyles.Button>
        </div>
      </CollapseArea>
    </div>
  );
};

export default ParamExtractorDrawer;
