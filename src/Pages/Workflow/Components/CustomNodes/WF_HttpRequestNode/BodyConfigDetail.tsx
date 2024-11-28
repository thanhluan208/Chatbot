import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import EditorPromtpt from "../../misc/EditorPromtpt";
import { BodyDataType, BodyType, NodeDataHTTPRequest } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import { Plus } from "lucide-react";
import { convertHeader, parsedKeyAndValueString } from "./helper";
import { useReactFlow } from "@xyflow/react";
import { cloneDeep } from "lodash";
import { cn } from "@/lib/utils";
import EachBodyDataItem from "./EachBodyDataItem";

interface BodyConfigDetailProps {
  type: BodyType;
  bodyData: string;
  nodeId: string;
}

const BodyConfigDetail = ({
  type,
  nodeId,
  bodyData,
}: BodyConfigDetailProps) => {
  const { getNode, updateNode } = useReactFlow();
  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const node = getNode(nodeId);
  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const handleChangePromptBodyData = (id: string, value: string) => {
    if (value === bodyData) return;
    handleUpdateNodeDataHttpRequest(id, {
      body: {
        type,
        data: value,
      },
    });
  };

  if (type === BodyType.NONE) return null;

  if (type === BodyType.JSON || type === BodyType.RAW_TEXT) {
    return (
      <EditorPromtpt
        id={`body-${type}`}
        nodeId={nodeId}
        value={bodyData}
        handleChangeEditor={handleChangePromptBodyData}
        className="min-h-[120px]"
        placeholder={`Enter body data...`}
      />
    );
  }

  const hasType = type === BodyType.FORM_DATA;

  const listKeyAndValue = parsedKeyAndValueString(bodyData, hasType) || [];

  const handleAddBodyData = () => {
    const newList = cloneDeep(listKeyAndValue);
    newList.push({
      id: String(newList.length),
      key: "",
      type: BodyDataType.STRING,
      value: "",
    });

    updateNode(nodeId, {
      data: {
        ...nodeData,
        body: {
          type,
          data: convertHeader(newList, hasType),
        },
      },
    });
  };

  const shouldDisabledAddHeader = listKeyAndValue.some(
    (elm) => !elm.key || !elm.value
  );

  return (
    <div>
      <div>
        <div
          className={cn(
            "grid px-3 gap-x-3 gap-y-1 pr-20 ",
            hasType ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          <CommonStyles.Typography type="semiBold16">
            Key
          </CommonStyles.Typography>
          {hasType && (
            <CommonStyles.Typography type="semiBold16">
              Type
            </CommonStyles.Typography>
          )}
          <CommonStyles.Typography type="semiBold16">
            Value
          </CommonStyles.Typography>
        </div>

        {listKeyAndValue.map((item) => {
          return (
            <EachBodyDataItem
              key={item.id}
              objectKey={item.key}
              objectValue={item.value}
              nodeId={nodeId}
              objectId={item.id}
              objectList={listKeyAndValue}
              objectType={item.type}
              hasType={hasType}
            />
          );
        })}
      </div>
      <CommonStyles.Button
        variant="contained"
        onClick={handleAddBodyData}
        className="flex gap-3 !mt-4"
        disabled={shouldDisabledAddHeader}
      >
        <Plus size={16} />
        Add body data
      </CommonStyles.Button>
    </div>
  );
};

export default BodyConfigDetail;
