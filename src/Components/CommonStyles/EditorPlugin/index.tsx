import { memo } from "react";
import type { FC } from "react";
import { useEffect } from "react";
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
import { useEventEmitterContextContext } from "./component-picker-block/event-emitter";
import ComponentPickerBlock from "./component-picker-block";
import { textToEditorState } from "./component-picker-block/hooks";
import { ContextBlockType } from "./component-picker-block/types";
import UpdateBlock from "./update-block";
import Placeholder from "./placeholder";
import { ContextBlock, ContextBlockNode } from "./context-block";
import ContextBlockReplacementBlock from "./context-block/context-block-replacement-block";
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
  contextBlock?: ContextBlockType;
  workflowVariableBlock?: WorkflowVariableBlockType;
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
  contextBlock,
  workflowVariableBlock,
}) => {
  const { eventEmitter } = useEventEmitterContextContext();
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


  useEffect(() => {
    eventEmitter?.emit({
      type: UPDATE_DATASETS_EVENT_EMITTER,
      payload: contextBlock?.datasets,
    } as any);
  }, [eventEmitter, contextBlock?.datasets]);

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
          contextBlock={contextBlock}
          workflowVariableBlock={workflowVariableBlock}
        />
        <ComponentPickerBlock
          triggerString="{"
          contextBlock={contextBlock}
          workflowVariableBlock={workflowVariableBlock}
        />

        {contextBlock?.show && (
          <>
            <ContextBlock {...contextBlock} />
            <ContextBlockReplacementBlock {...contextBlock} />
          </>
        )}
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
        {/* <TreeView /> */}
      </div>
    </LexicalComposer>
  );
};

export default memo(PromptEditor);
