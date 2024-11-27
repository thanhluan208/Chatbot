import EditorPrompt from "../../misc/EditorPromtpt";
import { KeyAndValueType } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { cloneDeep } from "lodash";
import { memo, MouseEvent } from "react";
import { useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import { Trash } from "lucide-react";
import { convertHeader } from "./helper";

interface EachHeaderProps {
  objectKey: string;
  objectValue: string;
  nodeId: string;
  objectList: KeyAndValueType[];
  objectId: string;
  mutateObjectKey: string;
}

const EachKeyAndValue = ({
  nodeId,
  objectKey,
  objectValue,
  objectList,
  objectId,
  mutateObjectKey,
}: EachHeaderProps) => {
  const { getNode, updateNode } = useReactFlow();

  const node = getNode(nodeId);

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const handleChangeKey = (id: string, value: string) => {
    const newHeaders = cloneDeep(objectList)
      .map((elm) => {
        if (elm.id === objectId) {
          console.log("value", value);
          return `${value}:${elm.value}`;
        }

        return `${elm.key}:${elm.value}`;
      })
      .join("\n");

    if (value && objectValue) {
      handleUpdateNodeDataHttpRequest(id, {
        [mutateObjectKey]: newHeaders,
      });

      return;
    }

    if (!objectValue) {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          [mutateObjectKey]: newHeaders,
        },
      });
    }
  };

  const handleChangeValue = (id: string, value: string) => {
    const newHeaders = cloneDeep(objectList)
      .map((elm) => {
        if (elm.id === objectId) {
          return `${elm.key}:${value}`;
        }

        return `${elm.key}:${elm.value}`;
      })
      .join("\n");

    if (value && objectKey) {
      handleUpdateNodeDataHttpRequest(id, {
        [mutateObjectKey]: newHeaders,
      });

      return;
    }

    if (!objectKey) {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          [mutateObjectKey]: newHeaders,
        },
      });
    }
  };

  const handleRemoveKeyAndValuePair = (e: MouseEvent) => {
    e.stopPropagation();
    const newHeaders = cloneDeep(objectList).filter(
      (elm) => elm.id !== objectId
    );

    if (objectKey && objectValue) {
      handleUpdateNodeDataHttpRequest(nodeId, {
        [mutateObjectKey]: convertHeader(newHeaders),
      });
    } else {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          [mutateObjectKey]: convertHeader(newHeaders),
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-2 px-3 gap-x-3 gap-y-1 pr-14 relative">
      <EditorPrompt
        id={`${objectId}-key`}
        nodeId={nodeId}
        value={objectKey}
        handleChangeEditor={handleChangeKey}
        className="min-h-10"
        placeholder="Enter header key..."
      />
      <EditorPrompt
        id={`${objectId}-value`}
        nodeId={nodeId}
        value={objectValue}
        handleChangeEditor={handleChangeValue}
        className="min-h-10"
        placeholder={`Enter header value for ${objectKey}`}
      />

      <CommonStyles.Button
        isIcon
        color="error"
        className="!absolute !top-2/4 !-translate-y-2/4 !right-0"
        onClick={handleRemoveKeyAndValuePair}
      >
        <Trash size={16} />
      </CommonStyles.Button>
    </div>
  );
};

export default memo(EachKeyAndValue);
