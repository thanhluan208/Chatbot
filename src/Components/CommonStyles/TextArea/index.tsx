import { Box } from "@mui/material";

const TextArea = () => {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <textarea
        style={{
          width: "100%",
          height: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          resize: "none",
          outline: "none",
        }}
      />
    </Box>
  );
};

export default TextArea;
