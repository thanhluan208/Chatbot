import { WORKFLOW_ICON } from "@/Constants/common";
import { VariableSelector } from "./type";
import CommonStyles from "@/Components/CommonStyles";

interface NodeVarItemProps {
  data: VariableSelector;
}
const NodeVarItem = ({ data }: NodeVarItemProps) => {
  const { value, type } = data;
  const [node, name] = value;

  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        {WORKFLOW_ICON[`customNode_WF_${node}` as keyof typeof WORKFLOW_ICON]}
        <CommonStyles.Typography type="semiBold14">
          {name}
        </CommonStyles.Typography>
      </div>
      <CommonStyles.Typography className="opacity-50">
        {type}
      </CommonStyles.Typography>
    </div>
  );
};

export default NodeVarItem;
