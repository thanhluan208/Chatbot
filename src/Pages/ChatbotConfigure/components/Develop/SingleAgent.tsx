import  { Fragment } from "react";
import PersonaAndPrompt from "../PersonaAndPrompt";
import PreviewChat from "../PreviewChat";
import Configure from "../Configure";
import { Box } from "@mui/material";

const SingleAgent = () => {
  return (
    <Fragment>
      <Box flex={2} paddingRight="10px">
        <PersonaAndPrompt />
      </Box>
      <Box flex={3} position="relative" paddingBottom="80px">
        <PreviewChat />
      </Box>
      <Box flex={2} padding="8px 10px 0 20px">
        <Configure />
      </Box>
    </Fragment>
  );
};

export default SingleAgent;
