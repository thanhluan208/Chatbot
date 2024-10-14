import { Box, BoxProps } from '@mui/material';

export default function CenterBox({ children, sx, ...prop }: BoxProps) {
  return (
    <Box
      sx={{
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        ...sx,
      }}
      {...prop}
    >
      {children}
    </Box>
  );
}
