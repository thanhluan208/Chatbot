import { Box, TextField } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CreateWorkFlowButton from "./Components/CreateWorkFlowButton";
import CommonIcons from "../../Components/CommonIcons";
import FlowChart from "./Components/FlowChart";
import { ReactFlowProvider } from "@xyflow/react";


const initNodes = [
  {
    id: "b7e48d14-235b-4238-bdac-cd54ae7796e2",
    type: "customNode_startNode",
    position: {
      x: -320,
      y: 241,
    },
    data: {
      label: "customNode_startNode node",
    },
    measured: {
      width: 1002,
      height: 275,
    },
    selected: false,
    dragging: false,
  },
  {
    id: "c372a3b5-85fa-4b7d-a1e5-1913df8d6721",
    type: "customNode_endNode",
    position: {
      x: 1301,
      y: 175,
    },
    data: {
      label: "customNode_endNode node",
    },
    measured: {
      width: 500,
      height: 367,
    },
    selected: true,
    dragging: false,
  },
];

const Workflow = () => {
  //! State

  //! Function

  //! Render
  return (
    <ReactFlowProvider>
      <FlowChart initNodes={initNodes} listNode={[]}/>
    </ReactFlowProvider>
  );

  return (
    <Box
      sx={{
        padding: "24px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CommonStyles.Typography type="semiBold20">
          Workflow Store
        </CommonStyles.Typography>
        <CreateWorkFlowButton />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "40%",
          }}
        >
          <TextField
            placeholder="Search"
            fullWidth
            sx={{
              borderRadius: "8px !important",
              backgroundColor: "#fff",
              div: {
                borderRadius: "8px !important",
              },
              input: {
                height: "30px",
                padding: "5px 10px 7px",
              },
              fieldset: {
                border: "none",
              },
            }}
            InputProps={{
              startAdornment: (
                <CommonIcons.Search sx={{ width: 16, height: 16 }} />
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Workflow;
