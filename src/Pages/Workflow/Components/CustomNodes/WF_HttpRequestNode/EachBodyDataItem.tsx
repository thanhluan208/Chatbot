import EditorPrompt from "../../misc/EditorPromtpt";
import { BodyDataType, KeyAndValueType, NodeDataHTTPRequest } from "./type";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { cloneDeep } from "lodash";
import { memo, MouseEvent } from "react";
import { useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import { Trash } from "lucide-react";
import { convertHeader, optionFromEnum } from "./helper";
import { cn } from "@/lib/utils";

interface EachHeaderProps {
  objectKey: string;
  objectValue: string;
  nodeId: string;
  objectList: KeyAndValueType[];
  objectId: string;
  objectType?: BodyDataType;
  hasType?: boolean;
}

const EachBodyDataItem = ({
  nodeId,
  objectKey,
  objectValue,
  objectType,
  objectList,
  objectId,
  hasType,
}: EachHeaderProps) => {
  const { getNode, updateNode } = useReactFlow();

  const node = getNode(nodeId);
  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const handleChangeKey = (id: string, value: string) => {
    const newBodyData = cloneDeep(objectList)
      .map((elm) => {
        if (elm.id === objectId) {
          if (hasType) {
            return `${value}:${elm.type}:${elm.value}`;
          }
          return `${value}:${elm.value}`;
        }

        if (hasType) return `${elm.key}:${elm.type}:${elm.value}`;
        return `${elm.key}:${elm.value}`;
      })
      .join("\n");

    if (value && objectValue) {
      handleUpdateNodeDataHttpRequest(id, {
        body: {
          type: nodeData?.body?.type,
          data: newBodyData,
        },
      });

      return;
    }

    if (!objectValue) {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          body: {
            ...nodeData?.body,
            data: newBodyData,
          },
        },
      });
    }
  };

  const handleChangeValue = (id: string, value: string) => {
    const newBodyData = cloneDeep(objectList)
      .map((elm) => {
        if (elm.id === objectId) {
          if (hasType) {
            return `${elm.key}:${elm.type}:${value}`;
          }
          return `${elm.key}:${value}`;
        }

        if (hasType) return `${elm.key}:${elm.type}:${elm.value}`;
        return `${elm.key}:${elm.value}`;
      })
      .join("\n");

    if (value && objectValue) {
      handleUpdateNodeDataHttpRequest(id, {
        body: {
          type: nodeData?.body?.type,
          data: newBodyData,
        },
      });

      return;
    }

    if (!objectValue) {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          body: {
            ...nodeData?.body,
            data: newBodyData,
          },
        },
      });
    }
  };

  const handleRemoveKeyAndValuePair = (e: MouseEvent) => {
    e.stopPropagation();
    const newBodyData = cloneDeep(objectList).filter(
      (elm) => elm.id !== objectId
    );

    if (objectKey && objectValue) {
      handleUpdateNodeDataHttpRequest(nodeId, {
        body: {
          type: nodeData?.body?.type,
          data: convertHeader(newBodyData, hasType),
        },
      });
    } else {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          body: {
            ...nodeData?.body,
            data: convertHeader(newBodyData, hasType),
          },
        },
      });
    }
  };

  const handleSelectType = (value: BodyDataType) => {
    const newBodyData = cloneDeep(objectList)
      .map((elm) => {
        if (elm.id === objectId) {
          return `${elm.key}:${value}:${elm.value}`;
        }

        return `${elm.key}:${elm.type}:${elm.value}`;
      })
      .join("\n");

    if (objectKey && objectValue) {
      handleUpdateNodeDataHttpRequest(nodeId, {
        body: {
          type: nodeData?.body?.type,
          data: newBodyData,
        },
      });
    } else {
      updateNode(nodeId, {
        data: {
          ...node?.data,
          body: {
            ...nodeData?.body,
            data: newBodyData,
          },
        },
      });
    }
  };

  return (
    <div
      className={cn(
        "grid  px-3 gap-x-3 gap-y-1 pr-14 relative",
        hasType ? "grid-cols-10" : "grid-cols-2"
      )}
    >
      <div className={cn(hasType && "col-span-4")}>
        <EditorPrompt
          id={`${objectId}-key`}
          nodeId={nodeId}
          value={objectKey}
          handleChangeEditor={handleChangeKey}
          className="min-h-[29px]"
          placeholder="Enter body data key..."
        />
      </div>

      {hasType && (
        <div className="col-span-2">
          <CommonStyles.Select
            value={objectType}
            handleChange={handleSelectType}
            options={optionFromEnum(BodyDataType)}
            fullWidth
            sx={{
              marginTop: "8px",
              height: "39px",
            }}
          />
        </div>
      )}
      <div className={cn(hasType && "col-span-4")}>
        <EditorPrompt
          id={`${objectId}-value`}
          nodeId={nodeId}
          value={objectValue}
          handleChangeEditor={handleChangeValue}
          className="min-h-[29px]"
          placeholder={`Enter body data value for ${objectKey}`}
        />
      </div>

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

export default memo(EachBodyDataItem);
