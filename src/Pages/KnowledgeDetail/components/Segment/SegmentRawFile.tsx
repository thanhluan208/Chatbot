import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { FileData } from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import useGetRawKnowledge from "@/Hooks/Knowledges/useGetRawKnowledge";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, Drawer, useTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const SegmentRawFile = () => {
  //! State
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const detail: FileData = useGet("SEGMENT_RAW");
  const save = useSave();
  const theme = useTheme();
  const { userId } = useAuth();
  const params = useParams();
  const knowledgeId = params["knowledgeId"];
  const payload = useMemo(() => {
    if (!detail || !userId || !knowledgeId) return;
    return {
      user_id: userId as string,
      knowledge_storage_id: knowledgeId as string,
      file_name: detail?.name,
    };
  }, [detail, userId, knowledgeId]);

  const { data, isLoading } = useGetRawKnowledge(payload, !!payload);

  //! Function
  const handleClose = () => {
    save(cachedKeys.SEGMENT_RAW, undefined);
  };

  useEffect(() => {
    return () => {
      save(cachedKeys.SEGMENT_RAW, undefined);
    };
  }, []);

  //! Render
  return (
    <Drawer anchor="right" open={!!detail} onClose={handleClose}>
      <Box
        sx={{
          width: 600,
          height: "100vh",
          background: theme.colors.custom.backgroundSecondary,
          padding: "16px 24px",
        }}
        role="presentation"
      >
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CommonStyles.Typography
            type="semiBold16"
            sx={{
              maxWidth: "400px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {detail?.name}
          </CommonStyles.Typography>
          <CommonStyles.Button isIcon onClick={handleClose} isRound={false}>
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>

        <Box sx={{ marginTop: "20px" }}>
          {data && (
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <div
                style={{
                  height: "750px",
                  maxWidth: "900px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Viewer
                  fileUrl={data}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </div>
            </Worker>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SegmentRawFile;
