import {
  Box,
  ClickAwayListener,
  Fade,
  Popper,
  Tooltip,
  useTheme,
} from "@mui/material";
import { TestPDF } from "../../../Hooks/Knowledges/useGetListFolderKnowledge";
import { useMemo, useState } from "react";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import DeleteFileButton from "./DeleteFileButton";
import { useParams } from "react-router-dom";
import useGetListSegment from "@/Hooks/Knowledges/useGetListSegments";
import { isEmpty } from "lodash";
import { Column } from "@/Components/CommonStyles/Table";
import { convertSize } from "@/Helpers";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

interface ISegmentList {
  data: TestPDF[] | [];
}

const SegmentList = (props: ISegmentList) => {
  //! State
  const { data } = props;
  const [currentSegment, setCurrentSegment] = useState("All");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const currentFile = Object.values(data).find((item) => {
    return item.name === currentSegment;
  });

  const save = useSave()
  const theme = useTheme();
  const params = useParams();
  const knowledgeId = params["knowledgeId"];

  const payload = useMemo(() => {
    if (currentFile?.name && knowledgeId) {
      return {
        knowledge_storage_id: knowledgeId,
        file_name: currentFile.name,
      };
    }
  }, [knowledgeId, currentFile?.name]);

  const { data: segment, isLoading } = useGetListSegment(payload, !!payload);

  const columns: Column<TestPDF>[] = [
    {
      id: "id",
      label: "STT",
      width: 50,
      customRender: (_, rowIndex) => {
        return (
          <CommonStyles.Typography type="bold14" ml={1}>
            {rowIndex + 1}
          </CommonStyles.Typography>
        );
      },
    },
    {
      id: "name",
      label: "Name",
      customRender: (row) => {
        return (
          <Tooltip title={row.name} placement="top-end">
            <div>
              <CommonStyles.Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                  display: "block",
                }}
              >
                {row.name}
              </CommonStyles.Typography>
            </div>
          </Tooltip>
        );
      },
    },
    {
      id: "fileType",
      label: "File type",
      customRender: (row) => {
        return <Box sx={{ pr: "10px" }}>{row.file_type}</Box>;
      },
    },
    {
      id: "segments",
      label: "Segment",
      customRender: (row) => {
        return <Box sx={{ pr: "10px" }}>{row.n_points} segment(s)</Box>;
      },
    },
    {
      id: "fileSize",
      label: "File size",
      customRender: (row) => {
        return (
          <CommonStyles.Typography>
            {convertSize(row.file_size)}
          </CommonStyles.Typography>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      width: 100,
      customRender: (row) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <DeleteFileButton file={row} />
          </Box>
        );
      },
    },
  ];

  //! Function
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(prev => (prev ? null : event.currentTarget));
  };

  const handleClickRow = (row: TestPDF) => {
    setCurrentSegment(row.name);
  };

  const handleClickSegment = (item: TestPDF) => {
    save(cachedKeys.SEGMENT_DETAIL, item)
  }

  //! Render

  return (
    <Box
      sx={{
        height: "calc(100% - 56px)",
      }}
    >
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box
          sx={{
            padding: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "56px",
          }}
        >
          <CommonStyles.Button
            onClick={handleClick}
            endIcon={
              <CommonIcons.KeyboardArrowDown
                sx={{
                  transition: "transform 0.3s",
                  transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            }
          >
            {currentSegment ? currentSegment : "All"}
          </CommonStyles.Button>
          <Popper
            sx={{ zIndex: 1200 }}
            open={!!anchorEl}
            anchorEl={anchorEl}
            placement={"bottom-start"}
            transition
            keepMounted={false}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Box
                  sx={{
                    boxShadow:
                      "0 0 1px 0 rgba(0,0,0,.3),0 4px 14px 0 rgba(0,0,0,.1)",
                    borderRadius: "12px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    background: theme.colors.custom.backgroundSecondary,
                  }}
                >
                  <CommonStyles.Button
                    fullWidth
                    onClick={() => setCurrentSegment("All")}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                    }}
                  >
                    {currentSegment === "All" ? (
                      <CommonIcons.Check />
                    ) : (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    )}
                    <CommonStyles.Typography type="normal12">
                      All
                    </CommonStyles.Typography>
                  </CommonStyles.Button>
                  {data.map((item) => {
                    return (
                      <CommonStyles.Button
                        onClick={() => setCurrentSegment(item.name)}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px",
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
                        <CommonStyles.Typography type="normal12">
                          {item.name}
                        </CommonStyles.Typography>
                      </CommonStyles.Button>
                    );
                  })}
                </Box>
              </Fade>
            )}
          </Popper>
          {currentFile && <DeleteFileButton file={currentFile} />}
        </Box>
      </ClickAwayListener>
      <Box
        sx={{
          borderTop: `1px solid ${theme.colors.custom.borderColor}`,
          width: "100%",
          height: "100%",
          padding: "20px 40px",
          "& .List": {
            "&:-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
      >
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
        {!isEmpty(segment) && currentSegment !== "All" && (
          <CommonStyles.VirtualizeList items={segment} onClick={handleClickSegment}/>
        )}

        {currentSegment === "All" && !isEmpty(data) && (
          <CommonStyles.Table
            columns={columns}
            data={data ?? []}
            onClickRow={handleClickRow}
          />
        )}
      </Box>
    </Box>
  );
};

export default SegmentList;
