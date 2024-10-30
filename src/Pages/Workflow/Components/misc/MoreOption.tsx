import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Workflow } from "@/Types/workflow";
import { Box, ClickAwayListener, Paper, Popper } from "@mui/material";
import { useState } from "react";
import DeleteBotButton from "./DeleteBotButton";

interface IMoreOption {
  workflow: Workflow;
}

function MoreOption(props: IMoreOption) {
  //! State
  const { workflow } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = !!anchorEl;

  //! Function

  //! Render
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <CommonStyles.Button
          isIcon
          isRound={false}
          hasBorder={false}
          className={anchorEl ? "" : "btnGroup"}
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
        >
          <CommonIcons.MoreVert />
        </CommonStyles.Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={"bottom-end"}
          keepMounted={false}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {() => (
            <Paper
              sx={{
                padding: "8px ",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                "& button": {
                  justifyContent: "start",
                },
              }}
            >
              {/* <CommonStyles.Button onClick={handleDuplicate}>
                <CommonStyles.Typography type="semiBold14">
                  Duplicate
                </CommonStyles.Typography>
              </CommonStyles.Button> */}
              <DeleteBotButton workflow={workflow} />
            </Paper>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

export default MoreOption;
