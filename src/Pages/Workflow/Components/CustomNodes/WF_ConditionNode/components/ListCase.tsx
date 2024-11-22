import CommonStyles from "@/Components/CommonStyles";
import { useTranslation } from "react-i18next";
import { Case, ConditionNodeData } from "../type";
import {
  Active,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import CaseItem from "./CaseItem";
import { useReactFlow } from "@xyflow/react";
import { cloneDeep, isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";

interface ListCaseProps {
  cases: Case[];
  nodeId: string;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

const ListCase = ({ cases, nodeId }: ListCaseProps) => {
  const [active, setActive] = useState<Active | null>(null);

  const { t } = useTranslation("node");

  const { handleUpdateNodeDataCondition } = useWorkflowMutate();
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);

  if (!node) return;

  const nodeData = node?.data as unknown as ConditionNodeData;

  const activeItem = useMemo(
    () => cases.find((item) => item.id === active?.id),
    [active, cases]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActive(null);

    const newCases = cloneDeep(nodeData)?.cases?.map((elm) => {
      if (elm.id === active?.id) {
        return nodeData?.cases?.find((caseElm) => caseElm.id === over?.id) || elm;
      }
      if (elm.id === over?.id) {
        return nodeData?.cases?.find((caseElm) => caseElm?.id === active?.id) || elm;
      }

      return elm;
    });

    handleUpdateNodeDataCondition(nodeId, {
      cases: newCases,
    });
  };

  const handleAddCase = () => {
    const newCases = cloneDeep(nodeData)?.cases;
    const id = uuid()

    newCases.push({
      case_id: id,
      id: id,
      conditions: [],
      logical_operator: "and",
    });

    handleUpdateNodeDataCondition(nodeId, {
      cases: newCases,
    });
  };

  return (
    <div className="mt-2">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActive(null);
        }}
      >
        <SortableContext items={cases}>
          <ul className="flex flex-col gap-2.5" role="application">
            {cases?.map((caseElm, index) => {
              return (
                <CaseItem
                  nodeId={nodeId}
                  id={caseElm?.case_id}
                  caseData={caseElm}
                  key={caseElm?.case_id}
                  index={`${index}`}
                  enableDeleteBtn={cases.length > 1}
                />
              );
            })}
          </ul>
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem ? (
            <CaseItem
              nodeId={nodeId}
              id={activeItem?.case_id}
              caseData={activeItem}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-2">
        <CommonStyles.Button
          variant="contained"
          disabled={
            isEmpty(cases[cases?.length - 1]?.conditions) && !isEmpty(cases)
          }
          onClick={handleAddCase}
        >
          Add case
        </CommonStyles.Button>
      </div>
      <div className="w-full px-2 mt-4 flex ">
        <div className="relative  pr-6 justify-start w-full">
          <CommonStyles.Typography type="semiBold16">
            ELSE
          </CommonStyles.Typography>
          <CommonStyles.Typography>
            {t("WF_ConditionNode.else_description")}
          </CommonStyles.Typography>
        </div>
      </div>
    </div>
  );
};

export default ListCase;
