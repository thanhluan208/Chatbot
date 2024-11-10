import { WORKFLOW_ICON } from "@/Constants/common";
import { useTheme } from "@mui/material";
import { Node } from "@xyflow/react";
import CommonStyles from "../..";
import CollapseArea from "../../CollapseArea";

interface EachOptionProps {
  node: Node;
}
const EachOption = ({ node }: EachOptionProps) => {
  const theme = useTheme();

  return (
    <CollapseArea
      label={
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 flex items-center justify-center rounded-md"
            style={{
              background: theme.palette.primary.main,
            }}
          >
            {WORKFLOW_ICON[node.type as keyof typeof WORKFLOW_ICON]}
          </div>
          <CommonStyles.Typography type="semiBold16">
            {node.data.title as string}
          </CommonStyles.Typography>
        </div>
      }
    >
      <div>hehe</div>
    </CollapseArea>
  );
};

export default EachOption;
