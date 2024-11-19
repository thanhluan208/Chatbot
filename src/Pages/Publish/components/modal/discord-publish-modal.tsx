import CenterBox from '@/Components/CommonStyles/Centerbox';
import { TextField, Typography } from '@mui/material';
import { Fragment } from 'react/jsx-runtime';

export default function DiscordPublishModal() {
  return (
    <Fragment>
      <CenterBox
        sx={{
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            span: {
              color: 'rgb(77, 83, 232)',
              fontWeight: '600',
              cursor: 'pointer',
            },
          }}
        >
          Connect to Discord bots and chat with this bot in Discord App.{' '}
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            span: {
              color: 'rgb(77, 83, 232)',
              fontWeight: '600',
              cursor: 'pointer',
            },
          }}
        >
          <span>How to get Discord Bot Token?</span>{' '}
        </Typography>
      </CenterBox>
      <CenterBox sx={{ width: '100%', py: '3rem', flexDirection: 'column' }}>
        <CenterBox
          sx={{
            gap: '.5rem',
            justifyContent: 'start',
            width: '100%',
            '*': {
              fontSize: '14px',
              fontWeight: '600',
            },
          }}
        >
          <CenterBox>Discord bot token</CenterBox>
          <CenterBox
            sx={{
              color: 'red',
              userSelect: 'none',
            }}
          >
            *
          </CenterBox>
        </CenterBox>
        <CenterBox sx={{ position: 'relative', width: '100%' }}>
          <TextField
            placeholder="Please enterDiscord bot token"
            fullWidth
            sx={{
              borderRadius: '8px',
              border: '1px solid rgb(240, 240, 245)',
              bgcolor: 'white',
              input: {
                padding: '.5rem',
              },
            }}
            // onMouseOver={() => {
            //   setChangelogHover(true);
            // }}
            // onMouseLeave={() => {
            //   setChangelogHover(false);
            // }}
            // value={changelogText}
            // onChange={(e) => {
            //   if (e.target.value.length <= 2000) {
            //     setChangelogText(e.target.value);
            //   }
            // }}
          />
        </CenterBox>
      </CenterBox>
    </Fragment>
  );
}
