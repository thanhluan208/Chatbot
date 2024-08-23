import React, { useMemo, useState } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, Collapse } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import SingleTab from "./SingleTab";
import ConfirmDeleteNode from "../ConfirmDeleteNode";

export enum LLMNodeTypes {
  Single = "Single",
  Batch = "Batch",
}

const LLMNode = (props: NodeProps) => {
  //! State
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = useState(LLMNodeTypes.Single);
  const handleid = useMemo(() => {
    return {
      source: uuid(),
      target: uuid(),
    };
  }, []);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: "#fff",
        border: "solid 2px transparent",
        minWidth: "200px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
        width: "670px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CommonStyles.Button isIcon onClick={() => setOpen((prev) => !prev)}>
            <CommonIcons.ExpandMore
              sx={{
                transform: !open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </CommonStyles.Button>
          <img
            src="https://sf16-va.tiktokcdn.com/obj/eden-va2/dvsmryvd_avi_dvsm/ljhwZthlaukjlkulzlp/icon/icon-LLM.png"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "4px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          />
          <CommonStyles.Typography type="normal14">LLM</CommonStyles.Typography>
        </Box>
        <ConfirmDeleteNode nodeId={props.id} />
      </Box>

      <Collapse in={open}>
        <CommonStyles.Typography
          color={"#1c1d2399"}
          sx={{
            marginTop: "8px",
          }}
          type="normal14"
        >
          Invoke the large language model, generate responses using variables
          and prompt words.
        </CommonStyles.Typography>

        <Box
          sx={{
            borderRadius: "8px",
            display: "flex",
            gap: "8px",
            padding: "8px",
            width: "100%",
            background: "#f0f0f0",
            position: "relative",
            button: {
              width: "100%",
            },
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "calc((100% - 24px) / 2)",
              height: "calc(100% - 16px)",
              background: "#fff",
              borderRadius: "8px",
              left:
                tab === LLMNodeTypes.Single
                  ? "calc(0% + 8px)"
                  : "calc(50% + 4px)",
              top: "8px",
              transition: "left 0.3s ease",
            }}
          ></Box>
          <CommonStyles.Button onClick={() => setTab(LLMNodeTypes.Single)}>
            Single
          </CommonStyles.Button>
          <CommonStyles.Button onClick={() => setTab(LLMNodeTypes.Batch)}>
            Batch processing
          </CommonStyles.Button>
        </Box>
        <SingleTab />
      </Collapse>

      <Handle
        type="source"
        position={Position.Right}
        id={handleid.source}
        isConnectable={true}
        className="handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        id={handleid.target}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(LLMNode);
