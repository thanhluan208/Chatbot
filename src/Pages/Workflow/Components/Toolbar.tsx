import { Box } from "@mui/material";
import AddNodes from "./AddNodes";

const Toolbar = ({
  listNode,
}: {
  listNode: { name: string; label: string }[];
}) => {
  //! State

  //! Function

  //! Render
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "20px",
        right: "250px",
        background: "#fff",
        padding: "10px 20px",
        boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
        borderRadius: "12px",
      }}
    >
      <AddNodes listNode={listNode ?? []} />
    </Box>
  );
};

export default Toolbar;
