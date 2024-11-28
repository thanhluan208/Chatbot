import { useReactFlow } from "@xyflow/react";
import { NodeDataHTTPRequest } from "./type";
import { MouseEvent, useMemo } from "react";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import CommonStyles from "@/Components/CommonStyles";
import EachKeyAndValue from "./EachKeyAndValue";
import { Plus } from "lucide-react";
import { capitalize, cloneDeep } from "lodash";
import { convertHeader } from "./helper";

interface KeyAndValueListProps {
  nodeId: string;
  mutateObjectKey: string;
}

const KeyAndValueList = ({ nodeId, mutateObjectKey }: KeyAndValueListProps) => {
  const { getNode, updateNode } = useReactFlow();
  const node = getNode(nodeId);

  if (!node) return;

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;
  const mutateObject = nodeData?.[
    mutateObjectKey as keyof typeof nodeData
  ] as string;

  const listKeyAndValue = useMemo(() => {
    if (!mutateObject) return [];
    const list = mutateObject?.split("\n").map((elm, index) => {
      const eachKeyAndValue = elm.split(":");
      return {
        id: String(index),
        key: eachKeyAndValue?.[0] || "",
        value: eachKeyAndValue?.[1] || "",
      };
    });

    return list;
  }, [mutateObject]);

  const handleAddHeader = (e: MouseEvent) => {
    e.stopPropagation();
    const newHeaders = cloneDeep(listKeyAndValue);
    newHeaders.push({
      id: String(newHeaders.length),
      key: "",
      value: "",
    });

    updateNode(nodeId, {
      data: {
        ...nodeData,
        [mutateObjectKey]: convertHeader(newHeaders),
      },
    });
  };

  const shouldDisabledAddHeader = listKeyAndValue.some(
    (elm) => !elm.key || !elm.value
  );

  return (
    <CollapseArea
      initOpen={false}
      label={
        <CommonStyles.Typography type="semiBold16">
          {capitalize(mutateObjectKey)}
        </CommonStyles.Typography>
      }
    >
      <div>
        <div className="grid grid-cols-2 px-3 gap-x-3 gap-y-1 pr-20 ">
          <CommonStyles.Typography type="semiBold16">
            Key
          </CommonStyles.Typography>
          <CommonStyles.Typography type="semiBold16">
            Value
          </CommonStyles.Typography>
        </div>

        {listKeyAndValue.map((item) => {
          return (
            <EachKeyAndValue
              key={item.id}
              objectKey={item.key}
              objectValue={item.value}
              nodeId={nodeId}
              objectId={item.id}
              objectList={listKeyAndValue}
              mutateObjectKey={mutateObjectKey}
            />
          );
        })}
      </div>
      <CommonStyles.Button
        variant="contained"
        onClick={handleAddHeader}
        className="flex gap-3 !mt-4"
        disabled={shouldDisabledAddHeader}
      >
        <Plus size={16} />
        Add {mutateObjectKey}
      </CommonStyles.Button>
    </CollapseArea>
  );
};

export default KeyAndValueList;
