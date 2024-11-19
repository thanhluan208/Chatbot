import { useEffect, useMemo, useState } from "react";
import { LlmNodeData, PromptRoleEnum, PromptTemplate } from "./type";
import {
  Active,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import PromptItem from "./PromptItem";
import { Node, NodeProps } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import CommonStyles from "@/Components/CommonStyles";
import { Plus } from "lucide-react";
import { cloneDeep } from "lodash";
import useGetVariableSelectors from "@/Hooks/workflow/useGetVariableSelectors";
import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface PromptAreaProps {
  node: NodeProps;
  handleUpdate: (
    payload: Partial<LlmNodeData>,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => void;
}

const PromptArea = ({ node, handleUpdate }: PromptAreaProps) => {
  const data = node.data as unknown as LlmNodeData;

  const [listPrompts, setListPrompts] = useState<PromptTemplate[]>([]);
  const [active, setActive] = useState<Active | null>(null);

  const { data: varSelectors } = useGetVariableSelectors(node?.id);

  console.log(varSelectors);

  const varList = useMemo(() => {
    if (!varSelectors?.variable_selectors) return [];

    const list: NodeOutPutVar[] = [];

    varSelectors?.variable_selectors?.forEach((item) => {
      const index = list.findIndex((elm) => elm.nodeId === item.value[0]);
      if (index !== -1) {
        list[index].vars.push({
          type: item.type,
          variable: item.value[1],
        });
      } else {
        list.push({
          nodeId: item.value[0],
          title: item.value[0],
          vars: [
            {
              type: item.type,
              variable: item.value[1],
            },
          ],
        });
      }
    });

    return list;
  }, [varSelectors?.variable_selectors]);

  const workflowNodesMap = useMemo(() => {
    const map: Record<string, Pick<Node["data"], "title" | "type">>  = {}

    if (!varSelectors?.variable_selectors) return map;

    varSelectors?.variable_selectors?.forEach((item) => {
      map[item.value[0]] = {
        title: item.value[0],
        type: item.type
      }
    });

    return map
  },[varSelectors?.variable_selectors])

  const activeItem = useMemo(
    () => listPrompts.find((item) => item.id === active?.id),
    [active, listPrompts]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      const activeIndex = listPrompts.findIndex(({ id }) => id === active.id);
      const overIndex = listPrompts.findIndex(({ id }) => id === over.id);

      const nextListPrompt = arrayMove(listPrompts, activeIndex, overIndex);
      handleMutateListPrompt(nextListPrompt);
      setListPrompts(nextListPrompt);
    }
    setActive(null);
  };

  const handleMutateListPrompt = (newListPrompt: PromptTemplate[]) => {
    const memoryIndex = newListPrompt.findIndex(
      (item) => item.role === PromptRoleEnum.Memory
    );

    const payload: Partial<LlmNodeData> = {
      name: node.id,
      desc: data.desc,
      memory: {
        ...data.memory,
        position_index_in_chat_messages: memoryIndex,
      },
      position: data.position,
      prompt_template: cloneDeep(newListPrompt).filter(
        (prompt) => prompt.role !== PromptRoleEnum.Memory
      ),
      model: data.model,
    };

    handleUpdate(payload);
  };

  useEffect(() => {
    if (data?.prompt_template) {
      const listPrompt = data.prompt_template.map((prompt) => {
        return {
          ...prompt,
          id: uuid(),
        };
      });

      if (data.memory) {
        listPrompt.splice(data.memory.position_index_in_chat_messages, 0, {
          id: uuid(),
          role: PromptRoleEnum.Memory,
          text: "",
        });
      }

      setListPrompts(listPrompt);
    }
  }, [data?.prompt_template, data?.memory]);

  const handleUpdateListPrompt = (
    id: UniqueIdentifier,
    payload?: PromptTemplate,
    isDelete?: boolean
  ) => {
    if (isDelete) {
      const newList = listPrompts.filter((item) => item.id !== id);
      handleMutateListPrompt(newList);

      return setListPrompts(newList);
    }

    const index = listPrompts.findIndex((item) => item.id === id);
    const newList = cloneDeep(listPrompts);
    if (payload) {
      newList[index] = payload;
    }
    handleMutateListPrompt(newList);
    setListPrompts(newList);
  };

  const handleAddPrompt = () => {
    const nextList = cloneDeep(listPrompts);
    nextList.push({
      id: uuid(),
      role: PromptRoleEnum.USER,
      text: "",
    });
    setListPrompts(nextList);
    handleMutateListPrompt(nextList);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={listPrompts}>
        <ul className="flex flex-col gap-2.5" role="application">
          {listPrompts.map((item) => (
            <PromptItem
              key={item.id}
              id={item.id}
              promptData={item}
              node={node}
              handleUpdateListPrompt={handleUpdateListPrompt}
              varList={varList}
              workflowNodesMap={workflowNodesMap}
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeItem ? (
          <PromptItem
            id={activeItem.id}
            promptData={activeItem}
            node={node}
            varList={varList}
            workflowNodesMap={workflowNodesMap}
          />
        ) : null}
      </DragOverlay>
      <div className="pl-2 pr-12">
        <CommonStyles.Button
          variant="contained"
          sx={{
            marginTop: "20px",
            width: "100%",
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            handleAddPrompt();
          }}
        >
          <Plus size={24} />
          Add Prompt
        </CommonStyles.Button>
      </div>
    </DndContext>
  );
};

export default PromptArea;
