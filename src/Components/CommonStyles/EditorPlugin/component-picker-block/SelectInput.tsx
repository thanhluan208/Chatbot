import { useReactFlow } from "@xyflow/react";
import { useMemo } from "react";
import EachOption from "./EachOption";

interface SelectInputProps {
  handleSelectVariable: (value: string[]) => void;
  nodeId: string;
}
const SelectInput = ({ nodeId }: SelectInputProps) => {
  const { getNode } = useReactFlow();

  const options = useMemo(() => {
    const nodes = getNode(nodeId);

    if (!nodes) return [];
    const parentsNode = (nodes?.data?.parentNodes as string[]).map((id) => {
      const node = getNode(id);
      return node;
    });

    return parentsNode;
  }, [nodeId, getNode]);

  return (
    <div className="px-4 py-2">
      {options.map((node) => {
        if (!node || !node?.data?.variable_out) return null;
        return (
          <EachOption node={node} key={node.id} />
        );
      })}
    </div>
  );
};

export default SelectInput;
