import { Chip, SxProps, useTheme } from "@mui/material";

interface IMuiChip {
  label: string;
  sx?: SxProps;
}

function MuiChip(props: IMuiChip) {
  //! State
  const { label, sx } = props;
  const theme: any = useTheme();

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
        background: `${theme.palette.primary.light} !important`,
        color: theme.colors.custom.primaryColorTypo,
        ...sx,
      }}
    />
  );
}

export default MuiChip;
