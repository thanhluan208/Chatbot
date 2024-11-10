import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import { useHover } from "ahooks";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { NodeOutPutVar, Var } from "./type";
import { ValueSelector } from "./util";
import { ChevronRight } from "lucide-react";
import CommonStyles from "..";
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from "./portal-to-follow-element";
type ObjectChildrenProps = {
  nodeId: string;
  title: string;
  data: Var[];
  objPath: string[];
  onChange: (value: ValueSelector, item: Var) => void;
  onHovering?: (value: boolean) => void;
  itemWidth?: number;
  isSupportFileVar?: boolean;
};

type ItemProps = {
  nodeId: string;
  title: string;
  objPath: string[];
  itemData: Var;
  onChange: (value: ValueSelector, item: Var) => void;
  onHovering?: (value: boolean) => void;
  itemWidth?: number;
  isSupportFileVar?: boolean;
};

const Item: FC<ItemProps> = ({
  nodeId,
  title,
  objPath,
  itemData,
  onChange,
  onHovering,
  itemWidth,
  isSupportFileVar,
}) => {
  const isObj = itemData.children && itemData.children.length > 0;
  const isChatVar = itemData.variable.startsWith("conversation.");
  const itemRef = useRef(null);
  const [isItemHovering, setIsItemHovering] = useState(false);
  useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true);
      } else {
        setIsItemHovering(false);
      }
    },
  });
  const [isChildrenHovering, setIsChildrenHovering] = useState(false);
  const isHovering = isItemHovering || isChildrenHovering;
  const open =  isHovering;
  useEffect(() => {
    onHovering && onHovering(isHovering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  const handleChosen = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isChatVar) {
      // system variable | environment variable | conversation variable
      onChange([...objPath, ...itemData.variable.split(".")], itemData);
    } else {
      onChange([nodeId, ...objPath, itemData.variable], itemData);
    }
  };
  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={() => {}}
      placement="left-start"
    >
      <PortalToFollowElemTrigger className="w-full">
        <div
          ref={itemRef}
          className={cn(
            isObj ? " pr-1" : "pr-[18px]",
            isHovering && (isObj ? "bg-primary-50" : "bg-state-base-hover"),
            "relative w-full flex items-center h-6 pl-3  rounded-md cursor-pointer"
          )}
          onClick={handleChosen}
        >
          <div className="flex items-center w-0 grow">
            <CommonStyles.Typography
              title={itemData.variable}
              className="ml-1 w-0 grow truncate"
            >
              {itemData.variable}
            </CommonStyles.Typography>
          </div>
          <div className="ml-1 shrink-0 text-xs font-normal text-text-tertiary capitalize">
            <CommonStyles.Typography>{itemData.type}</CommonStyles.Typography>
          </div>
          {isObj && (
            <ChevronRight
              className={cn(
                "ml-0.5 w-3 h-3 text-text-quaternary",
                isHovering && "text-text-tertiary"
              )}
            />
          )}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent
        style={{
          zIndex: 100,
        }}
      >
        {isObj && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <ObjectChildren
            nodeId={nodeId}
            title={title}
            objPath={[...objPath, itemData.variable]}
            data={itemData.children as Var[]}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={itemWidth}
            isSupportFileVar={isSupportFileVar}
          />
        )}
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

const ObjectChildren: FC<ObjectChildrenProps> = ({
  title,
  nodeId,
  objPath,
  data,
  onChange,
  onHovering,
  itemWidth,
  isSupportFileVar,
}) => {
  const currObjPath = objPath;
  const itemRef = useRef(null);
  const [isItemHovering, setIsItemHovering] = useState(false);
  useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true);
      } else {
        setTimeout(() => {
          setIsItemHovering(false);
        }, 100);
      }
    },
  });
  const [isChildrenHovering, setIsChildrenHovering] = useState(false);
  const isHovering = isItemHovering || isChildrenHovering;
  useEffect(() => {
    onHovering && onHovering(isHovering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);
  useEffect(() => {
    onHovering && onHovering(isItemHovering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isItemHovering]);
  // absolute top-[-2px]
  return (
    <div
      ref={itemRef}
      className=" bg-white rounded-lg border border-gray-200 shadow-lg space-y-1"
      style={{
        right: itemWidth ? itemWidth - 10 : 215,
        minWidth: 252,
      }}
    >
      <div className="flex items-center h-[22px] px-3 text-xs font-normal text-gray-700">
        <span className="text-gray-500">{title}.</span>
        {currObjPath.join(".")}
      </div>
      {data &&
        data.length > 0 &&
        data.map((v, i) => (
          <Item
            key={i}
            nodeId={nodeId}
            title={title}
            objPath={objPath}
            itemData={v}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            isSupportFileVar={isSupportFileVar}
          />
        ))}
    </div>
  );
};

type Props = {
  hideSearch?: boolean;
  searchBoxClassName?: string;
  vars: NodeOutPutVar[];
  isSupportFileVar?: boolean;
  onChange: (value: ValueSelector, item: Var) => void;
  itemWidth?: number;
  maxHeightClass?: string;
};
const VarReferenceVars: FC<Props> = ({
  vars,
  isSupportFileVar,
  onChange,
  itemWidth,
  maxHeightClass,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {vars.length > 0 ? (
        <div className={cn("max-h-[85vh] overflow-y-auto", maxHeightClass)}>
          {vars.map((item) => (
            <div key={item.nodeId + item.title}>
              <CommonStyles.Typography
                type="semiBold16"
                className="leading-[22px] px-3 truncate "
              >
                {item.title}
              </CommonStyles.Typography>
              {item.vars.map((v, j) => (
                <Item
                  key={j}
                  title={item.title}
                  nodeId={item.nodeId}
                  objPath={[]}
                  itemData={v}
                  onChange={onChange}
                  itemWidth={itemWidth}
                  isSupportFileVar={isSupportFileVar}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="pl-3 leading-[18px] text-xs font-medium text-gray-500 uppercase">
          {t("workflow.common.noVar")}
        </div>
      )}
    </>
  );
};
export default React.memo(VarReferenceVars);
