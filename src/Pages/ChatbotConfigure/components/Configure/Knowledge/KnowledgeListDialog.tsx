import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  useTheme,
} from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import { Fragment, useEffect, useState } from "react";
import useGetListFolderKnowledge from "../../../../../Hooks/Knowledges/useGetListFolderKnowledge";
import cachedKeys from "../../../../../Constants/cachedKeys";
import { useSave } from "../../../../../Stores/useStore";
import CreateKnowledgeButton from "./CreateKnowledgeButton";
import KnowledgeFolder, { IKnowledgeFolder } from "./KnowledgeFolder";
import PerfectScollBar from "react-perfect-scrollbar";

interface IKnowledgeListDialog {
  toggle: () => void;
}

export const KnowledgeFilter = {
  All: "all",
  Owned: "owned",
  Shared: "shared",
};

export const KnowledgeSortBy = {
  createdAt: "Creation Time",
  editAt: "Edit Time",
};

const KnowledgeListDialog = (props: IKnowledgeListDialog) => {
  //! State
  const { toggle } = props;
  const theme = useTheme();
  const save = useSave();
  const [filters, setFilter] = useState({
    visual_option: KnowledgeFilter.All,
    search_input: "",
  });

  const { data, isLoading, refetch } = useGetListFolderKnowledge(filters);

  // const debounceRef = useRef<any>(null);

  //! Function

  // const handleChangeSearch = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   if (debounceRef.current) clearTimeout(debounceRef.current);
  //   debounceRef.current = setTimeout(() => {
  //     setFilter((prev) => ({ ...prev, search_input: e.target.value }));
  //     clearTimeout(debounceRef.current);
  //   }, 300);
  // };

  //! Effect
  useEffect(() => {
    save(cachedKeys.REFETCH_FOLDER_KNOWLEDGE, refetch);
  }, [save, refetch]);

  //! Render
  return (
    <Box>
      <DialogTitle>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={3}
        >
          <CommonStyles.Typography type="semiBold18">
            Select knowledge
          </CommonStyles.Typography>
          <CommonStyles.Button isIcon hasBorder={false} onClick={toggle}>
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "20px 28px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex" }}>
            {Object.entries(KnowledgeFilter).map(([key, value], index) => {
              return (
                <Box
                  sx={{
                    padding: "0 12px",
                    borderRight: index < 2 ? "solid 1px #ccc" : "",
                    cursor: "pointer",
                  }}
                  key={value}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, visual_option: value }))
                  }
                >
                  <CommonStyles.Typography
                    type="bold14"
                    color={
                      filters.visual_option === value
                        ? theme.palette.primary.main
                        : theme.colors.custom.normalColorTypo
                    }
                  >
                    {key}
                  </CommonStyles.Typography>
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              "& .MuiInputBase-root": {
                minWidth: "180px !important",
              },
            }}
          >
            {/* <CommonStyles.Input
              afterOnchange={handleChangeSearch}
              value={filters.search_input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "10px" }}>
                    <CommonIcons.Search />
                  </InputAdornment>
                ),
              }}
            /> */}
            <CreateKnowledgeButton />
          </Box>
        </Box>

        <PerfectScollBar
          style={{
            marginTop: "20px",
            maxHeight: "65vh",
            overflowY: "auto",
            padding: "0 20px",
            position: "relative",
          }}
        >
          {isLoading && <CommonStyles.LoadingOverlay isLoading={isLoading} />}
          {data?.map((item: IKnowledgeFolder, index: number) => {
            return (
              <Fragment key={item.id}>
                <KnowledgeFolder
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  size={item.size}
                  quantity={item.quantity}
                  createdAt={item.createdAt}
                  sharingWithBots={item.sharingWithBots}
                  owner_id={item.owner_id}
                  avatar={item.avatar}
                />
                {index < data.length - 1 && <Divider />}
              </Fragment>
            );
          })}
        </PerfectScollBar>
      </DialogContent>
    </Box>
  );
};

export default KnowledgeListDialog;
