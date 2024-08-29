import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  useTheme,
} from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import { Fragment, useEffect, useRef, useState } from "react";
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
  Owner: "owner",
  Shared: "shared",
};

export const KnowledgeSortBy = {
  createdAt: "Creation Time",
  editAt: "Edit Time",
};

const knowledgeSortByOptions = ["createdAt", "editAt"];

const KnowledgeListDialog = (props: IKnowledgeListDialog) => {
  //! State
  const { toggle } = props;
  const theme: any = useTheme();
  const save = useSave();
  const [filters, setFilter] = useState({
    visual_option: KnowledgeFilter.All,
    sortBy: "createdAt",
    search_input: "",
  });

  console.log('filters', filters)
  const { data, isLoading, refetch } = useGetListFolderKnowledge(filters);

  const debounceRef = useRef<any>(null);

  //! Function
  const renderOption = (option: keyof typeof KnowledgeSortBy) => {
    const isSelected = filters.sortBy === option;
    return (
      <MenuItem
        value={option}
        key={option}
        onClick={() => {
          setFilter((prev) => ({ ...prev, sortBy: option }));
        }}
      >
        <Box sx={{ width: 16, height: 16, marginRight: "8px" }}>
          {isSelected && (
            <CommonIcons.CheckOutlined sx={{ width: 16, height: 16 }} />
          )}
        </Box>
        <CommonStyles.Typography type={isSelected ? "bold12" : "normal12"}>
          {KnowledgeSortBy[option]}
        </CommonStyles.Typography>
      </MenuItem>
    );
  };

  const customRenderValue = (value: keyof typeof KnowledgeSortBy) => {
    return (
      <Box sx={{ display: "flex", gap: "8px" }}>
        <CommonStyles.Typography type="bold14" color="#1c1f2366">
          Sort:
        </CommonStyles.Typography>
        <CommonStyles.Typography type="bold14">
          {KnowledgeSortBy[value]}
        </CommonStyles.Typography>
      </Box>
    );
  };

  const handleChangeSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search_input: e.target.value }));
      clearTimeout(debounceRef.current);
    }, 300);
  };

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
          <CommonStyles.Button isIcon onClick={toggle}>
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
                        : "#1d1c2399"
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
            <CommonStyles.Select
              value={filters.sortBy}
              options={knowledgeSortByOptions}
              renderOption={renderOption}
              customRenderValue={customRenderValue}
            />

            <CommonStyles.Input
              afterOnchange={handleChangeSearch}
              value={filters.search_input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ marginLeft: "10px" }}>
                    <CommonIcons.Search />
                  </InputAdornment>
                ),
              }}
            />
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
