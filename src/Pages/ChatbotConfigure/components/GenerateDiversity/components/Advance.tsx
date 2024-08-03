import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../../Components/CommonStyles";
import { useState } from "react";
import { Box, Collapse } from "@mui/material";
import CommonIcons from "../../../../../Components/CommonIcons";
import SlideAndNumField from "./SlideAndNumField";

const TemperatureHint = () => {
  return (
    <div>
      <div>
        <strong>Temperature</strong>:
      </div>
      <ul>
        <li>
          <CommonStyles.Typography>
            When you increase this value, the model outputs more diverse and
            innovative content; when you decrease it, the model outputs less
            diverse content that strictly follows the given instructions.
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            {" "}
            It is recommended not to adjust this value with "Top p" at the same
            time.
          </CommonStyles.Typography>
        </li>
      </ul>
    </div>
  );
};

const TopPHInt = () => {
  return (
    <div>
      <div>
        <strong>Top P</strong>:
      </div>
      <ul>
        <li>
          <CommonStyles.Typography>
            An alternative to sampling with temperature, where only tokens
            within the top p probability mass are considered. For example, 0.1
            means only the top 10% probability mass tokens are considered.
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            We recommend altering this or temperature, but not both.
          </CommonStyles.Typography>
        </li>
      </ul>
    </div>
  );
};

const marks = [
  {
    value: 0,
    label: "0",
  },

  {
    value: 2,
    label: "2",
  },
];

const topPMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 1,
    label: "1",
  },
];
const Advance = () => {
  //! State
  const [open, setOpen] = useState(true);

  //! Function

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          mt: "16px",
          alignItems: "center",
          mb: open ? "-18px" : "",
          transition: "margin-bottom 0.3s",
        }}
      >
        <CommonStyles.Button
          onClick={() => setOpen(!open)}
          endIcon={
            <CommonIcons.KeyboardArrowDown
              sx={{
                transition: "transform 0.3s",
                transform: !open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          }
        >
          Advance
        </CommonStyles.Button>
      </Box>
      <Collapse in={open}>
        <SlideAndNumField
          hintContent={<TemperatureHint />}
          name="temperature"
          title="Temperature"
          marks={marks}
          min={0}
          max={2}
        />

        <SlideAndNumField
          hintContent={<TopPHInt />}
          name="topP"
          title="Top P"
          marks={topPMarks}
          min={0}
          max={1}
        />
      </Collapse>
    </Fragment>
  );
};

export default Advance;
