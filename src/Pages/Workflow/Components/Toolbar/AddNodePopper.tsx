import CommonStyles from "@/Components/CommonStyles";
import {
  Box,
  Fade,
  Popper,
  PopperPlacementType,
  SxProps,
  useTheme,
} from "@mui/material";
import { cloneDeep } from "lodash";
import React, { Fragment, useMemo, useState } from "react";
import ListNode from "./ListNode";
import ToolList from "./ToolList";
import { Tool } from "./type";
import toolConfig from '@/assets/tool.yaml'

interface IAddNodePopper {
  open?: boolean;
  anchorEl?: HTMLElement | null;
  listNode: {
    name: string;
    label: string;
    description?: string;
    hidden?: boolean;
  }[];
  placement?: PopperPlacementType;
  sxContainer?: SxProps;
  isHelperNode?: boolean;
  helperPosition?: { x: number; y: number };
  enableSearch?: boolean;
  enableTool?: boolean;
}

enum TypeEnum {
  NODE = "NODE",
  TOOL = "TOOL",
}

const AddNodePopper = (props: IAddNodePopper) => {
  //! State
  const {
    open,
    anchorEl,
    listNode,
    placement,
    sxContainer,
    helperPosition,
    enableSearch,
    enableTool,
  } = props;
  const [type, setType] = useState(TypeEnum.NODE);
  const [filter, setFilter] = useState("");

  const theme = useTheme();

  const listNodeFiltered = useMemo(() => {
    if (type !== TypeEnum.NODE) return [];

    const newListNode = cloneDeep(listNode);

    return newListNode.filter((node) => {
      return node.label?.toLowerCase()?.includes(filter.toLowerCase());
    });
  }, [listNode, filter, type]);

  const ListToolFiltered = useMemo(() => {
    if (type !== TypeEnum.TOOL) return [];

    return Object.entries(cloneDeep(toolConfig))
      .map(([key, value]) => {
        const { identity, credentials_for_provider, ...rest } = value;

        return {
          provider: key,
          identity,
          credentials_for_provider,
          tools: Object.entries(rest).map(([key, value]) => {
            return {
              name: key,
              ...(value as Omit<Tool, "name">),
            };
          }),
        };
      })
      .filter((tool) => {
        return tool.tools.some((elm) => {
          return elm.name.toLowerCase().includes(filter.toLowerCase());
        });
      });
  }, [filter, type]);

  console.log("ListToolFiltered", ListToolFiltered);

  //! Function

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilter(event.target.value);
  };

  //! Render

  return (
    <Popper
      open={!!open}
      anchorEl={anchorEl}
      placement={placement ?? "top-end"}
      transition
      keepMounted={false}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Box
            sx={{
              boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
              borderRadius: "12px",
              padding: "10px 20px",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
              background: theme.colors.custom.backgroundCard,
              ...sxContainer,
            }}
          >
            {enableSearch && (
              <Fragment>
                <CommonStyles.Input
                  label="Search"
                  fullWidth
                  afterOnchange={handleSearch}
                />

                <hr className="my-3 opacity-50" />
              </Fragment>
            )}

            {enableTool && (
              <Fragment>
                <div className="grid grid-cols-2 gap-3">
                  <CommonStyles.Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setType(TypeEnum.NODE);
                    }}
                    variant={type === TypeEnum.NODE ? "contained" : "outlined"}
                  >
                    Node
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setType(TypeEnum.TOOL);
                    }}
                    variant={type === TypeEnum.TOOL ? "contained" : "outlined"}
                  >
                    Tool
                  </CommonStyles.Button>
                </div>
                <hr className="my-3 opacity-50" />
              </Fragment>
            )}

            {type === TypeEnum.NODE ? (
              <ListNode
                listNode={listNodeFiltered}
                helperPosition={helperPosition}
                isHelperNode
              />
            ) : (
              <ToolList toolProviders={ListToolFiltered} />
            )}
          </Box>
        </Fade>
      )}
    </Popper>
  );
};

export default AddNodePopper;
