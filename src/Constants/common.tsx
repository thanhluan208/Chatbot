import { NodeTypeWorkflow } from "@/Types/workflow";
import {
  Book,
  BookmarkCheck,
  Code,
  Component,
  Equal,
  Goal,
  House,
  MemoryStick,
  Pickaxe,
  RadioTower,
  Shapes,
  TrendingUpDown,
  Variable,
} from "lucide-react";

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
  [`customNode_WF_${NodeTypeWorkflow.VARIABLE}`]: (
    <Equal className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.ANSWER}`]: (
    <BookmarkCheck className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.HTTP_REQUEST}`]: (
    <RadioTower className="w-3.5 h-3.5" color="#fff" />
  ),
  [`customNode_WF_${NodeTypeWorkflow.END}`]: (
    <Goal className="w-3.5 h-3.5" color="#fff" />
  ),
};

export const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  USER_DATA: "USER_DATA",
};

export const SESSION_STORAGE_KEY = {
  WORKFLOW_RESULT_ANIMATED: "WORKFLOW_RESULT_ANIMATED",
};
