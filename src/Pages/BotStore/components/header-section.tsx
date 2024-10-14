import CenterBox from '@/Components/CommonStyles/Centerbox';
import { useBotStore } from '..';
import { Button, Typography } from '@mui/material';

export default function HeaderSection() {
  const {} = useBotStore();
  return (
    <CenterBox
      sx={{
        width: '100%',
        height: '40vh',
        // bgcolor: 'green',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <CenterBox
        sx={{
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          //   justifyContent: 'start',
          alignItems: 'start',
          
        }}
      >
        <Typography
          sx={{
            textTransform: 'uppercase',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          Alphii bot store
        </Typography>
        <Typography>Find your bot today</Typography>
        <CenterBox
          sx={{
            gap: '1rem',
            mt: '.5rem',
            button: {
              width: '150px',
              bgcolor: 'rgb(78, 64, 229) !important',
              outline: 'none !important',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0px 0px 4px 2px rgba(0,0,0,.5)'
            },
          }}
        >
          <Button>A</Button>
          <Button>B</Button>
        </CenterBox>
      </CenterBox>
      <CenterBox
        sx={{
          width: '500px',
          bgcolor: 'blue',
          height: '100%',
          maxWidth: '100%',
          minWidth: '50%',
          borderRadius: '1rem',
          position: 'relative',
          boxShadow: '0px 0px 10px 0px inset black',
          overflow: 'hidden',
          '*': {
            transition: '.5s',
            color: 'white',
          },
          '&:hover > .overlay': {
            opacity: 1
          },
          '&:hover > .overlay1': {
            bottom: '1rem'
          },
          '&:hover > .overlay2': {
            bottom: '1rem'
          },
        }}
      >
        <CenterBox
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: .5,
            transition: '.5s',
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05646008403361347) 0%, rgba(0,0,0,1) 90%)',
          }}
        />
        <CenterBox
          className="overlay1"
          sx={{
            position: 'absolute',
            bottom: '-5rem',
            left: '1rem',
            width: 'calc(100% - 2rem)',
            flexDirection: 'column',
            gap: '.5rem',
            transition: '.5s',
          }}
        >
          <CenterBox
            sx={{ gap: '.5rem', height: '3rem', flex: 1, width: '100%' }}
          >
            <CenterBox
              sx={{
                width: '3rem',
                height: '3rem',
                bgcolor: 'white',
                borderRadius: '8px',
              }}
            ></CenterBox>
            <CenterBox
              sx={{
                flexDirection: 'column',
                height: '100%',
                flex: 1,
                alignItems: 'start',
              }}
            >
              <CenterBox
                sx={{
                  height: '2rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                Bot title
              </CenterBox>
              <CenterBox sx={{ gap: '.25rem' }}>
                <CenterBox
                  sx={{
                    width: '1rem',
                    height: '1rem',
                    bgcolor: 'white',
                    borderRadius: '4px',
                  }}
                ></CenterBox>
                <CenterBox
                  sx={{
                    flex: 1,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Author name
                </CenterBox>
              </CenterBox>
            </CenterBox>
          </CenterBox>
          <CenterBox
            sx={{
              width: '100%',
              height: '5rem',
              overflow: 'auto',
              alignItems: 'start',
              '&::-webkit-scrollbar': {
                display: 'none',
              }
            }}
          >
            this is a bot description this is a bot description this is a bot
            description this is a bot description this is a bot description this
            is a bot description this is a bot description this is a bot
            description this is a bot description this is a bot description this
            is a bot description
          </CenterBox>
        </CenterBox>
        <CenterBox className='overlay2'></CenterBox>
        {/* < */}
      </CenterBox>
      <CenterBox></CenterBox>
    </CenterBox>
  );
}
