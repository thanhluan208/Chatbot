import { Box, InputAdornment } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetListKnowledgeFiles from "../../Hooks/Knowledges/useGetListKnowledgeFiles";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonIcons from "../../Components/CommonIcons";
import AddContentButton from "./components/AddContentButton";
import PerfectScrollBar from "react-perfect-scrollbar";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { isEmpty } from "lodash";
import SegmentList from "./components/SegmentList";
import EditKnowledge from "./components/EditKnowledge";

const KnowledgeDetail = () => {
  //! State
  const params = useParams();
  const save = useSave();
  const navigate = useNavigate();
  const { knowledgeId } = params || {};
  const [filters, setFilter] = useState({
    search: "",
  });
  const debounceRef = useRef<any>(null);
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
  const handleChangeSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: e.target.value }));
    }, 300);
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
        background: "#f7f7fa",
      }}
    >
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
              <CommonStyles.Input
                afterOnchange={handleChangeSearch}
                value={filters.search}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ marginLeft: "10px" }}
                    >
                      <CommonIcons.Search />
                    </InputAdornment>
                  ),
                }}
              />
              <AddContentButton />
              <CommonStyles.Button variant="contained">
                Add to bot
              </CommonStyles.Button>
            </Box>
          </Box>
        </Box>
        <PerfectScrollBar
          style={{
            padding: "0 24px",
            margin: "24px 0",

            maxHeight: "calc(100vh - 92.5px - 24px * 2",
            height: "calc(100vh - 92.5px - 24px * 2",
          }}
        >
          <Box
            sx={{
              background: "#fff",
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
        </PerfectScrollBar>
      </Box>
    </Box>
  );
};

export default KnowledgeDetail;
