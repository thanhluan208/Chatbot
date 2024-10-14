import InputField from '@/Components/CommonFields/InputField';
import CenterBox from '@/Components/CommonStyles/Centerbox';
import { useTheme } from '@emotion/react';
import { Button, Theme, Typography } from '@mui/material';

export default function PublishBody() {
  const theme: Theme = useTheme();
  return (
    <CenterBox sx={{ flex: 1, width: '100%', alignItems: 'start' }}>
      <CenterBox
        sx={{
          maxWidth: '800px',
          width: '100%',
          // bgcolor: 'blue',
          pt: '20px',
          flexDirection: 'column',
        }}
      >
        <CenterBox sx={{ width: '100%', justifyContent: 'start', gap: '1rem' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
            Changelog
          </Typography>
          <Button
            sx={{
              fontSize: '12px',
              color: 'rgb(77, 83, 232)',
              paddingY: 0,
              //   bgcolor: 'white'
              borderRadius: '.5rem',
              border: `2px solid ${theme.colors.custom.borderColor}`,
            }}
          >
            Generate
          </Button>
        </CenterBox>

        <CenterBox
          sx={{ width: '100%', justifyContent: 'start', gap: '.5rem' }}
        >
          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
            Publish to
          </Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'red' }}>
            *
          </Typography>
        </CenterBox>
      </CenterBox>
    </CenterBox>
  );
}
