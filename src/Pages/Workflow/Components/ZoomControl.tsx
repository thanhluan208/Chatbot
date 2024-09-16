import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, InputAdornment, useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";

export default function ZoomControl() {
  //! State
  const theme = useTheme();
  const { getZoom, zoomTo } = useReactFlow();

  const zoom = getZoom();
  //! Function
  const handleChange = (value: string | number) => {
    zoomTo(+value / 100)
  }

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        "& .iconBtn": {
          borderRadius: "8px",
          background: theme.colors.custom.backgroundCard,
          "&:hover": {
            background: theme.colors.custom.backgroundCardHover,
          },
        },
      }}
    >
      <CommonStyles.Button isIcon className="iconBtn">
        <CommonIcons.Add />
      </CommonStyles.Button>
      <CommonStyles.Input
        inputProps={{
          min: 0.01,
          max: 2
        }}
        initValue={zoom * 100}
        key={zoom}
        type="number"
        InputProps={{
            endAdornment: <InputAdornment position="end" sx={{
                marginRight:'12px'
            }}>%</InputAdornment>
        }}
        sxContainer={{
            width:'100px',
        }}
        onValueChange={handleChange}
      />
      <CommonStyles.Button isIcon className="iconBtn">
        <CommonIcons.Remove />
      </CommonStyles.Button>
    </Box>
  );
}
