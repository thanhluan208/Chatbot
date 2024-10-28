import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalCommand,
} from "lexical";
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { $isContextBlockNode } from "./node";
import { mergeRegister } from "@lexical/utils";

export type UseSelectOrDeleteHandler = (
  nodeKey: string,
  command?: LexicalCommand<undefined>
) => [RefObject<HTMLDivElement>, boolean];

export const DELETE_CONTEXT_BLOCK_COMMAND = createCommand(
  "DELETE_CONTEXT_BLOCK_COMMAND"
);

export const useSelectOrDelete: UseSelectOrDeleteHandler = (
  nodeKey: string,
  command?: LexicalCommand<undefined>
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  const handleDelete = useCallback(() => {
    const selection = $getSelection();
    const nodes = selection?.getNodes();
    if (
      !isSelected &&
      nodes?.length === 1 &&
      $isContextBlockNode(nodes[0]) &&
      command === DELETE_CONTEXT_BLOCK_COMMAND
    )
      editor.dispatchCommand(command, undefined);

    return false;
  }, [isSelected, nodeKey, command, editor]);

  const handleSelect = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      clearSelection();
      setSelected(true);
    },
    [setSelected, clearSelection]
  );

  useEffect(() => {
    const ele = ref.current;

    if (ele) ele.addEventListener("click", handleSelect);

    return () => {
      if (ele) ele.removeEventListener("click", handleSelect);
    };
  }, [handleSelect]);
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, clearSelection, handleDelete]);

  return [ref, isSelected];
};


export type UseTriggerHandler = () => [RefObject<HTMLDivElement>, boolean, Dispatch<SetStateAction<boolean>>]
export const useTrigger: UseTriggerHandler = () => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setOpen(v => !v)
  }, [])

  useEffect(() => {
    const trigger = triggerRef.current
    if (trigger)
      trigger.addEventListener('click', handleOpen)

    return () => {
      if (trigger)
        trigger.removeEventListener('click', handleOpen)
    }
  }, [handleOpen])

  return [triggerRef, open, setOpen]
}