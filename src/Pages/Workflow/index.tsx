import "./index.css";

import { Box } from "@mui/material";
import { useAuth } from "@/Providers/AuthenticationProvider";
import CommonStyles from "@/Components/CommonStyles";
import CreateWorkFlowButton from "./Components/misc/CreatWorkflowButton";
import useGetWorkflows from "@/Hooks/workflow/useGetWorkFlow";
import { queryWorkflow, VisualOption } from "@/Types/workflow";
import { useEffect, useMemo } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import EachWorkflow from "./Components/misc/EachWorkflow";

const Workflow = () => {
  //! State
  const { userData, userId } = useAuth();
  const save = useSave();
  const queryWorkflow = useMemo<queryWorkflow>(() => {
    return {
      user_id: userId as string,
      visual_option: VisualOption.OWNED,
    };
  }, [userId]);
  const { data, isLoading } = useGetWorkflows(queryWorkflow);

  //! Function
  useEffect(() => {
    save(cachedKeys.LOADING_APP, isLoading);
  }, [isLoading]);

  //! Render
  return (
    <Box
      sx={{
        padding: "24px",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display={"flex"} gap="8px">
          <img
            src={userData?.avatar_url}
            style={{
              height: "32px",
              width: "32px",
              borderRadius: "50%",
            }}
          />
          <CommonStyles.Typography type="semiBold20">
            Workflow
          </CommonStyles.Typography>
        </Box>
        <CreateWorkFlowButton />
      </Box>

      <Box mt={"24px"}>
        {data &&
          data?.list_workflows?.map((workflow) => {
            return <EachWorkflow key={workflow.workflow_id} {...workflow} />;
          })}
      </Box>
    </Box>
  );
};

export default Workflow;
