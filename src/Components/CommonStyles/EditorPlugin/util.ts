import { $isTextNode, LexicalNode, TextNode } from "lexical";
import { CustomTextNode } from "./custom-text/node";
import type { EntityMatch } from "@lexical/text";

export const decoratorTransform = (
  node: CustomTextNode,
  getMatch: (text: string) => null | EntityMatch,
  createNode: (textNode: TextNode) => LexicalNode
) => {
  if (!node.isSimpleText()) return;

  const prevSibling = node.getPreviousSibling();
  let text = node.getTextContent();
  let currentNode = node;
  let match;

  while (true) {
    match = getMatch(text);
    let nextText = match === null ? "" : text.slice(match.end);
    text = nextText;

    if (nextText === "") {
      const nextSibling = currentNode.getNextSibling();

      if ($isTextNode(nextSibling)) {
        nextText = currentNode.getTextContent() + nextSibling.getTextContent();
        const nextMatch = getMatch(nextText);

        if (nextMatch === null) {
          nextSibling.markDirty();
          return;
        } else if (nextMatch.start !== 0) {
          return;
        }
      }
    } else {
      const nextMatch = getMatch(nextText);

      if (nextMatch !== null && nextMatch.start === 0) return;
    }

    if (match === null) return;

    if (
      match.start === 0 &&
      $isTextNode(prevSibling) &&
      prevSibling.isTextEntity()
    )
      continue;

    let nodeToReplace;

    if (match.start === 0)
      [nodeToReplace, currentNode] = currentNode.splitText(match.end);
    else
      [, nodeToReplace, currentNode] = currentNode.splitText(
        match.start,
        match.end
      );

    const replacementNode = createNode(nodeToReplace);
    nodeToReplace.replace(replacementNode);

    if (currentNode == null) return;
  }
};


export type ValueSelector = string[] 
export const isConversationVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === "conversation";
};


export const VAR_REGEX = /\{\{(#[a-zA-Z0-9_-]{1,50}(\.[a-zA-Z_][a-zA-Z0-9_]{0,29}){1,10}#)\}\}/gi
export const resetReg = () => VAR_REGEX.lastIndex = 0

export const MAX_VAR_KEY_LENGTH = 30
const otherAllowedRegex = /^[a-zA-Z0-9_]+$/

export const checkKey = (key: string, canBeEmpty?: boolean) => {
  if (key.length === 0 && !canBeEmpty)
    return 'canNoBeEmpty'

  if (canBeEmpty && key === '')
    return true

  if (key.length > MAX_VAR_KEY_LENGTH)
    return 'tooLong'

  if (otherAllowedRegex.test(key)) {
    if (/[0-9]/.test(key[0]))
      return 'notStartWithNumber'

    return true
  }
  return true
}

export const checkKeys = (keys: string[], canBeEmpty?: boolean) => {
  let isValid = true
  let errorKey = ''
  let errorMessageKey = ''
  keys.forEach((key) => {
    if (!isValid)
      return

    const res = checkKey(key, canBeEmpty)
    if (res !== true) {
      isValid = false
      errorKey = key
      errorMessageKey = res
    }
  })
  return { isValid, errorKey, errorMessageKey }
}