import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import { Box, InputAdornment,  } from "@mui/material";
import { useReactFlow } from "@xyflow/react";

export default function ZoomControl() {
  //! State
  const { getZoom, zoomTo } = useReactFlow();

  const zoom = useGet("VIEWPORT") || getZoom();
  //! Function
  const handleChange = (value: string | number) => {
    zoomTo(+value / 100);
  };

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <CommonStyles.Button
        isIcon
        className="iconBtn"
        onClick={() => handleChange(zoom * 100 + 10)}
        tooltip="Zoom in"
      >
        <CommonIcons.Add />
      </CommonStyles.Button>
      <CommonStyles.Input
        inputProps={{
          min: 0.01,
          max: 2,
        }}
        initValue={(zoom * 100).toFixed(2)}
        key={zoom}
        type="number"
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                marginRight: "12px",
              }}
            >
              %
            </InputAdornment>
          ),
        }}
        sxContainer={{
          minWidth: "100px",
          width: "100px",
          input: {
            paddingRight: "0 !important",
          },
        }}
        onValueChange={handleChange}
      />
      <CommonStyles.Button
        isIcon
        className="iconBtn"
        onClick={() => handleChange(zoom * 100 - 10)}
        tooltip="Zoom out"
      >
        <CommonIcons.Remove />
      </CommonStyles.Button>
    </Box>
  );
}
