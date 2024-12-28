import cachedKeys from "@/Constants/cachedKeys";
import useGetWorkflows from "@/Hooks/workflow/useGetWorkFlow";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useSave } from "@/Stores/useStore";
import { queryWorkflow, VisualOption } from "@/Types/workflow";
import { Box } from "@mui/material";
import { useEffect, useMemo } from "react";
import EachWorkflow from "./Components/misc/EachWorkflow";
import Mansory from "@mui/lab/Masonry";

const Workflow = () => {
  //! State
  const { userId } = useAuth();
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
      <Mansory
        columns={{
          sm: 1,
          md: 1,
          xmd: 2,
          xl: 3,
        }}
        spacing={2}
        sx={{
          maxWidth: "1600px",
          margin: "auto",
        }}
      >
        {!!data &&
          data?.list_workflows?.map((workflow) => {
            return <EachWorkflow key={workflow.workflow_id} {...workflow} />;
          })}
      </Mansory>
    </Box>
  );
};

export default Workflow;
