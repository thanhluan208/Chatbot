import { useCallback, useMemo } from "react";
import { ContextBlockType } from "./types";
import { useTranslation } from "react-i18next";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PickerBlockMenuOption } from "./menu";
import { $getSelection, $isRangeSelection, createCommand, TextNode } from "lexical";
import { File } from "lucide-react";
import { PromptMenuItem } from "./promp-options";
import { MenuTextMatch, TriggerFn } from "@lexical/react/LexicalTypeaheadMenuPlugin";

export const INSERT_CONTEXT_BLOCK_COMMAND = createCommand(
  "INSERT_CONTEXT_BLOCK_COMMAND"
);

export const usePromptOptions = (contextBlock?: ContextBlockType) => {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();

  const promptOptions: PickerBlockMenuOption[] = [];
  if (contextBlock?.show) {
    promptOptions.push(
      new PickerBlockMenuOption({
        key: t("common.promptEditor.context.item.title"),
        group: "prompt context",
        render: ({ isSelected, onSelect, onSetHighlight }) => {
          return (
            <PromptMenuItem
              title={t("common.promptEditor.context.item.title")}
              icon={<File className="w-4 h-4 text-[#6938EF]" />}
              disabled={!contextBlock.selectable}
              isSelected={isSelected}
              onClick={onSelect}
              onMouseEnter={onSetHighlight}
            />
          );
        },
        onSelect: () => {
          if (!contextBlock?.selectable) return;
          editor.dispatchCommand(INSERT_CONTEXT_BLOCK_COMMAND, undefined);
        },
      })
    );
  }

  return promptOptions;
};

export const useOptions = (contextBlock?: ContextBlockType) => {
  const promptOptions = usePromptOptions(contextBlock);

  return useMemo(() => {
    return {
      allFlattenOptions: [...promptOptions],
    };
  }, [promptOptions]);
};

function getFullMatchOffset(
  documentText: string,
  entryText: string,
  offset: number,
): number {
  let triggerOffset = offset
  for (let i = triggerOffset; i <= entryText.length; i++) {
    if (documentText.substr(-i) === entryText.substr(0, i))
      triggerOffset = i
  }
  return triggerOffset
}

export function $splitNodeContainingQuery(
  match: MenuTextMatch
): TextNode | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return null;
  const anchor = selection.anchor;
  if (anchor.type !== "text") return null;
  const anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) return null;
  const selectionOffset = anchor.offset;
  const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
  const characterOffset = match.replaceableString.length;
  const queryOffset = getFullMatchOffset(
    textContent,
    match.matchingString,
    characterOffset
  );
  const startOffset = selectionOffset - queryOffset;
  if (startOffset < 0) return null;
  let newNode;
  if (startOffset === 0) [newNode] = anchorNode.splitText(selectionOffset);
  else [, newNode] = anchorNode.splitText(startOffset, selectionOffset);

  return newNode;
}

export const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
export function useBasicTypeaheadTriggerMatch(
  trigger: string,
  { minLength = 1, maxLength = 75 }: { minLength?: number; maxLength?: number },
): TriggerFn {
  return useCallback(
    (text: string) => {
      const validChars = `[${PUNCTUATION}\\s]`
      const TypeaheadTriggerRegex = new RegExp(
        '(.*)('
          + `[${trigger}]`
          + `((?:${validChars}){0,${maxLength}})`
          + ')$',
      )
      const match = TypeaheadTriggerRegex.exec(text)
      if (match !== null) {
        const maybeLeadingWhitespace = match[1]
        const matchingString = match[3]
        if (matchingString.length >= minLength) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2],
          }
        }
      }
      return null
    },
    [maxLength, minLength, trigger],
  )
}

export function textToEditorState(text: string) {
  const paragraph = text ? text.split('\n') : ['']

  return JSON.stringify({
    root: {
      children: paragraph.map((p) => {
        return {
          children: [{
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: p,
            type: 'custom-text',
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        }
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  })
}