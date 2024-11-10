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
import { NodeProps } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import CommonStyles from "@/Components/CommonStyles";
import { Plus } from "lucide-react";
import { cloneDeep } from "lodash";

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
}

const PromptArea = ({ node }: PromptAreaProps) => {
  const data = node.data as unknown as LlmNodeData;

  const [listPrompts, setListPrompts] = useState<PromptTemplate[]>([]);
  const [active, setActive] = useState<Active | null>(null);

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

      setListPrompts(arrayMove(listPrompts, activeIndex, overIndex));
    }
    setActive(null);
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
    payload: PromptTemplate
  ) => {
    setListPrompts((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const newList = [...prev];
      newList[index] = payload;
      return newList;
    });
  };

  console.log("listPrompts", listPrompts);

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
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeItem ? (
          <PromptItem id={activeItem.id} promptData={activeItem} node={node} />
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
            console.log("add prompt");
            const nextList = cloneDeep(listPrompts)
            nextList.push({
              id: uuid(),
              role: PromptRoleEnum.USER,
              text: "",
            });
            setListPrompts(nextList);
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
