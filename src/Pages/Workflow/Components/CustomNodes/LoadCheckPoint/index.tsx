import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Box } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonStyles from "../../../../../Components/CommonStyles";

interface ILoadCheckPointProps {
  label: string;
  style?: any;
}

const LoadCheckPointHandle = (props: ILoadCheckPointProps) => {
  const { label, style } = props;
  const id = uuid();
  return (
    <Box
      sx={{
        // position: "relative",
        paddingRight: " 20px ",
        textAlign: "end",
        // "& .react-flow__handle-right": {
        //   right: "10px",
        // },
      }}
    >
      <CommonStyles.Typography>{label}</CommonStyles.Typography>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        id={id}
      />
    </Box>
  );
};

interface IProps {
  data: any;
  isConnectable: boolean;
}

const LoadCheckPoint = (props: IProps) => {
  //! State
  const { data } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "4px",
        background: "#fff",
        border: "solid 1px #ccc",
        minWidth: "200px",
      }}
    >
      <Box
        sx={{
          padding: "0 10px",
          borderBottom: "solid 1px #ccc",
        }}
      >
        <CommonStyles.Typography>Node title</CommonStyles.Typography>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: "#555" }}
        isConnectable={true}
      />

      <LoadCheckPointHandle label="MODEL" />
      {/* <LoadCheckPointHandle label="CLIP" />
      <LoadCheckPointHandle label="VAE" /> */}
    </Box>
  );
};

export default React.memo(LoadCheckPoint);
