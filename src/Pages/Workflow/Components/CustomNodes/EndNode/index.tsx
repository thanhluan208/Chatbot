import React, { useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Collapse } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonStyles from "../../../../../Components/CommonStyles";

import CommonIcons from "../../../../../Components/CommonIcons";
import Parameters from "./Parameter";

const EndNode = () => {
  //! State
  const [open, setOpen] = React.useState(true);

  const handleid = useMemo(() => {
    return uuid();
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
        width: "500px",
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
          src="https://sf16-va.tiktokcdn.com/obj/eden-va2/dvsmryvd_avi_dvsm/ljhwZthlaukjlkulzlp/icon/icon-Start.png"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "4px",
            minWidth: "30px",
            minHeight: "30px",
          }}
        />
        <CommonStyles.Typography type="normal14">End</CommonStyles.Typography>
      </Box>

      <Collapse in={open}>
        <CommonStyles.Typography
          color={"#1c1d2399"}
          sx={{
            marginTop: "8px",
          }}
          type="normal14"
        >
          The final node of the workflow, used to return the result information
          after the workflow runs.
        </CommonStyles.Typography>

        <Parameters />
      </Collapse>

      <Handle
        type="target"
        position={Position.Left}
        id={handleid}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(EndNode);
