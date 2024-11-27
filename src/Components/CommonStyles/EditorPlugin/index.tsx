import { memo } from "react";
import type { FC } from "react";
import type { EditorState } from "lexical";
import { $getRoot, TextNode } from "lexical";
import { CodeNode } from "@lexical/code";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import TreeView from './plugins/tree-view'

import { cn } from "@/lib/utils";
import ComponentPickerBlock from "./component-picker-block";
import { textToEditorState } from "./component-picker-block/hooks";
import UpdateBlock from "./update-block";
import Placeholder from "./placeholder";
import { ContextBlockNode } from "./context-block";
import { CustomTextNode } from "./custom-text/node";
import OnBlurBlock from "./on-blur-or-focus-block";
import { WorkflowVariableBlockType } from "./type";
import {
  WorkflowVariableBlock,
  WorkflowVariableBlockNode,
} from "./workflow-variable-block";
import WorkflowVariableBlockReplacementBlock from "./workflow-variable-block/workflow-variable-block-replacement-block";

export type PromptEditorProps = {
  instanceId?: string;
  compact?: boolean;
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  style?: React.CSSProperties;
  value?: string;
  editable?: boolean;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  workflowVariableBlock?: WorkflowVariableBlockType;
  nodeId: string;
};

export const UPDATE_DATASETS_EVENT_EMITTER =
  "prompt-editor-context-block-update-datasets";

const PromptEditor: FC<PromptEditorProps> = ({
  instanceId,
  compact,
  className,
  placeholder,
  placeholderClassName,
  style,
  value,
  editable = true,
  onChange,
  onBlur,
  onFocus,
  workflowVariableBlock,
  nodeId,
}) => {
  const initialConfig = {
    namespace: "prompt-editor",
    nodes: [
      CodeNode,
      CustomTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new CustomTextNode(node.__text),
      },
      ContextBlockNode,
      WorkflowVariableBlockNode,
    ],
    editorState: textToEditorState(value || ""),
    onError: (error: Error) => {
      throw error;
    },
  };
  const handleEditorChange = (editorState: EditorState) => {
    const text = editorState.read(() => {
      return $getRoot()
        .getChildren()
        .map((p) => p.getTextContent())
        .join("\n");
    });
    if (onChange) onChange(text);
  };

  return (
    <LexicalComposer initialConfig={{ ...initialConfig, editable }}>
      <div className="relative min-h-5">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`${className} outline-none ${
                compact ? "leading-5 text-[13px]" : "leading-6 text-sm"
              } `}
              style={style || {}}
            />
          }
          placeholder={
            <Placeholder
              value={placeholder}
              className={cn("truncate", placeholderClassName)}
              compact={compact}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ComponentPickerBlock
          triggerString="/"
          workflowVariableBlock={workflowVariableBlock}
          nodeId={nodeId}
        />
        <ComponentPickerBlock
          triggerString="{"
          workflowVariableBlock={workflowVariableBlock}
          nodeId={nodeId}
        />

        {workflowVariableBlock?.show && (
          <>
            <WorkflowVariableBlock {...workflowVariableBlock} />
            <WorkflowVariableBlockReplacementBlock {...workflowVariableBlock} />
          </>
        )}

        <OnChangePlugin onChange={handleEditorChange} />
        <OnBlurBlock onBlur={onBlur} onFocus={onFocus} />
        <UpdateBlock instanceId={instanceId} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
};

export default memo(PromptEditor);
