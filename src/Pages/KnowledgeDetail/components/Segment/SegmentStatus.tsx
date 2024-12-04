import CommonStyles from "@/Components/CommonStyles";
import useGetFileData from "@/Hooks/Knowledges/useGetFileData";
import {
  FileData,
  FileStatus,
} from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useGet } from "@/Stores/useStore";
import { Box, useTheme } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

const SegmentStatus = ({ row }: { row: FileData }) => {
  //! State
  const theme = useTheme();
  const { userId } = useAuth();
  const { knowledgeId } = useParams();
  const intervalRef = useRef<number | null>(null);
  
  const refetchKnowledgeFiles =
    row?.process_status === FileStatus.FAILED ||
    row.process_status === FileStatus.SUCCESS
      ? undefined
      : useGet("REFETCH_KNOWLEDGE_DETAILS");

    
  const payload = useMemo(() => {
    return {
      user_id: userId || '',
      knowledge_storage_id: knowledgeId || '',
      file_name: row.name,
    };
  }, [userId, knowledgeId, row?.name]);

  const { data, refetch } = useGetFileData(
    payload,
    !!payload &&
      (row.process_status === FileStatus.IN_QUEUE ||
        row.process_status === FileStatus.PROCESSING)
  );

  const shouldRefetch = !!data
    ? data.process_status === FileStatus.IN_QUEUE ||
      data.process_status === FileStatus.PROCESSING
    : false;

  //! Function
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (shouldRefetch) {
      intervalRef.current = setInterval(() => {
        refetch();
      }, 10000);
    } else {
      refetchKnowledgeFiles && refetchKnowledgeFiles();
      intervalRef.current && clearInterval(intervalRef.current);
    }

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [shouldRefetch, refetchKnowledgeFiles]);

  //! Render
  switch (row.process_status) {
    case FileStatus.PROCESSING:
      return (
        <Box
          sx={{
            background: theme.palette.info.main,
            borderRadius: "5px",
            padding: "5px 10px",
            width: "fit-content",
            color: theme.palette.info.contrastText,
          }}
        >
          <CommonStyles.Typography type="semiBold14">
            Processing
          </CommonStyles.Typography>
        </Box>
      );
    case FileStatus.SUCCESS:
      return (
        <Box
          sx={{
            background: theme.palette.success.main,
            borderRadius: "5px",
            padding: "5px 10px",
            width: "fit-content",
            color: theme.palette.success.contrastText,
          }}
        >
          <CommonStyles.Typography type="semiBold14">
            Success
          </CommonStyles.Typography>
        </Box>
      );
    case FileStatus.IN_QUEUE:
      return (
        <Box
          sx={{
            background: theme.palette.warning.main,
            borderRadius: "5px",
            padding: "5px 10px",
            width: "fit-content",
            color: theme.palette.warning.contrastText,
          }}
        >
          <CommonStyles.Typography type="semiBold14">
            In queue
          </CommonStyles.Typography>
        </Box>
      );
    case FileStatus.FAILED:
      return (
        <Box
          sx={{
            background: theme.palette.error.main,
            borderRadius: "5px",
            padding: "5px 10px",
            width: "fit-content",
            color: theme.palette.error.contrastText,
          }}
        >
          <CommonStyles.Typography type="semiBold14">
            Failed
          </CommonStyles.Typography>
        </Box>
      );
    default:
      return (
        <Box
          sx={{
            background: theme.palette.info.main,
            borderRadius: "5px",
            padding: "5px 10px",
            width: "fit-content",
            color: theme.palette.info.contrastText,
          }}
        >
          <CommonStyles.Typography type="semiBold14">
            Processing
          </CommonStyles.Typography>
        </Box>
      );
  }
};

export default SegmentStatus;
