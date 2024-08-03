import { Box, CircularProgress } from "@mui/material";

interface ILoadingOverlay {
  isLoading: boolean;
}

const LoadingOverlay = (props: ILoadingOverlay) => {
  const { isLoading } = props;

  return (
    <Box
      sx={{
        display: isLoading ? "flex" : "none",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingOverlay;
