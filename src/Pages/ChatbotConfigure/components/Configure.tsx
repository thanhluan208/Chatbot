import { configures } from "../../../Constants/options";
import Section from "./Configure/Section";
import { Box } from "@mui/material";

const Configure = () => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {configures.map((conf) => {
        return (
          <Section title={conf.title} items={conf.items} key={conf.title} />
        );
      })}
    </Box>
  );
};

export default Configure;
