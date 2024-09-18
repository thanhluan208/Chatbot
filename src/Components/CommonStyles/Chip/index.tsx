import { Chip, SxProps,  } from "@mui/material";

interface IMuiChip {
  label: string;
  sx?: SxProps;
}

function MuiChip(props: IMuiChip) {
  //! State
  const { label, sx } = props;

  //! Function

  //! Render
  return (
    <Chip
      label={label}
      sx={{
        span: {
          padding: "0 4px",
        },
        padding: "4px 12px",
        borderRadius: "8px",
        height: "fit-content",
        ...sx,
      }}
    />
  );
}

export default MuiChip;
