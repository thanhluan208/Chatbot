import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import { Box, InputAdornment } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { useRef } from "react";

export default function ZoomControl() {
  //! State
  const { getZoom, zoomTo } = useReactFlow();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const zoom = useGet("VIEWPORT") || getZoom();
  //! Function
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    zoomTo(+event.target.value / 100);
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
        onClick={() => zoomTo((zoom * 100 + 10) / 100)}
        tooltip="Zoom in"
      >
        <CommonIcons.Add />
      </CommonStyles.Button>
      <CommonStyles.Input
        ref={inputRef}
        inputProps={{
          min: 0.01,
          max: 2,
        }}
        initValue={(zoom * 100).toFixed(2)}
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
        afterOnchange={handleChange}
      />
      <CommonStyles.Button
        isIcon
        className="iconBtn"
        onClick={() => zoomTo((zoom * 100 - 10) / 100)}
        tooltip="Zoom out"
      >
        <CommonIcons.Remove />
      </CommonStyles.Button>
    </Box>
  );
}
