import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { PromptRoleEnum, PromptTemplate } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import { NodeProps } from "@xyflow/react";
import Editor from "./Editor";
import { Grip } from "lucide-react";
import { useTheme } from "@mui/material";

interface PromptItemProps {
  id: UniqueIdentifier;
  promptData: PromptTemplate;
  node: NodeProps;
  handleUpdateListPrompt?: (
    id: UniqueIdentifier,
    payload: PromptTemplate
  ) => void;
}

const PromptItem = ({
  id,
  promptData,
  node,
  handleUpdateListPrompt,
}: PromptItemProps) => {
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

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const roleOptions = [
    {
      value: PromptRoleEnum.USER,
      label: "User",
    },
    {
      value: PromptRoleEnum.ASSISTANT,
      label: "Assistant",
    },
  ];

  const handleSelectRole = (value: string) => {
    if (value === promptData.role) return;
    promptData.role = value;
    handleUpdateListPrompt?.(id, promptData);
  };

  return (
    <li className="flex pr-10 relative" ref={setNodeRef} style={style}>
      {promptData.role === PromptRoleEnum.Memory ? (
        <div className="px-2 w-full">
          <CommonStyles.Typography
            sx={{
              py: 1,
              px: 2,
              borderRadius: "8px",
              border: `1px solid ${theme.colors.custom.borderColor}`,
              background: theme.colors.custom.backgroundCard,
            }}
            type="semiBold12"
          >
            MEMORIES
          </CommonStyles.Typography>
        </div>
      ) : (
        <div className="w-full px-2">
          <div className="mb-4">
            {promptData.role === PromptRoleEnum.SYSTEM ? (
              <CommonStyles.Typography type="semiBold14">
                System
              </CommonStyles.Typography>
            ) : (
              <CommonStyles.Select
                options={roleOptions}
                value={promptData.role}
                handleChange={handleSelectRole}
                variant="standard"
                sx={{
                  div: {
                    borderRadius: "8px",
                    background: "transparent",
                  },
                }}
              />
            )}
          </div>
          <div className="nodrag cursor-pointer">
            <Editor
              controlPromptEditorRerenderKey={node.id}
              nodeId={node.id}
              parentNodes={(node.data?.parentNodes as string[]) || []}
              initValue={promptData.text}
            />
          </div>
        </div>
      )}
      <button
        className="absolute right-0 p-0 w-10 h-10 flex justify-center items-center top-1/2 transform -translate-y-1/2"
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
      >
        <Grip className="h-4 w-4" />
      </button>
    </li>
  );
};

export default PromptItem;
