import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetListKnowledgeFiles from "../../Hooks/Knowledges/useGetListKnowledgeFiles";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useMemo } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonIcons from "../../Components/CommonIcons";
import AddContentButton from "./components/AddContentButton";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { isEmpty } from "lodash";
import EditKnowledge from "./components/EditKnowledge";
import PublicButton from "./components/PublicButton";
import { boolean } from "@/Helpers";
import httpServices from "@/Services/httpServices";
import { updateKnowledgeToBot } from "@/Constants/api";
import { toast } from "react-toastify";
import SegmentDetail from "./components/Segment/SegmentDetail";
import SegmentList from "./components/Segment/SegmentList";
import SegmentRawFile from "./components/Segment/SegmentRawFile";

const KnowledgeDetail = () => {
  //! State
  const params = useParams();
  const theme = useTheme();
  const save = useSave();
  const navigate = useNavigate();
  const { knowledgeId, botId } = params || {};
  const queryParams = new URLSearchParams(location.search);

  const isOwner = boolean(queryParams.get("isOwner") as string);

  const { userId } = useAuth();

  const payload = useMemo(() => {
    if (knowledgeId && userId) {
      return {
        user_id: userId,
        knowledge_storage_id: knowledgeId,
      };
    }

    return undefined;
  }, [knowledgeId, userId]);
  const { data, isLoading, refetch } = useGetListKnowledgeFiles(
    payload,
    !!payload
  );

  const numOfDocs = useMemo(() => {
    return data.length;
  }, [data]);

  const numsOfSegments = useMemo(() => {
    return data.reduce((acc, cur) => {
      return acc + cur.n_points;
    }, 0);
  }, [data]);

  //! Function
  const handleAddKnowledgeToBot = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!botId || !knowledgeId || !userId) return;

    const toastId = toast.loading("Adding knowledge to bot...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(updateKnowledgeToBot, {
        user_id: userId,
        bot_id: botId,
        knowledge_storage_ids: [knowledgeId],
      });

      toast.update(toastId, {
        render: "Added knowledge to bot successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to add knowledge to bot!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  //! Effect
  useEffect(() => {
    save(cachedKeys.REFETCH_KNOWLEDGE_FILES, refetch);
  }, [save, refetch]);

  //! Render
  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: theme.colors.custom.background,
      }}
    >
      <SegmentDetail />
      <SegmentRawFile />
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box>
        <Box
          sx={{
            padding: "16px 24px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CommonStyles.Button isIcon onClick={() => navigate(-1)}>
                <CommonIcons.Clear />
              </CommonStyles.Button>
              <CommonIcons.Topic
                color="primary"
                sx={{ width: 48, height: 48 }}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <CommonStyles.Typography
                    type="bold18"
                    sx={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textWrap: "nowrap",
                    }}
                  >
                    {knowledgeId || "Anonymous knowledge"}
                  </CommonStyles.Typography>
                  <EditKnowledge />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <CommonStyles.Chip label="Auto-segment" />
                  <CommonStyles.Chip label={`${numOfDocs} document(s)`} />
                  <CommonStyles.Chip label={`${numsOfSegments} segment(s)`} />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "8px" }}>
              {isOwner && (
                <Fragment>
                  <PublicButton />
                  <AddContentButton />
                  {botId && (
                    <CommonStyles.Button
                      variant="contained"
                      onClick={handleAddKnowledgeToBot}
                    >
                      Add to bot
                    </CommonStyles.Button>
                  )}
                </Fragment>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: "0 24px",
            margin: "24px 0",

            maxHeight: "calc(100vh - 92.5px - 24px * 2)",
            height: "calc(100vh - 92.5px - 24px * 2)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box
            sx={{
              background: theme.colors.custom.backgroundCard,
              height: "100%",
              width: "100%",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            {isEmpty(data) ? (
              <Box
                sx={{
                  height: "300px",
                  width: "300px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  svg: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              >
                <CommonIcons.EmptyIcon />
                <CommonStyles.Typography
                  type="bold18"
                  align="center"
                  mt={"20px"}
                >
                  No segment found
                </CommonStyles.Typography>
              </Box>
            ) : (
              <SegmentList data={data} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeDetail;
