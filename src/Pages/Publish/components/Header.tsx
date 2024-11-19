
import { ChevronLeft } from '@/Components/CommonIcons/ChevronLeft';
import CenterBox from '@/Components/CommonStyles/Centerbox';
import { Button, IconButton, Theme, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function PublishPageHeader() {
  const theme: Theme = useTheme();
  const mode = useMemo<boolean>(
    () => theme.palette.mode === 'light',
    [theme.palette.mode]
  );

  return (
    <CenterBox
      sx={{
        height: '74px',
        padding: '1rem',
        width: '100%',
        gap: '.75rem',
        position: 'sticky',
        top: 0,
        '*': { height: '100%' },
        bgcolor: mode ? '#f7f7fa': 'black',
        
        boxShadow: `0px 5px 5px  rgba(${mode ? '0,0,0' : '255,255,255'},.25)`,
        borderBottom: `1px solid rgba(${mode ? '0,0,0' : '255,255,255'},.25)`,
        zIndex: 2
      }}
    >
      <IconButton
        sx={{
          padding: 0,
          width: '32px',
          height: '32px !important',
          borderRadius: '.75rem',
        }}
      >
        <ChevronLeft />
      </IconButton>
      <CenterBox
        sx={{
          fontSize: '18px',
          fontWeight: 600,
        }}
      >
        Publish
      </CenterBox>
      <CenterBox sx={{ flex: 1 }} />
      <Button
        sx={{
          fontSize: '14px',
          width: '92px !important',
          height: '32px !important',
          fontWeight: 600,
          textTransform: 'none',
          border: 'none !important',
          borderRadius: '8px',
          color: 'white',
          bgcolor: 'rgb(50, 56, 246)',
          ':hover': {
            bgcolor: 'rgb(180, 186, 246)',
          },
        }}
      >
        Publish
      </Button>
    </CenterBox>
  );
}
