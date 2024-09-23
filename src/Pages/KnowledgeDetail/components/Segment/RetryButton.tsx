import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { retryUploadFile } from "@/Constants/api";
import {
  FileStatus,
  FileData,
} from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useGet } from "@/Stores/useStore";
import { CircularProgress } from "@mui/material";
import React, { Fragment, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const RetryButton = ({ row }: { row: FileData }) => {
  //! State
  const [loading, setLoading] = React.useState(false);
  const { userId } = useAuth();
  const { knowledgeId } = useParams();

  const refetchListFile = useGet("REFETCH_KNOWLEDGE_DETAILS");

  //! Function
  const handleRetry = useCallback(async () => {
    if(loading || !userId || !knowledgeId) return;
    setLoading(true);

    try {
      await httpServices.post(retryUploadFile, {
        user_id: userId,
        knowledge_storage_id: knowledgeId,
        file_name: row.name,
      });

      refetchListFile && (await refetchListFile());

      toast.success("Retry successfully");
    } catch (error) {
      toast.error("Retry failed");
    }
  }, [row]);

  return (
    <Fragment>
      {row.process_status === FileStatus.FAILED && (
        <CommonStyles.Button
          isIcon
          isRound={false}
          tooltip="Retry"
          onClick={handleRetry}
          disabled={loading}
        >
          {loading ? <CircularProgress size={14}/> : <CommonIcons.Refresh />}
        </CommonStyles.Button>
      )}
    </Fragment>
  );
};

export default RetryButton;
