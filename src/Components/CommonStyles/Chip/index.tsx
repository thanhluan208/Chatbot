import { Chip, SxProps } from "@mui/material";

interface IMuiChip {
  label: string;
  sx?: SxProps;
  handleDelete?: () => void;
}

function MuiChip(props: IMuiChip) {
  //! State
  const { label, sx, handleDelete } = props;

  //! Function

  //! Render
  return (
    <Chip
      label={label}
      sx={{
        span: {
          padding: "0 4px",
          fontSize: "14px",
          fontWeight: 550,
        },
        padding: "4px 12px",
        borderRadius: "8px",
        height: "fit-content",
        gap: '8px',
        svg: {
          width: "16px",
          height: "16px",
        },
        ...sx,
      }}
      onDelete={handleDelete}
    />
  );
}

export default MuiChip;
