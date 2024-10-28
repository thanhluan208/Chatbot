import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import type { WorkflowNodesMap } from "./node";
import { WorkflowVariableBlockNode } from "./node";
import {
  DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND,
  UPDATE_WORKFLOW_NODES_MAP,
} from "./index";

import {
  AlignEndVertical,
  Bug,
  FileWarningIcon,
  LineChart,
  Variable,
  VariableIcon,
} from "lucide-react";
import { useSelectOrDelete } from "../context-block/hooks";
import { cn } from "@/lib/utils";
import { Tooltip } from "@mui/material";
import { isConversationVar } from "../util";

type WorkflowVariableBlockComponentProps = {
  nodeKey: string;
  variables: string[];
  workflowNodesMap: WorkflowNodesMap;
};

const WorkflowVariableBlockComponent = ({
  nodeKey,
  variables,
  workflowNodesMap = {},
}: WorkflowVariableBlockComponentProps) => {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [ref, isSelected] = useSelectOrDelete(
    nodeKey,
    DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND
  );

  const variablesLength = variables.length;
  const varName = (() => {
    const isSystem = false;
    const varName =
      variablesLength >= 3
        ? variables.slice(-2).join(".")
        : variables[variablesLength - 1];
    return `${isSystem ? "sys." : ""}${varName}`;
  })();
  const [localWorkflowNodesMap, setLocalWorkflowNodesMap] =
    useState<WorkflowNodesMap>(workflowNodesMap);
  const node = localWorkflowNodesMap![variables[0]];
  const isEnv = false;
  const isChatVar = isConversationVar(variables);


  useEffect(() => {
    if (!editor.hasNodes([WorkflowVariableBlockNode]))
      throw new Error(
        "WorkflowVariableBlockPlugin: WorkflowVariableBlock not registered on editor"
      );

    return mergeRegister(
      editor.registerCommand(
        UPDATE_WORKFLOW_NODES_MAP,
        (workflowNodesMap: WorkflowNodesMap) => {
          
          setLocalWorkflowNodesMap(workflowNodesMap);

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  const Item = (
    <div
      className={cn(
        "mx-0.5 relative group/wrap flex items-center h-[18px] pl-0.5 pr-[3px] rounded-[5px] border select-none",
        isSelected
          ? " border-[#84ADFF] bg-[#F5F8FF]"
          : " border-black/5 bg-white",
        !node && !isEnv && !isChatVar && "!border-[#F04438] !bg-[#FEF3F2]"
      )}
      ref={ref}
    >
      {!isEnv && !isChatVar && (
        <div className="flex items-center">
          <div className="p-[1px]">
            <VariableIcon className="!text-gray-500 h-3 w-3" />
          </div>
          <div
            className="shrink-0 mx-0.5 max-w-[60px] text-xs font-medium text-gray-500 truncate"
            style={{}}
          >
            title
          </div>
          <LineChart className="mr-0.5 text-gray-300 h-3 w-3" />
        </div>
      )}
      <div className="flex items-center text-primary-600">
        {!isEnv && !isChatVar && <Variable className="shrink-0 w-3.5 h-3.5 text-black" />}
        {isEnv && (
          <AlignEndVertical className="shrink-0 w-3.5 h-3.5 text-black" />
        )}
        {isChatVar && (
          <Bug className="w-3.5 h-3.5 text-black" />
        )}
        <div
          className={cn("shrink-0 ml-0.5 text-xs font-medium truncate text-black")}
          title={varName}
        >
          {varName}
        </div>
        {!node && !isEnv && !isChatVar && (
          <FileWarningIcon className="ml-0.5 w-3 h-3 text-[#D92D20]" />
        )}
      </div>
    </div>
  );

  if (!node && !isEnv && !isChatVar) {
    return (
      <Tooltip title={t("workflow.errorMsg.invalidVariable")}>
        <div>{Item}</div>
      </Tooltip>
    );
  }

  return Item;
};

export default memo(WorkflowVariableBlockComponent);
