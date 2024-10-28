import { Fragment, memo, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { createCommand, type TextNode } from "lexical";
import type { MenuRenderFn } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalTypeaheadMenuPlugin } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {
  $splitNodeContainingQuery,
  useBasicTypeaheadTriggerMatch,
  useOptions,
} from "./hooks";
import { ContextBlockType } from "./types";
import { useEventEmitterContextContext } from "./event-emitter";
import { PickerBlockMenuOption } from "./menu";
import { WorkflowVariableBlockType } from "../type";
import VarReferenceVars from "../var-reference-vars";
import { useTheme } from "@mui/material";

export const INSERT_VARIABLE_BLOCK_COMMAND = createCommand(
  "INSERT_VARIABLE_BLOCK_COMMAND"
);
export const INSERT_VARIABLE_VALUE_BLOCK_COMMAND = createCommand(
  "INSERT_VARIABLE_VALUE_BLOCK_COMMAND"
);
export const INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND = createCommand(
  "INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND"
);

type ComponentPickerProps = {
  triggerString: string;
  contextBlock?: ContextBlockType;
  workflowVariableBlock?: WorkflowVariableBlockType;
};
const ComponentPicker = ({
  triggerString,
  contextBlock,
  workflowVariableBlock,
}: ComponentPickerProps) => {
  const theme = useTheme()
  const { eventEmitter } = useEventEmitterContextContext();
  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(0), // fix hide cursor
      shift({
        padding: 8,
      }),
      flip(),
    ],
  });
  const [editor] = useLexicalComposerContext();
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(triggerString, {
    minLength: 0,
    maxLength: 0,
  });

  const [queryString, setQueryString] = useState<string | null>(null);

  eventEmitter?.useSubscription((v: any) => {
    if (v.type === INSERT_VARIABLE_VALUE_BLOCK_COMMAND)
      editor.dispatchCommand(
        INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
        `{{${v.payload}}}`
      );
  });

  const { allFlattenOptions, workflowVariableOptions } = useOptions(
    contextBlock,
    workflowVariableBlock
  );

  const onSelectOption = useCallback(
    (
      selectedOption: PickerBlockMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key) nodeToRemove.remove();

        selectedOption.onSelectMenuOption();
        closeMenu();
      });
    },
    [editor]
  );

  const handleSelectWorkflowVariable = useCallback(
    (variables: string[]) => {
      editor.update(() => {
        const needRemove = $splitNodeContainingQuery(
          checkForTriggerMatch(triggerString, editor)!
        );
        if (needRemove) needRemove.remove();
      });

      if (variables[1] === "sys.query" || variables[1] === "sys.files")
        editor.dispatchCommand(INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND, [
          variables[1],
        ]);
      else
        editor.dispatchCommand(
          INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND,
          variables
        );
    },
    [editor, checkForTriggerMatch, triggerString]
  );

  const renderMenu = useCallback<MenuRenderFn<PickerBlockMenuOption>>(
    (
      anchorElementRef,
      { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
    ) => {
      if (!(anchorElementRef.current && allFlattenOptions.length)) return null;
      refs.setReference(anchorElementRef.current);

      return (
        <>
          {ReactDOM.createPortal(
            // The `LexicalMenu` will try to calculate the position of the floating menu based on the first child.
            // Since we use floating ui, we need to wrap it with a div to prevent the position calculation being affected.
            // See https://github.com/facebook/lexical/blob/ac97dfa9e14a73ea2d6934ff566282d7f758e8bb/packages/lexical-react/src/shared/LexicalMenu.ts#L493
            <div className="w-0 h-0">
              <div
                className="p-1 w-[260px]  rounded-lg border-[0.5px]  shadow-lg"
                style={{
                  ...floatingStyles,
                  visibility: isPositioned ? "visible" : "hidden",
                  background: theme.colors.custom.background,
                  border: `1px solid ${theme.colors.custom.borderColor}`,
                }}
                ref={refs.setFloating}
              >
                {options.map((option, index) => (
                  <Fragment key={option.key}>
                    {
                      // Divider
                      index !== 0 &&
                        options.at(index - 1)?.group !== option.group && (
                          <div className="h-px bg-gray-100 my-1 w-full -translate-x-1"></div>
                        )
                    }
                    {option.renderMenuOption({
                      queryString,
                      isSelected: selectedIndex === index,
                      onSelect: () => {
                        selectOptionAndCleanUp(option);
                      },
                      onSetHighlight: () => {
                        setHighlightedIndex(index);
                      },
                    })}
                  </Fragment>
                ))}
                {
                  workflowVariableBlock?.show && (
                    <>
                      {
                        (!!options.length) && (
                          <div className='h-px bg-gray-100 my-1 w-full -translate-x-1'></div>
                        )
                      }
                      <div className='p-1'>
                        <VarReferenceVars
                          hideSearch
                          vars={workflowVariableOptions}
                          onChange={(variables: string[]) => {
                            handleSelectWorkflowVariable(variables)
                          }}
                          maxHeightClass='max-h-[34vh]'
                          isSupportFileVar={false}
                        />
                      </div>
                    </>
                  )
                }
              </div>
            </div>,
            anchorElementRef.current
          )}
        </>
      );
    },
    [
      allFlattenOptions.length,
      refs,
      isPositioned,
      floatingStyles,
      queryString,
      workflowVariableBlock,
      handleSelectWorkflowVariable,
    ]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      options={allFlattenOptions}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      // The `translate` class is used to workaround the issue that the `typeahead-menu` menu is not positioned as expected.
      // See also https://github.com/facebook/lexical/blob/772520509308e8ba7e4a82b6cd1996a78b3298d0/packages/lexical-react/src/shared/LexicalMenu.ts#L498
      //
      // We no need the position function of the `LexicalTypeaheadMenuPlugin`,
      // so the reference anchor should be positioned based on the range of the trigger string, and the menu will be positioned by the floating ui.
      anchorClassName="z-[999999] translate-y-[calc(-100%-3px)]"
      menuRenderFn={renderMenu}
      triggerFn={checkForTriggerMatch}
    />
  );
};

export default memo(ComponentPicker);
