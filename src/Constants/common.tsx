import { NodeTypeWorkflow } from "@/Types/workflow";
import { House, TrendingUpDown } from "lucide-react";

export const LANGUAGES = {
  EN: "en",
  VI: "vi",
};

export const WORKFLOW_ICON = {
  [`customNode_WF_${NodeTypeWorkflow.START}`]: (
    <House className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.IF_ELSE}`]: (
    <TrendingUpDown className="w-3.5 h-3.5" color="#fff" />
  ),
};
