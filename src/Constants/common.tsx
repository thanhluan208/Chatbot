import { NodeTypeWorkflow } from "@/Types/workflow";
import { Book, Code, Component, House, MemoryStick, Pickaxe, Shapes, TrendingUpDown, Variable } from "lucide-react";

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
  [`customNode_WF_${NodeTypeWorkflow.LLM}`]: (
    <Component className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL}`]: (
    <Book className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.VARIABLE_AGGREGATOR}`]: (
    <Variable className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.CODE}`]: (
    <Code className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.LONG_TERM_MEMORY}`]: (
    <MemoryStick className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.PARAMETER_EXTRACTOR}`]: (
    <Pickaxe className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.QUESTION_CLASSIFIER}`]: (
    <Shapes className="w-3.5 h-3.5" color="#fff" />
  ),
};
