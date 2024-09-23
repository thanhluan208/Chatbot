import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import {
  FileStatus,
  FileData,
} from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import { Box, CircularProgress } from "@mui/material";
import { useMemo } from "react";

interface SegmentFileProp {
  item: FileData;
  currentSegment: string;
  setCurrentSegment: (value: string) => void;
}

const SegmentFile = (props: SegmentFileProp) => {
  //! State
  const { item, currentSegment, setCurrentSegment } = props;
  

  const isPending = useMemo(() => {
    return item.process_status === FileStatus.IN_QUEUE || item.process_status === FileStatus.PROCESSING;
  },[item.process_status])
 
  //! Function
  

  //! Render
  return (
    <CommonStyles.Button
      tooltip={item.name}
      onClick={isPending ? undefined : () => setCurrentSegment(item.name)}
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        opacity: isPending ? 0.5 : 1,
      }}
      key={`${item.name}_${item.creation_date}`}
    >
      {currentSegment === item.name ? (
        <CommonIcons.Check />
      ) : (
        <Box
          sx={{
            width: 24,
            height: 24,
          }}
        />
      )}
      <CommonStyles.Typography
        type="normal12"
        sx={{
          maxWidth: "200px",
          textWrap: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.name}
      </CommonStyles.Typography>
      {isPending && <CircularProgress size={14} />}
    </CommonStyles.Button>
  );
};

export default SegmentFile;
