import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { Plus, Shapes, Trash, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import DescriptionInput from "../../DescriptionInput";
import { NodeDataQuestClassifier } from "./type";
import FormModel from "../../misc/FormModel";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { useCallback, useMemo } from "react";
import {
  Vars,
  VarSelectorOptionInterface,
} from "../WF_VariableAggregator/ListAssignVars";
import { cloneDeep, isEmpty } from "lodash";
import VarSelectorSelect from "../WF_VariableAggregator/VarSelectorSelect";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { v4 as uuid } from "uuid";
import EditorPrompt from "../../misc/EditorPromtpt";
import VarOutList from "../../misc/VarOutList";

interface VarAggNodeDrawerProps {
  node?: NodeProps;
}
const QuestClassifierNodeDrawer = ({ node }: VarAggNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { t } = useTranslation("node");
  const {} = useWorkflowMutate();

  const { handleUpdateNodeDataQuestClassifier } = useWorkflowMutate();

  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataQuestClassifier;
  const { data: varSelectors } = useGetVariableSelectors(node?.id);

  const varSelectorOptions = useMemo(() => {
    if (!varSelectors) return [];

    const options: VarSelectorOptionInterface[] = [];

    varSelectors.variable_selectors?.forEach((vars) => {
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
  }, [varSelectors]);

  const handleUpdate = (payload: Partial<NodeDataQuestClassifier>) => {
    handleUpdateNodeDataQuestClassifier(node?.id, payload);
  };

  const handleSelectVar = (vars: Vars) => {
    handleUpdateNodeDataQuestClassifier(node?.id, {
      query_variable_selector: vars?.value?.split("-"),
    });
  };

  const handleChangeClassName = useCallback(
    (
      id: string,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newClasses = cloneDeep(nodeData?.classes).map((elm) => {
        if (elm.id === id) {
          return {
            ...elm,
            name: e.target.value,
          };
        }
        return elm;
      });

      handleUpdateNodeDataQuestClassifier(node?.id, {
        classes: newClasses,
      });
    },
    [handleUpdateNodeDataQuestClassifier, node?.id, nodeData?.classes]
  );

  const handleRemoveClass = useCallback(
    (id: string) => {
      const newClasses = nodeData?.classes.filter((elm) => elm.id !== id);

      handleUpdateNodeDataQuestClassifier(node?.id, {
        classes: newClasses,
      });
    },
    [nodeData?.classes, handleUpdateNodeDataQuestClassifier, node?.id]
  );

  const handleAddClass = useCallback(
    (e: any) => {
      e.stopPropagation();

      const newClasses = [
        ...nodeData?.classes,
        {
          id: uuid(),
          name: "",
        },
      ];

      handleUpdateNodeDataQuestClassifier(node?.id, {
        classes: newClasses,
      });
    },
    [nodeData?.classes, handleUpdateNodeDataQuestClassifier, node?.id]
  );

  const handleUpdateInstruction = useCallback(
    (id: string, value: string) => {
      handleUpdateNodeDataQuestClassifier(id, {
        instruction: value,
      });
    },
    [handleUpdateNodeDataQuestClassifier]
  );

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
              <Shapes className="w-3.5 h-3.5" color="#fff" />
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
      <div className="px-3 my-3">
        <FormModel
          handleUpdateNodeData={handleUpdateNodeDataQuestClassifier}
          model={nodeData?.model}
          nodeId={node?.id}
          memory={nodeData?.memory}
        />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-4">
        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {t("common.query_variable")}
            </CommonStyles.Typography>
          }
        >
          <div className="mt-4 px-3 mb-2">
            <VarSelectorSelect
              handleSelectVar={handleSelectVar}
              varSelectorOptions={varSelectorOptions}
              variables={[nodeData?.query_variable_selector]}
              value={
                isEmpty(nodeData?.query_variable_selector)
                  ? undefined
                  : `${nodeData?.query_variable_selector?.[0]}-${nodeData?.query_variable_selector?.[1]}`
              }
            />
          </div>
        </CollapseArea>
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-4">
        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {t("WF_QuestionClassifier.classes")}
            </CommonStyles.Typography>
          }
        >
          <div className="my-3 px-3 flex flex-col gap-4">
            {nodeData?.classes?.map((elm, index) => {
              return (
                <div key={elm.id} className="relative">
                  <div className="absolute top-0 right-2">
                    <CommonStyles.Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveClass(elm.id);
                      }}
                      isIcon
                      hasBorder={false}
                      color="error"
                    >
                      <Trash size={12} />
                    </CommonStyles.Button>
                  </div>
                  <CommonStyles.Input
                    initValue={elm.name}
                    label={`Class ${index + 1}`}
                    multiline
                    minRows={2}
                    afterOnchange={(e) => {
                      handleChangeClassName(elm.id, e);
                    }}
                    fullWidth
                    placeholder="Enter class name..."
                  />
                </div>
              );
            })}
            <CommonStyles.Button
              variant="contained"
              className="flex gap-2"
              onClick={handleAddClass}
            >
              <Plus size={16} />
              {t("WF_QuestionClassifier.add_class")}
            </CommonStyles.Button>
          </div>
        </CollapseArea>

        <hr className="my-2 mx-4 opacity-20" />

        <CollapseArea
          label={
            <CommonStyles.Typography type="semiBold16">
              {t("WF_QuestionClassifier.instruction")}
            </CommonStyles.Typography>
          }
        >
          <EditorPrompt
            id={node?.id}
            nodeId={node?.id}
            value={nodeData?.instruction}
            handleChangeEditor={handleUpdateInstruction}
          />
        </CollapseArea>

        <hr className="my-2 mx-4 opacity-20" />

        <VarOutList nodeData={nodeData} />
      </div>
    </div>
  );
};

export default QuestClassifierNodeDrawer;
