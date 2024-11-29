import { cloneDeep } from "lodash";
import { BodyDataType, KeyAndValueType } from "./type";

export const convertHeader = (
  headerList: KeyAndValueType[],
  hasType?: boolean
) => {
  const newHeaders = cloneDeep(headerList)
    .map((elm) => {
      if (hasType) {
        return `${elm.key}:${elm.type}:${elm.value}`;
      }
      return `${elm.key}:${elm.value}`;
    })
    .join("\n");

  return newHeaders;
};

export const parsedKeyAndValueString = (input: string, hasType?: boolean) : KeyAndValueType[] => {
  if (!input) return [];
  const list: KeyAndValueType[] = input.split("\n").map((elm, index) => {
    const keyAndValurSplitted = elm.split(":");

    return {
      id: String(index),
      key: keyAndValurSplitted?.[0] || "",
      type: hasType ? (keyAndValurSplitted?.[1] as BodyDataType) : undefined,
      value: keyAndValurSplitted?.[hasType ? 2 : 1] || "",
    };
  });

  return list;
};

export const optionFromEnum = (enumInput: object) => {
  return Object.entries(enumInput).map(([key, value]) => {
    return {
      label: key,
      value,
    };
  });
};
