import { Box, ClickAwayListener, Fade, Popper } from "@mui/material";
import {  TestPDF } from "../../../Hooks/Knowledges/useGetListFolderKnowledge";
import { useState } from "react";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import DeleteFileButton from "./DeleteFileButton";

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
  //! Function
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //! Render
  return (
    <Box>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box
          sx={{
            padding: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                    background: "#fff",
                  }}
                >
                  <CommonStyles.Button
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
                    <CommonStyles.Typography type="normal12" color="#000">
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
                        <CommonStyles.Typography type="normal12" color="#000">
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
          borderTop: "1px solid #E0E0E0",
          widht: "100%",
          height: "100%",
        }}
      ></Box>
    </Box>
  );
};

export default SegmentList;
