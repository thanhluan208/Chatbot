import { Box, InputAdornment } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetListKnowledgeFiles from "../../Hooks/Knowledges/useGetListKnowledgeFiles";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonIcons from "../../Components/CommonIcons";
import AddContentButton from "./components/AddContentButton";
import PerfectScrollBar from "react-perfect-scrollbar";

const KnowledgeDetail = () => {
  //! State
  const params = useParams();
  const save = useSave();
  const { knowledgeId } = params || {};
  const [filters, setFilter] = useState({
    search: "",
  });
  const debounceRef = useRef<any>(null);

  const payload = useMemo(() => {
    if (knowledgeId) {
      return {
        user_input: "a573f288-2dab-49ae-b3c6-bd84374a9bf5",
        knowledge_input: knowledgeId,
      };
    }

    return undefined;
  }, [knowledgeId]);
  const { data, isLoading, refetch } = useGetListKnowledgeFiles(
    payload,
    !!payload
  );

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
              <CommonStyles.Button isIcon>
                <CommonIcons.Clear />
              </CommonStyles.Button>
              <CommonIcons.Topic
                color="primary"
                sx={{ width: 48, height: 48 }}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <CommonStyles.Typography type="bold18">
                  {knowledgeId || "Anonymous knowledge"}
                </CommonStyles.Typography>
                <CommonStyles.Chip label="Auto-segment" />
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
            }}
          ></Box>
        </PerfectScrollBar>
      </Box>
    </Box>
  );
};

export default KnowledgeDetail;
