import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "@mui/material";
import { Grip, Plus, Trash } from "lucide-react";
import CommonStyles from "@/Components/CommonStyles";
import {
  Case,
  ComparisonOperator,
  Condition,
  ConditionNodeData,
} from "../type";
import { useReactFlow } from "@xyflow/react";
import { cloneDeep, isEmpty } from "lodash";
import ConditionItem from "./ConditionItem";
import Prompt from "./Prompt";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";

interface CaseItemProps {
  id: UniqueIdentifier;

  index?: string;
  nodeId: string;
  caseData: Case;
  enableDeleteBtn?: boolean;
}
const CaseItem = ({
  id,
  index,
  nodeId,
  caseData,
  enableDeleteBtn,
}: CaseItemProps) => {
  const theme = useTheme();
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const { getNode, updateNode } = useReactFlow();
  const { handleUpdateNodeDataCondition } = useWorkflowMutate();

  const node = getNode(nodeId);
  if (!node) return;

  const nodeData = node?.data as unknown as ConditionNodeData;

  const handleAddCondition = () => {
    const newCase = cloneDeep(nodeData)?.cases.map((elm) => {
      if (elm.case_id === id) {
        const newCondition = cloneDeep(elm.conditions);
        newCondition.push({
          comparison_operator: ComparisonOperator.START_WITH,
          value: "",
          varType: undefined,
          variable_selector: undefined,
        });

        return {
          ...elm,
          conditions: newCondition,
        };
      }

      return elm;
    });

    updateNode(nodeId, {
      data: {
        ...nodeData,
        cases: newCase,
      },
    });
  };

  const handleChangeLogicOperator = () => {
    const newCases = cloneDeep(nodeData)?.cases?.map((elm) => {
      if (elm.case_id === id) {
        return {
          ...elm,
          logical_operator: caseData?.logical_operator === "and" ? "or" : "and",
        };
      }
      return elm;
    });

    handleUpdateNodeDataCondition(nodeId, {
      cases: newCases,
    });
  };

  const handleUpdateCondition =
    (condition: Condition) =>
    (payload: Partial<Condition>, isRemove?: boolean) => {
      let newCases = cloneDeep(nodeData)?.cases?.map((elm) => {
        if (
          elm.conditions?.some(
            (cond) => JSON.stringify(cond) === JSON.stringify(condition)
          )
        ) {
          const newConditions = elm?.conditions?.map((cond) => {
            if (JSON.stringify(cond) === JSON.stringify(condition)) {
              return {
                ...cond,
                ...payload,
              };
            }

            return cond;
          });

          return {
            ...elm,
            conditions: isRemove
              ? newConditions.filter(
                  (elm) => JSON.stringify(elm) !== JSON.stringify(payload)
                )
              : newConditions,
          };
        }

        return elm;
      });

      handleUpdateNodeDataCondition(nodeId, {
        cases: newCases,
      });
    };

  const handleRemoveCases = () => {
    const newCases = cloneDeep(nodeData)?.cases?.filter(
      (elm) => elm.case_id !== id
    );

    handleUpdateNodeDataCondition(nodeId, {
      cases: newCases,
    });
  };

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li className="flex pr-12 relative" ref={setNodeRef} style={style}>
      <div className="w-full">
        <div
          className="w-full px-3 py-2 rounded-lg"
          style={{
            background: theme.colors.custom.backgroundCard,
            border: `1px solid ${theme.colors.custom.borderColor}`,
          }}
        >
          <div className="mb-1 flex items-center w-full">
            <div className="flex gap-1 w-full flex-col">
              <CollapseArea
                label={
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center ">
                      <CommonStyles.Typography type="semiBold16">
                        {index
                          ? Number(index) === 0
                            ? "IF"
                            : "ELSE IF"
                          : "DRAGGING"}
                      </CommonStyles.Typography>
                      <CommonStyles.Typography className="opacity-50 !ml-2">
                        {index && `Case ${+index + 1}`}
                      </CommonStyles.Typography>
                    </div>

                    {enableDeleteBtn && (
                      <div className=" flex items-end justify-center">
                        <CommonStyles.Button
                          isIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCases();
                          }}
                          color="error"
                        >
                          <Trash size={16} />
                        </CommonStyles.Button>
                      </div>
                    )}
                  </div>
                }
              >
                <div className="w-full  flex flex-col gap-2 py-2 pl-7 justify-center">
                  <div className="relative">
                    {caseData?.conditions?.length >= 2 && (
                      <div
                        className="absolute w-[90%] h-[85%] top-[5%] -left-[6%] rounded-lg"
                        style={{
                          border: `solid 1px ${theme.colors.custom.borderColor}`,
                        }}
                      >
                        <CommonStyles.Button
                          className=" absolute flex flex-col gap-1 top-2/4 !h-fit -translate-y-2/4 -translate-x-2/4 !w-fit !min-w-0 !px-1.5 !py-1"
                          style={{
                            border: `solid 1px ${theme.colors.custom.borderColor}`,
                            background: theme.colors.custom.background,
                          }}
                          onClick={handleChangeLogicOperator}
                        >
                          <CommonStyles.Typography type="semiBold10">
                            {caseData?.logical_operator === "and"
                              ? "And"
                              : "Or"}
                          </CommonStyles.Typography>
                        </CommonStyles.Button>
                      </div>
                    )}
                    <div className="relative z-50 flex flex-col gap-4 backdrop-blur-3xl">
                      {caseData &&
                        caseData?.conditions?.map((condition) => {
                          const handleUpdate = handleUpdateCondition(condition);

                          return (
                            <div
                              className="flex flex-col gap-2"
                              key={JSON.stringify(condition)}
                            >
                              <ConditionItem
                                condition={condition}
                                nodeId={nodeId}
                                handleUpdateCondition={handleUpdate}
                              />
                              {condition?.variable_selector && (
                                <Prompt
                                  nodeId={nodeId}
                                  value={condition.value || ""}
                                  handleUpdateCondition={handleUpdate}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <CommonStyles.Button
                  variant="contained"
                  sx={{
                    width: "160px !important",
                    height: "32px !important",
                    textWrap: "nowrap",
                    gap: "12px",
                  }}
                  disabled={
                    isEmpty(
                      caseData?.conditions[caseData?.conditions?.length - 1]
                        ?.variable_selector
                    ) && !isEmpty(caseData?.conditions)
                  }
                  onClick={handleAddCondition}
                >
                  <Plus size={14} />
                  <CommonStyles.Typography type="semiBold14">
                    Add condition
                  </CommonStyles.Typography>
                </CommonStyles.Button>
              </CollapseArea>
            </div>
          </div>
        </div>
      </div>
      <button
        className="absolute right-0 p-0 w-10 h-10 flex justify-center items-center top-1 "
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
      >
        <Grip className="h-4 w-4" />
      </button>
    </li>
  );
};

export default CaseItem;

// "cases": [
//   {
//       "case_id": "case_1",
//       "conditions": [
//           # {
//           #     "comparison_operator": "start with",
//           #     "value": "",
//           #     "varType": "string",
//           #     "variable_selector": ["start", "BOT_USER_INPUT"],
//           # }
//       ],
//       "id": "case_1",
//       "logical_operator": "and"
//   }
// ],
