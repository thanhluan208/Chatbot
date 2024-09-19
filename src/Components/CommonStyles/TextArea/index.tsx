import { Box, useTheme } from "@mui/material";

const TextArea = () => {
  const theme= useTheme()
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.colors.custom.backgroundCard,
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
