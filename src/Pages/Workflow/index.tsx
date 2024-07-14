import { Box, TextField } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import CreateWorkFlowButton from "./Components/CreateWorkFlowButton";
import CommonIcons from "../../Components/CommonIcons";
import FlowChart from "./Components/FlowChart";
import { ReactFlowProvider } from "@xyflow/react";

const Workflow = () => {
  //! State

  //! Function

  //! Render
  return (
    <ReactFlowProvider>
      <FlowChart />
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
